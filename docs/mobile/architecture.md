# SomeoneThere mobile — architecture

Implements [the build specification](../product/mobile-app-spec.md). Where this
document and the spec disagree, the spec wins and this document is wrong.

## Shape

```
Expo app (React Native, TypeScript)
        │
        ├── Supabase Postgres        rows, guarded by Row Level Security
        ├── Supabase Storage         private buckets, signed URLs only
        ├── Supabase Edge Functions  payment intent, Stripe webhook, push
        └── Stripe                   PaymentSheet in-app, webhook server-side
```

The backend is the source of truth for users, visits, assignments, reports,
booking status, payments, consent, and media. The app holds two things locally:
the in-progress request wizard, and the verifier's in-progress report — both for
the same reason, that losing half-entered work is unacceptable.

## Layers

| Layer | Location | Responsibility |
| --- | --- | --- |
| Routes | `app/` | Expo Router screens, grouped by role |
| Components | `src/components/` | `ui/` design system + domain components |
| Features | `src/features/` | API calls and TanStack Query hooks per domain |
| Libs | `src/lib/` | Supabase, Stripe, notifications, analytics, monitoring |
| Stores | `src/store/` | Persisted local drafts (Zustand + AsyncStorage) |
| Domain | `src/utils/`, `src/types/`, `src/constants/` | Status logic, permissions, validation, enums |

Server state lives in TanStack Query and is never mirrored into a global store.
Zustand holds only what has no server row yet.

## Routing and roles

`app/index.tsx` waits for the session *and* the profile, then redirects by role:
`verifier` and `admin` to `(verifier)`, everyone else to `(customer)`. Each group
layout re-checks the role, so deep links cannot land a customer in the verifier
app. Routing on a guessed role while the profile row is still loading would
briefly show the wrong app, so it waits instead.

## Visit status

One enum, sixteen values, defined once in `src/types/domain.ts` and mirrored as a
Postgres enum. Nothing anywhere uses a free-text status.

`src/utils/visit-status.ts` maps those statuses onto six customer-facing
milestones. Several raw statuses collapse into one milestone — the customer cares
that the verifier is on the way, not whether the row says `verifier_en_route` or
`verifier_arrived`. Card badges and the detail timeline read from the same map,
so they cannot disagree.

## Consent

The rule that shapes several files: **a request is not consent.**

- `photos_requested`, `recording_requested` — what the customer asked for when
  booking.
- `photos_allowed`, `recording_allowed` — what the property contact agreed to,
  in person, at the door.

Only the second pair unlocks capture. It is set through one path, the
`record_capture_consent` RPC, which the verifier calls from the permission screen
immediately before check-in, and which cannot grant more than was requested. A
database CHECK constraint refuses `recording_allowed` on a visit where recording
was never requested; storage policies refuse a photo upload for a visit without
`photos_allowed`. Nothing records by default, and no screen offers a way to.

## Payments

```
customer completes wizard
        ↓  create visit draft (status = draft)
create-payment-intent  →  Stripe PaymentIntent, visit → payment_pending
        ↓  PaymentSheet in app
stripe-webhook  →  payment succeeded, visit → request_received
```

The client's report of success is optimistic and moves the UI along; the visit is
only actually a request once the webhook says so. Payment is deliberately not the
same thing as confirmed access — the confirmation screen says "request received",
and an operator confirms access separately.

## Offline behaviour

A verifier standing in a Madrid stairwell has no signal. Everything they type
goes into `useChecklistDraft` (persisted) first, and syncs opportunistically:
after each rating, on note blur, and again before submission. `syncReportDraft`
swallows failures and reports them to monitoring rather than throwing, because
the local draft is intact and a retry is coming. Only the final submit surfaces
an error. Photos queue as local URIs and upload last, so a failed image upload
cannot cost the verifier their written notes.

## Live calls

No in-app WebRTC (spec §18). The visit stores `live_call_url` and
`live_call_provider`; the app hands off to Google Meet, WhatsApp, or Zoom. The
join button stays disabled until `live_call_ready` is set *and* the verifier is
at the property — a link the customer can open too early is worse than no link.

## Privacy in the code

- Customers read verifier details only through the `verifier_public_cards` view:
  first name, last initial, photo, identity flag, languages, visit count. Never
  a surname, phone, or email.
- Photos are re-encoded before upload, which drops the EXIF block along with its
  GPS coordinates.
- Sentry runs with `sendDefaultPii: false` and scrubs addresses, listing URLs,
  contact details and report text out of events and breadcrumbs.
- Analytics events carry ids and enums only — never an address or report text.

## What is deliberately absent

Marketplace, search, AI scam detection, contract review, escrow, in-app video,
verifier bidding, dynamic pricing, agency dashboards (spec §55). The data model
leaves room for the ones in spec §56, but none are built.
