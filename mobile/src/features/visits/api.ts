import { supabase, toUserFacingError } from '@/lib/supabase/client';
import type {
  CancellationReason,
  Property,
  Visit,
  VisitWithDetails,
} from '@/types';

/**
 * Every query here is scoped by RLS, not by a client-side filter. The `.eq()`
 * calls are for efficiency; the database is what actually enforces ownership.
 */

const VISIT_SELECT = `
  *,
  property:properties!inner (*),
  property_contact:property_contacts (*),
  priorities:visit_priorities (*),
  verifier:verifier_public_cards!visits_verifier_id_fkey (*),
  events:visit_events (*),
  report:reports (id, listing_match, submitted_at)
`;

function normalise(row: Record<string, unknown>): VisitWithDetails {
  const first = <T,>(value: T | T[] | null): T | null =>
    Array.isArray(value) ? (value[0] ?? null) : (value ?? null);

  return {
    ...(row as unknown as Visit),
    property: row.property as Property,
    property_contact: first(row.property_contact as never),
    priorities: (row.priorities ?? []) as VisitWithDetails['priorities'],
    verifier: first(row.verifier as never),
    events: (row.events ?? []) as VisitWithDetails['events'],
    report: first(row.report as never),
  };
}

export async function fetchCustomerVisits(customerId: string): Promise<VisitWithDetails[]> {
  const { data, error } = await supabase
    .from('visits')
    .select(VISIT_SELECT)
    .eq('customer_id', customerId)
    .order('scheduled_at', { ascending: true });
  if (error) throw toUserFacingError(error);
  return (data ?? []).map(normalise);
}

export async function fetchVerifierVisits(verifierId: string): Promise<VisitWithDetails[]> {
  const { data, error } = await supabase
    .from('visits')
    .select(VISIT_SELECT)
    .eq('verifier_id', verifierId)
    .order('scheduled_at', { ascending: true });
  if (error) throw toUserFacingError(error);
  return (data ?? []).map(normalise);
}

export async function fetchVisit(visitId: string): Promise<VisitWithDetails> {
  const { data, error } = await supabase
    .from('visits')
    .select(VISIT_SELECT)
    .eq('id', visitId)
    .single();
  if (error) throw toUserFacingError(error);
  return normalise(data);
}

export interface CreateVisitInput {
  customerId: string;
  property: Omit<Property, 'id' | 'customer_id' | 'created_at' | 'updated_at'>;
  scheduledAt: string;
  expectedDurationMinutes: number;
  contact: {
    name: string | null;
    contact_type: 'landlord' | 'agent' | 'tenant' | 'other';
    phone: string | null;
    email: string | null;
  };
  accessConfirmed: boolean;
  priorities: string[];
  customerNotes: string | null;
  liveCallProvider: 'google_meet' | 'whatsapp' | 'zoom' | 'other' | null;
  recordingRequested: boolean;
  photosRequested: boolean;
}

/**
 * Creates the property, the visit, its contact and its priorities.
 *
 * The visit starts as `draft`: it becomes a real request only when the Stripe
 * webhook confirms payment (spec §45). If a later insert fails we delete the
 * property again so a retry does not leave orphan rows behind.
 */
export async function createVisitDraft(input: CreateVisitInput): Promise<Visit> {
  const { data: property, error: propertyError } = await supabase
    .from('properties')
    .insert({ ...input.property, customer_id: input.customerId })
    .select()
    .single();
  if (propertyError) throw toUserFacingError(propertyError);

  const { data: visit, error: visitError } = await supabase
    .from('visits')
    .insert({
      customer_id: input.customerId,
      property_id: property.id,
      scheduled_at: input.scheduledAt,
      expected_duration_minutes: input.expectedDurationMinutes,
      status: 'draft',
      access_confirmed: input.accessConfirmed,
      live_call_provider: input.liveCallProvider,
      recording_requested: input.recordingRequested,
      // Never set from a customer request — consent is recorded on site.
      recording_allowed: false,
      photos_requested: input.photosRequested,
      photos_allowed: false,
      customer_notes: input.customerNotes,
    })
    .select()
    .single();

  if (visitError) {
    await supabase.from('properties').delete().eq('id', property.id);
    throw toUserFacingError(visitError);
  }

  const { error: contactError } = await supabase.from('property_contacts').insert({
    visit_id: visit.id,
    name: input.contact.name,
    contact_type: input.contact.contact_type,
    phone: input.contact.phone,
    email: input.contact.email,
  });
  if (contactError) throw toUserFacingError(contactError);

  if (input.priorities.length > 0) {
    const { error: prioritiesError } = await supabase.from('visit_priorities').insert(
      input.priorities.map((priority_key) => ({
        visit_id: visit.id,
        priority_key,
        selected: true,
      })),
    );
    if (prioritiesError) throw toUserFacingError(prioritiesError);
  }

  return visit;
}

export async function cancelVisit(visitId: string, reason: CancellationReason) {
  const { error } = await supabase
    .from('visits')
    .update({ status: 'cancelled', cancellation_reason: reason })
    .eq('id', visitId);
  if (error) throw toUserFacingError(error);
}

export async function checkIn(visitId: string) {
  const { error } = await supabase.rpc('verifier_check_in', { p_visit_id: visitId });
  if (error) throw toUserFacingError(error);
}

export async function checkOut(visitId: string) {
  const { error } = await supabase.rpc('verifier_check_out', { p_visit_id: visitId });
  if (error) throw toUserFacingError(error);
}

export async function recordCaptureConsent(
  visitId: string,
  photosAllowed: boolean,
  recordingAllowed: boolean,
) {
  const { error } = await supabase.rpc('record_capture_consent', {
    p_visit_id: visitId,
    p_photos_allowed: photosAllowed,
    p_recording_allowed: recordingAllowed,
  });
  if (error) throw toUserFacingError(error);
}

export async function markEnRoute(visitId: string) {
  const { error } = await supabase
    .from('visits')
    .update({ status: 'verifier_en_route' })
    .eq('id', visitId);
  if (error) throw toUserFacingError(error);
  await supabase.from('visit_events').insert({
    visit_id: visitId,
    event_type: 'verifier_en_route',
  });
}

export async function startLiveCall(visitId: string, url: string) {
  const { error } = await supabase
    .from('visits')
    .update({ status: 'live', live_call_url: url, live_call_ready: true })
    .eq('id', visitId);
  if (error) throw toUserFacingError(error);
  await supabase.from('visit_events').insert({ visit_id: visitId, event_type: 'live_started' });
}
