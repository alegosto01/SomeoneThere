import * as Sentry from '@sentry/react-native';

import { config } from '@/constants/config';

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
  if (!config.sentryDsn) return;
  Sentry.init({
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
  if (!config.sentryDsn) return;
  Sentry.captureException(error, { tags: context });
}

/** Ties errors to a user without shipping their email or name. */
export function setMonitoringUser(userId: string | null, role?: string) {
  if (!config.sentryDsn) return;
  Sentry.setUser(userId ? { id: userId, role } : null);
}
