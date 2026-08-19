/**
 * Stripe webhook — the only thing that may mark a visit as paid (spec §45).
 *
 * The mobile client's word is never enough: it reports success optimistically,
 * but the visit only advances to `request_received` when Stripe tells us here.
 *
 * Deploy: supabase functions deploy stripe-webhook --no-verify-jwt
 * Secrets: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
});

const admin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  if (!signature) return new Response('missing signature', { status: 400 });

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!,
      undefined,
      Stripe.createSubtleCryptoProvider(),
    );
  } catch (error) {
    console.error('signature verification failed', error);
    return new Response('invalid signature', { status: 400 });
  }

  const intent = event.data.object as Stripe.PaymentIntent;
  const visitId = intent.metadata?.visit_id;

  switch (event.type) {
    case 'payment_intent.succeeded': {
      if (!visitId) break;
      await admin
        .from('payments')
        .update({ status: 'succeeded' })
        .eq('stripe_payment_intent_id', intent.id);

      // Payment does not mean access is confirmed — the visit lands in
      // `request_received` and an operator confirms access separately (spec §13).
      await admin
        .from('visits')
        .update({ status: 'request_received' })
        .eq('id', visitId)
        .in('status', ['draft', 'payment_pending']);

      await admin.from('visit_events').insert({
        visit_id: visitId,
        event_type: 'booking_received',
        metadata: { stripe_payment_intent_id: intent.id },
      });
      break;
    }

    case 'payment_intent.payment_failed': {
      await admin
        .from('payments')
        .update({ status: 'failed' })
        .eq('stripe_payment_intent_id', intent.id);
      break;
    }

    case 'charge.refunded': {
      const charge = event.data.object as unknown as Stripe.Charge;
      const intentId =
        typeof charge.payment_intent === 'string' ? charge.payment_intent : null;
      if (!intentId) break;

      const fullyRefunded = charge.amount_refunded >= charge.amount;
      const { data: payment } = await admin
        .from('payments')
        .update({ status: fullyRefunded ? 'refunded' : 'partially_refunded' })
        .eq('stripe_payment_intent_id', intentId)
        .select('visit_id')
        .maybeSingle();

      if (payment?.visit_id && fullyRefunded) {
        await admin.from('visits').update({ status: 'refunded' }).eq('id', payment.visit_id);
        await admin.from('visit_events').insert({
          visit_id: payment.visit_id,
          event_type: 'refund_issued',
        });
      }
      break;
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
