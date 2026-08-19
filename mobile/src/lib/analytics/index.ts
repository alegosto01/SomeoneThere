/**
 * Analytics abstraction (spec §53).
 *
 * Deliberately thin and deliberately blind: events carry ids and enums, never
 * addresses, listing URLs, contact details, or report text. Swapping the sink
 * for PostHog/Amplitude later means implementing `AnalyticsSink` only.
 */

export type AnalyticsEvent =
  | 'signup_completed'
  | 'viewing_request_started'
  | 'property_added'
  | 'viewing_details_completed'
  | 'priorities_completed'
  | 'payment_started'
  | 'payment_completed'
  | 'visit_opened'
  | 'live_call_joined'
  | 'report_opened'
  | 'booking_cancelled'
  | 'support_opened'
  | 'verifier_checked_in'
  | 'verifier_checked_out'
  | 'report_submitted';

/** Only these keys may ever be attached to an event. */
export interface AnalyticsProperties {
  visit_id?: string;
  report_id?: string;
  role?: string;
  step?: string;
  priority_count?: number;
  property_type?: string;
  provider?: string;
  listing_match?: string;
  has_listing_url?: boolean;
  error_code?: string;
}

export interface AnalyticsSink {
  identify(userId: string, role: string): void;
  track(event: AnalyticsEvent, properties?: AnalyticsProperties): void;
  reset(): void;
}

const consoleSink: AnalyticsSink = {
  identify(userId, role) {
    if (__DEV__) console.log('[analytics] identify', { userId, role });
  },
  track(event, properties) {
    if (__DEV__) console.log('[analytics] track', event, properties ?? {});
  },
  reset() {
    if (__DEV__) console.log('[analytics] reset');
  },
};

let sink: AnalyticsSink = consoleSink;

export function setAnalyticsSink(next: AnalyticsSink) {
  sink = next;
}

export const analytics: AnalyticsSink = {
  identify: (userId, role) => sink.identify(userId, role),
  track: (event, properties) => sink.track(event, properties),
  reset: () => sink.reset(),
};
