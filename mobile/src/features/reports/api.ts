import { supabase, toUserFacingError } from '@/lib/supabase/client';
import { signVisitMediaUrls } from '@/lib/supabase/storage';
import type {
  AnswerSource,
  FullReport,
  ListingMatch,
  ObservationRating,
  ReportMedia,
} from '@/types';

// The verifier hangs off the visit, not the report — reports have no verifier
// column of their own, so the card is embedded through `visits.verifier_id`.
const REPORT_SELECT = `
  *,
  visit:visits!inner (
    *,
    property:properties!inner (*),
    verifier:verifier_public_cards!visits_verifier_id_fkey (*)
  ),
  observations:report_observations (*),
  differences:report_differences (*),
  questions:report_questions (*),
  unchecked_areas:report_unchecked_areas (*),
  media:report_media (*)
`;

/** Reports list for the customer — only submitted ones are readable by RLS. */
export async function fetchCustomerReports(customerId: string) {
  const { data, error } = await supabase
    .from('reports')
    .select(
      `id, listing_match, submitted_at,
       visit:visits!inner (id, customer_id, scheduled_at, verifier_id,
         property:properties!inner (address_line, city))`,
    )
    .eq('visit.customer_id', customerId)
    .not('submitted_at', 'is', null)
    .order('submitted_at', { ascending: false });
  if (error) throw toUserFacingError(error);
  return data ?? [];
}

export async function fetchReport(reportId: string): Promise<FullReport> {
  const { data, error } = await supabase
    .from('reports')
    .select(REPORT_SELECT)
    .eq('id', reportId)
    .single();
  if (error) throw toUserFacingError(error);

  return normaliseReport(data as Record<string, unknown>);
}

export async function fetchReportByVisit(visitId: string): Promise<FullReport | null> {
  const { data, error } = await supabase
    .from('reports')
    .select(REPORT_SELECT)
    .eq('visit_id', visitId)
    .maybeSingle();
  if (error) throw toUserFacingError(error);
  if (!data) return null;
  return normaliseReport(data as Record<string, unknown>);
}

/** Lifts the verifier card out of the nested visit and orders observations. */
function normaliseReport(row: Record<string, unknown>): FullReport {
  const visit = row.visit as Record<string, unknown>;
  const embedded = visit?.verifier;
  const verifier = Array.isArray(embedded) ? (embedded[0] ?? null) : (embedded ?? null);

  const observations = ((row.observations ?? []) as FullReport['observations'])
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order);

  return {
    ...(row as unknown as FullReport),
    verifier: verifier as FullReport['verifier'],
    observations,
  };
}

/** Signed URLs for a report's photos — private bucket, short-lived (spec §27). */
export async function signReportMedia(media: ReportMedia[]): Promise<Record<string, string>> {
  return signVisitMediaUrls(media.map((item) => item.storage_path));
}

export async function upsertObservation(params: {
  reportId: string;
  category: string;
  rating: ObservationRating;
  note: string | null;
  sortOrder: number;
}) {
  const { error } = await supabase.from('report_observations').upsert(
    {
      report_id: params.reportId,
      category: params.category,
      rating: params.rating,
      note: params.note,
      sort_order: params.sortOrder,
    },
    { onConflict: 'report_id,category' },
  );
  if (error) throw toUserFacingError(error);
}

export async function saveReportDraft(params: {
  reportId: string;
  listingMatch: ListingMatch | null;
  verifierSummary: string | null;
}) {
  const { error } = await supabase
    .from('reports')
    .update({
      listing_match: params.listingMatch,
      verifier_summary: params.verifierSummary,
    })
    .eq('id', params.reportId);
  if (error) throw toUserFacingError(error);
}

export async function replaceDifferences(reportId: string, descriptions: string[]) {
  await supabase.from('report_differences').delete().eq('report_id', reportId);
  if (descriptions.length === 0) return;
  const { error } = await supabase
    .from('report_differences')
    .insert(descriptions.map((description) => ({ report_id: reportId, description })));
  if (error) throw toUserFacingError(error);
}

export async function replaceUncheckedAreas(reportId: string, descriptions: string[]) {
  await supabase.from('report_unchecked_areas').delete().eq('report_id', reportId);
  if (descriptions.length === 0) return;
  const { error } = await supabase
    .from('report_unchecked_areas')
    .insert(descriptions.map((description) => ({ report_id: reportId, description })));
  if (error) throw toUserFacingError(error);
}

export async function replaceQuestions(
  reportId: string,
  questions: { question: string; answer: string; answer_source: AnswerSource | null }[],
) {
  await supabase.from('report_questions').delete().eq('report_id', reportId);
  if (questions.length === 0) return;
  const { error } = await supabase
    .from('report_questions')
    .insert(questions.map((entry) => ({ report_id: reportId, ...entry })));
  if (error) throw toUserFacingError(error);
}

export async function addReportMedia(params: {
  reportId: string;
  storagePath: string;
  caption: string | null;
}) {
  const { error } = await supabase.from('report_media').insert({
    report_id: params.reportId,
    storage_path: params.storagePath,
    media_type: 'photo',
    caption: params.caption,
  });
  if (error) throw toUserFacingError(error);
}

/**
 * Submission goes through the RPC, which re-checks the minimum content
 * server-side and flips the visit to `report_ready` in the same transaction.
 */
export async function submitReport(reportId: string) {
  const { error } = await supabase.rpc('submit_report', { p_report_id: reportId });
  if (error) throw toUserFacingError(error);
}
