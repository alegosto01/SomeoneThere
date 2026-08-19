import type {
  AnswerSource,
  CancellationReason,
  ListingMatch,
  LiveCallProvider,
  MediaType,
  ObservationRating,
  PaymentStatus,
  PropertyContactType,
  PropertyType,
  UserRole,
  VisitEventType,
  VisitStatus,
} from './domain';

export interface Profile {
  id: string;
  role: UserRole;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  preferred_language: string | null;
  created_at: string;
  updated_at: string;
}

export interface VerifierProfile {
  user_id: string;
  bio: string | null;
  identity_verified: boolean;
  languages: string[];
  completed_visits: number;
  average_rating: number | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

/** Verifier data a customer is allowed to see (spec §16). */
export interface VerifierPublicCard {
  user_id: string;
  first_name: string;
  last_initial: string;
  avatar_url: string | null;
  identity_verified: boolean;
  languages: string[];
  bio: string | null;
  completed_visits: number;
  average_rating: number | null;
}

export interface Property {
  id: string;
  customer_id: string;
  listing_url: string | null;
  address_line: string;
  city: string;
  postal_code: string | null;
  neighborhood: string | null;
  property_type: PropertyType;
  advertised_rent: number | null;
  created_at: string;
  updated_at: string;
}

export interface PropertyContact {
  id: string;
  visit_id: string;
  name: string | null;
  contact_type: PropertyContactType;
  phone: string | null;
  email: string | null;
  created_at: string;
}

export interface Visit {
  id: string;
  customer_id: string;
  property_id: string;
  verifier_id: string | null;
  scheduled_at: string;
  expected_duration_minutes: number;
  status: VisitStatus;
  live_call_url: string | null;
  live_call_provider: LiveCallProvider | null;
  live_call_ready: boolean;
  recording_requested: boolean;
  recording_allowed: boolean;
  photos_requested: boolean;
  photos_allowed: boolean;
  access_confirmed: boolean;
  customer_notes: string | null;
  cancellation_reason: CancellationReason | null;
  checked_in_at: string | null;
  checked_out_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface VisitPriority {
  id: string;
  visit_id: string;
  priority_key: string;
  selected: boolean;
  customer_note: string | null;
}

export interface VisitEvent {
  id: string;
  visit_id: string;
  event_type: VisitEventType;
  actor_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface Report {
  id: string;
  visit_id: string;
  listing_match: ListingMatch | null;
  verifier_summary: string | null;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReportObservation {
  id: string;
  report_id: string;
  category: string;
  rating: ObservationRating;
  note: string | null;
  sort_order: number;
}

export interface ReportDifference {
  id: string;
  report_id: string;
  description: string;
  severity: string | null;
}

export interface ReportQuestion {
  id: string;
  report_id: string;
  question: string;
  answer: string | null;
  answer_source: AnswerSource | null;
}

export interface ReportUncheckedArea {
  id: string;
  report_id: string;
  description: string;
}

export interface ReportMedia {
  id: string;
  report_id: string;
  storage_path: string;
  media_type: MediaType;
  caption: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  visit_id: string;
  customer_id: string;
  stripe_payment_intent_id: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  created_at: string;
  updated_at: string;
}

/** Visit joined with the rows the UI almost always needs alongside it. */
export interface VisitWithDetails extends Visit {
  property: Property;
  property_contact: PropertyContact | null;
  priorities: VisitPriority[];
  verifier: VerifierPublicCard | null;
  events: VisitEvent[];
  report: Pick<Report, 'id' | 'listing_match' | 'submitted_at'> | null;
}

export interface FullReport extends Report {
  visit: Visit & { property: Property };
  verifier: VerifierPublicCard | null;
  observations: ReportObservation[];
  differences: ReportDifference[];
  questions: ReportQuestion[];
  unchecked_areas: ReportUncheckedArea[];
  media: ReportMedia[];
}
