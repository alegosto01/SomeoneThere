# SomeoneThere mobile — setup

## Prerequisites

- Node 20+
- The Supabase CLI (`npm i -g supabase`)
- A Stripe account in test mode
- For device builds: Android Studio + SDK, or an Expo EAS account

## 1. Install

```bash
cd mobile
npm install
cp .env.example .env
```

## 2. Supabase

### Local

```bash
cd mobile
supabase start
supabase db reset     # applies migrations/ then seed.sql
```

`supabase start` prints the API URL and anon key — put them in `.env` as
`EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.

Demo accounts after a reset (local only, throwaway passwords):

| Role | Email | Password |
| --- | --- | --- |
| Customer | `customer@example.com` | `demo-password` |
| Verifier | `verifier@example.com` | `demo-password` |

### Hosted

```bash
supabase link --project-ref <ref>
supabase db push
```

Then check, in the dashboard:

- **Storage** — `avatars` and `visit-media` both exist and are **not** public.
- **Auth → Providers** — email enabled; Google enabled if you want the Google
  button (add `someonethere://auth/callback` to the redirect URLs).
- **Auth → URL configuration** — site URL `someonethere://`.

New sign-ups become customers automatically. To make someone a verifier, change
their `profiles.role` to `verifier` and insert a `verifier_profiles` row. Users
cannot change their own role — a trigger refuses it.

## 3. Stripe

```bash
cd mobile
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
supabase functions deploy create-payment-intent
supabase functions deploy stripe-webhook --no-verify-jwt
supabase functions deploy notify
```

`--no-verify-jwt` on the webhook is required: Stripe cannot present a Supabase
JWT. The function verifies Stripe's own signature instead.

In the Stripe dashboard, point a webhook endpoint at
`https://<ref>.functions.supabase.co/stripe-webhook` and subscribe to
`payment_intent.succeeded`, `payment_intent.payment_failed`, and
`charge.refunded`.

Put the publishable key in `.env` as `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`.

To test locally:

```bash
stripe listen --forward-to http://localhost:54321/functions/v1/stripe-webhook
stripe trigger payment_intent.succeeded
```

The visit price lives in `supabase/functions/create-payment-intent/index.ts`
(`VISIT_PRICE_CENTS`), server-side on purpose — the client never sends an amount.

## 4. Push notifications

Deploy `notify`, then add a database webhook: **Database → Webhooks → new**, on
`INSERT` into `public.visit_events`, calling the `notify` function. Notifications
are triggered by backend events, not by mobile state changes, so a customer is
notified with the app closed.

The app asks for notification permission after the first booking is confirmed —
the moment it becomes useful — rather than on first launch.

## 5. Run

```bash
npx expo start
```

Stripe's PaymentSheet needs native code, so payments do **not** work in Expo Go.
Build a development client:

```bash
npx expo run:android
# or: eas build --profile development --platform android
```

Everything except payment works in Expo Go.

## 6. Check it works

```bash
npm run typecheck   # clean
npm test            # 73 tests
npm run lint        # clean (2 harmless i18next default-import warnings)
npx expo export --platform android   # proves the whole route tree bundles
```

Then walk the two acceptance journeys from the spec (§65, §66): sign up, request
a viewing, pay, see the booking; then sign in as the verifier, check in, complete
the checklist, submit the report, and confirm it appears on the customer side.

## Troubleshooting

**"Missing EXPO_PUBLIC_SUPABASE_URL" in the console** — `.env` is not being read.
Restart the dev server; Expo reads env vars at bundler start.

**Payment sheet never opens** — you are in Expo Go. Use a development build.

**A query returns an empty array when rows exist** — RLS. Check the caller's role
and that the visit is genuinely theirs; the database is doing its job.

**Photo upload fails with a policy error** — `photos_allowed` is false on the
visit. That flag is only set by the verifier recording consent on site.
