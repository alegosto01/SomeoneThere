import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Storage adapter for the Supabase auth session.
 *
 * Session tokens are credentials, so on device they belong in the OS keystore
 * (Android Keystore / iOS Keychain) rather than in AsyncStorage, which is
 * plaintext on disk and readable on a rooted device or from a backup.
 *
 * SecureStore caps a value at 2048 bytes and a Supabase session carrying a fat
 * JWT can exceed that, so values are split across numbered chunks. A small index
 * entry records how many chunks a key currently has, which is also what lets a
 * shrinking value clean up the chunks it no longer needs.
 */
const CHUNK_SIZE = 1800;

function chunkKey(key: string, index: number) {
  return `${key}.${index}`;
}

async function readChunkCount(key: string): Promise<number> {
  const raw = await SecureStore.getItemAsync(`${key}.chunks`);
  const parsed = raw ? Number.parseInt(raw, 10) : 0;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

async function clearChunks(key: string, from = 0) {
  const count = await readChunkCount(key);
  for (let index = from; index < count; index += 1) {
    await SecureStore.deleteItemAsync(chunkKey(key, index));
  }
}

export const secureSessionStorage = {
  async getItem(key: string): Promise<string | null> {
    // Web has no SecureStore; expo-router's web target falls back to AsyncStorage.
    if (Platform.OS === 'web') return AsyncStorage.getItem(key);

    const count = await readChunkCount(key);
    if (count === 0) return null;

    const parts: string[] = [];
    for (let index = 0; index < count; index += 1) {
      const part = await SecureStore.getItemAsync(chunkKey(key, index));
      // A missing chunk means a partially-written session; treat it as absent
      // rather than handing back a truncated token.
      if (part === null) return null;
      parts.push(part);
    }
    return parts.join('');
  },

  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') return AsyncStorage.setItem(key, value);

    const chunks: string[] = [];
    for (let offset = 0; offset < value.length; offset += CHUNK_SIZE) {
      chunks.push(value.slice(offset, offset + CHUNK_SIZE));
    }

    const previous = await readChunkCount(key);
    for (const [index, chunk] of chunks.entries()) {
      await SecureStore.setItemAsync(chunkKey(key, index), chunk);
    }
    // Drop chunks left over from a longer previous value.
    for (let index = chunks.length; index < previous; index += 1) {
      await SecureStore.deleteItemAsync(chunkKey(key, index));
    }
    await SecureStore.setItemAsync(`${key}.chunks`, String(chunks.length));
  },

  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') return AsyncStorage.removeItem(key);
    await clearChunks(key);
    await SecureStore.deleteItemAsync(`${key}.chunks`);
  },
};
