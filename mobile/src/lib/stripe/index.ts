import { supabase } from '@/lib/supabase/client';

/**
 * Payments (spec §45). The client asks the backend for a PaymentIntent and
 * never sees or sends an amount; the visit is only marked paid by the Stripe
 * webhook, so a compromised or buggy client cannot fake a successful booking.
 */

export interface PaymentIntentResult {
  clientSecret: string;
  amount: number;
  currency: string;
}

export async function createPaymentIntent(visitId: string): Promise<PaymentIntentResult> {
  const { data, error } = await supabase.functions.invoke('create-payment-intent', {
    body: { visit_id: visitId },
  });
  if (error) throw error;
  if (!data?.client_secret) throw new Error('payment_setup_failed');

  return {
    clientSecret: data.client_secret as string,
    amount: data.amount as number,
    currency: data.currency as string,
  };
}

/** Price shown in the review step before an intent exists. */
export const VISIT_PRICE = { amount: 49, currency: 'EUR' } as const;
