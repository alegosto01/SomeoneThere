import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

import { config } from '@/constants/config';

import type { Database } from './database.types';

/**
 * Single Supabase client for the app. Sessions persist in AsyncStorage;
 * `detectSessionInUrl` is off because there is no browser URL to read on native.
 */
export const supabase = createClient<Database>(config.supabaseUrl, config.supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    headers: { 'x-application-name': 'someonethere-mobile' },
  },
});

/** Narrow PostgREST errors into something the UI can show without leaking SQL. */
export function toUserFacingError(error: unknown): Error {
  if (error && typeof error === 'object' && 'message' in error) {
    const message = String((error as { message: unknown }).message);
    if (message.includes('row-level security') || message.includes('permission denied')) {
      return new Error('errors.not_allowed');
    }
    if (message.includes('Failed to fetch') || message.includes('Network request failed')) {
      return new Error('errors.network');
    }
    return new Error(message);
  }
  return new Error('errors.unknown');
}
