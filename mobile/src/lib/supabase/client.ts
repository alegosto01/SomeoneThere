import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

import { config } from '@/constants/config';

import { secureSessionStorage } from './session-storage';

/**
 * Single Supabase client for the app. The session is held in the OS keystore
 * rather than AsyncStorage (see ./session-storage), and `detectSessionInUrl` is
 * off because there is no browser URL to read on native.
 *
 * The client is intentionally untyped. Generated types need a live project:
 *
 *   npx supabase gen types typescript --project-id <ref> \
 *     > src/lib/supabase/database.types.ts
 *
 * then add `<Database>` to createClient below. Until then the row shapes in
 * `src/types/models.ts` are the contract, applied at each call site — a
 * hand-written stand-in for the generated type resolves query builders to
 * `never` and is worse than no type at all.
 */
export const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
  auth: {
    storage: secureSessionStorage,
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
