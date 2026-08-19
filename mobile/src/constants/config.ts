/**
 * Runtime configuration read from EXPO_PUBLIC_* env vars. Only public values
 * belong here — anything secret lives in Supabase Edge Function secrets.
 */
function required(name: string, value: string | undefined): string {
  if (!value) {
    if (__DEV__) {
      console.warn(`[config] Missing ${name}. Copy .env.example to .env and fill it in.`);
    }
    return '';
  }
  return value;
}

export const config = {
  supabaseUrl: required('EXPO_PUBLIC_SUPABASE_URL', process.env.EXPO_PUBLIC_SUPABASE_URL),
  supabaseAnonKey: required(
    'EXPO_PUBLIC_SUPABASE_ANON_KEY',
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  ),
  stripePublishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '',
  sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN ?? '',
  supportEmail: process.env.EXPO_PUBLIC_SUPPORT_EMAIL ?? 'support@someonethere.example',
  env: process.env.EXPO_PUBLIC_ENV ?? 'development',
} as const;

/** Initial market (spec §52). Timestamps are stored UTC, rendered here. */
export const MARKET_TIMEZONE = 'Europe/Madrid';
export const DEFAULT_CITY = 'Madrid';
export const DEFAULT_CURRENCY = 'EUR';
export const STORAGE_BUCKET_AVATARS = 'avatars';
export const STORAGE_BUCKET_VISIT_MEDIA = 'visit-media';
