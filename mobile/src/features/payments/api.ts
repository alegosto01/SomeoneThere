import { supabase, toUserFacingError } from '@/lib/supabase/client';
import type { Payment } from '@/types';

export async function fetchPaymentForVisit(visitId: string): Promise<Payment | null> {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('visit_id', visitId)
    .maybeSingle();
  if (error) throw toUserFacingError(error);
  return data;
}

/** Verifier earnings are derived from completed visits, not from payment rows. */
export async function fetchVerifierEarnings(verifierId: string) {
  const { data, error } = await supabase
    .from('visits')
    .select('id, scheduled_at, status')
    .eq('verifier_id', verifierId)
    .in('status', ['visit_completed', 'report_pending', 'report_ready']);
  if (error) throw toUserFacingError(error);
  return data ?? [];
}
