/**
 * Shared domain enums. Every status/rating value in the app and the database
 * comes from here — no free-text status strings anywhere (spec §14, §61).
 */

export type UserRole = 'customer' | 'verifier' | 'admin';

export const VISIT_STATUSES = [
  'draft',
  'payment_pending',
  'request_received',
  'access_pending',
  'access_confirmed',
  'verifier_pending',
  'verifier_assigned',
  'verifier_en_route',
  'verifier_arrived',
  'live',
  'visit_completed',
  'report_pending',
  'report_ready',
  'cancelled',
  'access_failed',
  'refunded',
] as const;

export type VisitStatus = (typeof VISIT_STATUSES)[number];

export type PropertyType = 'room' | 'studio' | 'apartment' | 'other';

export type PropertyContactType = 'landlord' | 'agent' | 'tenant' | 'other';

export type ListingMatch =
  | 'consistent'
  | 'minor_differences'
  | 'major_differences'
  | 'unable_to_determine';

export type ObservationRating =
  | 'good'
  | 'acceptable'
  | 'concern'
  | 'not_checked'
  | 'not_applicable';

export type AnswerSource = 'landlord' | 'agent' | 'tenant' | 'other';

export type CancellationReason =
  | 'customer_cancelled'
  | 'property_contact_cancelled'
  | 'verifier_cancelled'
  | 'access_denied'
  | 'no_show'
  | 'other';

export type PaymentStatus =
  | 'requires_payment_method'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

export type MediaType = 'photo' | 'video' | 'document';

export type LiveCallProvider = 'google_meet' | 'whatsapp' | 'zoom' | 'other';

export type VisitEventType =
  | 'booking_received'
  | 'access_confirmed'
  | 'access_failed'
  | 'verifier_assigned'
  | 'verifier_en_route'
  | 'verifier_arrived'
  | 'live_started'
  | 'live_ended'
  | 'visit_completed'
  | 'report_ready'
  | 'visit_cancelled'
  | 'refund_issued';
