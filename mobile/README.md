# SomeoneThere — mobile app

The SomeoneThere mobile app. A customer who cannot attend a Madrid rental
viewing sends a trusted local verifier in their place, joins the viewing by
video call, and receives a structured record of what was observed.

> See the place before you send the deposit.

This is **not** a rental marketplace. Customers bring their own listings from
Idealista, Facebook, an agency, or a WhatsApp message.

## What it is not

SomeoneThere is not a real-estate agency, a broker, a legal advisor, a
contract-review provider, an escrow service, or a certified property inspector,
and it does not guarantee that a property or a landlord is legitimate. A report
describes observations from one visit at one moment. Every report says so, and
every report lists explicitly what could not be checked.

## Stack

| Concern | Choice |
| --- | --- |
| App | React Native + Expo (SDK 53), TypeScript, Expo Router |
| Server state | TanStack Query |
| Local state | Zustand (persisted to AsyncStorage) |
| Forms | React Hook Form + Zod |
| Backend | Supabase — Postgres, Auth, Storage, Edge Functions |
| Payments | Stripe (PaymentSheet + webhook) |
| Push | Expo Notifications |
| Monitoring | Sentry |
| i18n | i18next (English, Spanish) |

Android ships first; the same codebase builds for iOS.

## Setup

```bash
cd mobile
npm install
cp .env.example .env      # fill in the Supabase and Stripe values
npx expo start
```

You need Node 20+ and, for a device build, the Android SDK (or an EAS account).

Full instructions, including the Supabase project and Stripe webhook, are in
[docs/setup.md](../docs/mobile/setup.md).

## Environment variables

Everything the app reads is prefixed `EXPO_PUBLIC_` and is bundled into the
app — so only public values belong there.

| Variable | Purpose |
| --- | --- |
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (RLS applies) |
| `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `EXPO_PUBLIC_SENTRY_DSN` | Sentry DSN (optional) |
| `EXPO_PUBLIC_SUPPORT_EMAIL` | Address behind "Contact SomeoneThere" |

`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` and `SUPABASE_SERVICE_ROLE_KEY` are
Edge Function secrets. They must never appear in the mobile bundle.

## Commands

```bash
npm start          # Expo dev server
npm run android    # build and run on a connected device/emulator
npm test           # unit tests
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
```

## Layout

```
mobile/
  app/                    Expo Router routes
    (auth)/               login, register
    (customer)/           home, visits, reports, profile + request wizard
    (verifier)/           jobs, visits, earnings, profile + checklist/report
  src/
    components/           design system (ui/) and domain components
    constants/            theme, priorities, observation categories, config
    features/             auth, visits, reports, profile, payments, verifier
    i18n/                 i18next setup + en/es locale files
    lib/                  supabase, stripe, notifications, analytics, monitoring
    store/                persisted local drafts (request wizard, checklist)
    types/                shared domain enums and row models
    utils/                status mapping, permissions, validation, formatting
  supabase/
    migrations/           schema, RLS, workflow RPCs, storage policies
    functions/            create-payment-intent, stripe-webhook, notify
    seed.sql              demo customer, verifier and three visits
```

## Docs

- [Architecture](../docs/mobile/architecture.md)
- [Database and security model](../docs/mobile/database.md)
- [Setup](../docs/mobile/setup.md)
- [Android release](../docs/mobile/release-android.md)
- [Build specification](../docs/product/mobile-app-spec.md) — the source of truth
  this implementation follows

## Two rules worth knowing before you change anything

1. **A request is not consent.** `photos_requested` / `recording_requested` are
   what the customer asked for when booking. `photos_allowed` /
   `recording_allowed` are what the property contact agreed to, out loud, on
   site. Only the second pair may unlock capture, and only the verifier's
   on-site confirmation sets them. Nothing records by default.
2. **Reports describe, they do not conclude.** Observations, listing
   differences, who said what, and what could not be checked. Never "safe",
   "certified", "scam", or "guaranteed".
