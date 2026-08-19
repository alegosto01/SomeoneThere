/**
 * Creates a Stripe PaymentIntent for a visit and moves the visit to
 * `payment_pending` (spec §45).
 *
 * The price is decided here, server-side. The client sends a visit id and
 * nothing else — never an amount.
 *
 * Deploy: supabase functions deploy create-payment-intent
 * Secrets: STRIPE_SECRET_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
});

/** Single MVP package: one remote viewing visit in Madrid. */
const VISIT_PRICE_CENTS = 4900;
const CURRENCY = 'eur';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'unauthorized' }, 401);

    // Client-scoped: resolves the caller and is subject to RLS.
    const asUser = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userData, error: userError } = await asUser.auth.getUser();
    if (userError || !userData.user) return json({ error: 'unauthorized' }, 401);

    const { visit_id: visitId } = await req.json();
    if (typeof visitId !== 'string') return json({ error: 'visit_id is required' }, 400);

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: visit, error: visitError } = await admin
      .from('visits')
      .select('id, customer_id, status')
      .eq('id', visitId)
      .single();
    if (visitError || !visit) return json({ error: 'visit not found' }, 404);
    if (visit.customer_id !== userData.user.id) return json({ error: 'forbidden' }, 403);
    if (!['draft', 'payment_pending'].includes(visit.status)) {
      return json({ error: 'visit is not awaiting payment' }, 409);
    }

    // Reuse an open intent so a retry does not create a second charge.
    const { data: existing } = await admin
      .from('payments')
      .select('stripe_payment_intent_id, status')
      .eq('visit_id', visitId)
      .maybeSingle();

    let paymentIntent;
    if (existing?.stripe_payment_intent_id && existing.status !== 'succeeded') {
      paymentIntent = await stripe.paymentIntents.retrieve(existing.stripe_payment_intent_id);
    } else if (existing?.status === 'succeeded') {
      return json({ error: 'visit is already paid' }, 409);
    } else {
      paymentIntent = await stripe.paymentIntents.create({
        amount: VISIT_PRICE_CENTS,
        currency: CURRENCY,
        automatic_payment_methods: { enabled: true },
        metadata: { visit_id: visitId, customer_id: visit.customer_id },
      });

      await admin.from('payments').upsert(
        {
          visit_id: visitId,
          customer_id: visit.customer_id,
          stripe_payment_intent_id: paymentIntent.id,
          amount: VISIT_PRICE_CENTS / 100,
          currency: CURRENCY.toUpperCase(),
          status: 'requires_payment_method',
        },
        { onConflict: 'visit_id' },
      );
    }

    await admin.from('visits').update({ status: 'payment_pending' }).eq('id', visitId);

    return json({
      client_secret: paymentIntent.client_secret,
      amount: VISIT_PRICE_CENTS / 100,
      currency: CURRENCY.toUpperCase(),
    });
  } catch (error) {
    console.error('create-payment-intent failed', error);
    return json({ error: 'payment_setup_failed' }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
