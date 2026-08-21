import { config } from '@/constants/config';

/**
 * Sentry is a native module and is not present in Expo Go, where importing it
 * at module scope crashes the app before the first screen renders. Monitoring
 * is support scaffolding, not a feature — if it cannot load, the app must still
 * run. Resolved lazily so a missing native side degrades to console logging.
 */
type SentryModule = typeof import('@sentry/react-native');

let sentry: SentryModule | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  sentry = require('@sentry/react-native') as SentryModule;
} catch {
  sentry = null;
}

/** False in Expo Go and anywhere the native module is unavailable. */
export const monitoringAvailable = sentry !== null;

/**
 * Crash/error monitoring (spec §58: "error monitoring without exposing
 * sensitive report content"). The scrubbing hooks drop anything that could
 * carry a property address or report body out of an event or breadcrumb.
 */
const SENSITIVE_KEYS = [
  'address_line',
  'listing_url',
  'customer_notes',
  'verifier_summary',
  'note',
  'phone',
  'email',
  'contact_phone',
  'contact_email',
];

function scrub(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(scrub);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
        key,
        SENSITIVE_KEYS.includes(key) ? '[redacted]' : scrub(entry),
      ]),
    );
  }
  return value;
}

export function initMonitoring() {
  if (!config.sentryDsn || !sentry) return;
  sentry.init({
    dsn: config.sentryDsn,
    environment: config.env,
    // Report bodies and addresses must never leave the device in a crash report.
    sendDefaultPii: false,
    tracesSampleRate: config.env === 'production' ? 0.2 : 1,
    beforeSend(event) {
      if (event.extra) event.extra = scrub(event.extra) as Record<string, unknown>;
      if (event.contexts) event.contexts = scrub(event.contexts) as typeof event.contexts;
      return event;
    },
    beforeBreadcrumb(breadcrumb) {
      if (breadcrumb.data) breadcrumb.data = scrub(breadcrumb.data) as Record<string, unknown>;
      return breadcrumb;
    },
  });
}

export function captureError(error: unknown, context?: Record<string, string>) {
  if (__DEV__) console.error(error, context);
  if (!config.sentryDsn || !sentry) return;
  sentry.captureException(error, { tags: context });
}

/** Ties errors to a user without shipping their email or name. */
export function setMonitoringUser(userId: string | null, role?: string) {
  if (!config.sentryDsn || !sentry) return;
  sentry.setUser(userId ? { id: userId, role } : null);
}
