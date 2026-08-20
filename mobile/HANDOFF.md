# Handoff — SomeoneThere mobile app

For whoever picks this up next. Written 2026-08-19, after the initial build.

Read this, then [docs/product/mobile-app-spec.md](../docs/product/mobile-app-spec.md)
— the spec is the source of truth. Where this file and the spec disagree, the
spec wins and this file is out of date.

---

## 1. Read this first: there is no Node on this machine

`node`, `npm` and `npx` are **not installed**, and installing system-wide needs
sudo. The previous session worked around it by downloading a portable Node into
a session scratchpad, which **no longer exists**. You will hit "command not
found" on your first `npm` and it is not a broken checkout.

Options, cheapest first:

```bash
# A. portable Node, touches nothing outside the download (what was used before)
cd /tmp && curl -fsSLO https://nodejs.org/dist/v20.18.1/node-v20.18.1-linux-x64.tar.xz
tar -xf node-v20.18.1-linux-x64.tar.xz
export PATH=/tmp/node-v20.18.1-linux-x64/bin:$PATH

# B. conda (user-space, but modifies their conda install)
conda create -n someonethere nodejs=20 -y && conda activate someonethere

# C. apt (needs sudo — ask first)
```

`mobile/node_modules` is gitignored and was ~700 MB. Expect a fresh
`npm install` (about 2 minutes).

Everything else in this document assumes Node is on your PATH.

---

## 2. Where things stand

**Branch:** `main`, **5 commits ahead of `origin/main`, not pushed.**
Remote is `git@github.com:alegosto01/SomeoneThere.git`. The project was renamed
HouseCheck → SomeoneThere upstream; the local directory is still
`~/Desktop/HouseCheck`, which is cosmetic.

```
9450a66  chore(graphify): rebuild knowledge graph
4903c40  fix(mobile): make the app actually build, and fix what that exposed
0a1610a  chore(graphify): rebuild knowledge graph after the mobile app
87763f7  feat(mobile): build the SomeoneThere app from the build spec
9cba077  chore: reorganize repo and file the mobile build spec
```

Nothing has been pushed. Ask before pushing — it is the first outward-facing
step, and Alessandro may want to review locally first.

### Verified green

Run these to confirm nothing has rotted:

```bash
cd mobile
npm install
npx tsc --noEmit                      # clean
npx jest                              # 73 tests, 7 suites
npx eslint .                          # 0 errors (2 harmless i18next warnings)
npx expo install --check              # dependencies match SDK 53
npx expo export --platform android --output-dir dist && rm -rf dist   # 2604 modules
npm run test:sql                      # 45 assertions against real Postgres
```

`npm run test:all` runs typecheck, Jest and the SQL suite together.

The SQL suite (`supabase/tests/`) applies the migrations and seed to a throwaway
Postgres container and then exercises the security model as each role: customer
isolation, the verifier's payment blindness, every write guard, the consent
clamp, report immutability, the workflow RPCs and the storage policies. It needs
Docker but not the Supabase CLI. `00_supabase_stubs.sql` stands in for what the
platform provides (`auth.users`, `auth.uid()`, `storage.objects`, and the role
GRANTs) — it is not part of the deployed schema.

What it does **not** cover: GoTrue, the Storage HTTP API, Realtime, and anything
Stripe. Run `supabase db reset` against a real local stack before a pilot.

### Not verified — this is the honest edge

- **Stripe has never run.** No PaymentIntent has been created, no webhook
  received.
- **Push has never fired.** The `notify` function has no database webhook wired
  to it yet.
- **No screen has been rendered on a device or emulator.** It bundles; that is
  not the same as looking right or being usable one-handed in a stairwell.

---

## 3. Do this next, in this order

### 3.1 Get one end-to-end journey working on a device

Spec §65 and §66 define the two acceptance journeys. Payments need a
development build — the Stripe PaymentSheet is native, so **Expo Go will not
work** for that step (everything else does).

```bash
npx expo run:android      # or: eas build --profile development --platform android
```

### 3.2 Wire the operator gaps (see §5 — several flows have no UI at all)

---

## 4. Invariants — do not break these

These are not style preferences. Each is enforced in more than one place on
purpose, and each has tests.

**A request is never consent.** `photos_requested` / `recording_requested` are
what the customer asked for when booking. `photos_allowed` / `recording_allowed`
are what the property contact agreed to, out loud, at the door. Only the second
pair unlocks capture. It is set through exactly one path — the
`record_capture_consent` RPC, called from the verifier's permission screen — and
it cannot grant more than was requested. A CHECK constraint, a storage policy and
`capturePermissions()` each refuse independently. **Nothing records by default,
and no screen offers a way to make it.** If you find yourself adding a default-on
recording toggle, stop and re-read spec §12 and §59.

**Payment is not confirmed access.** The client's report of a successful payment
only advances the UI. `stripe-webhook` is what moves the visit, and it lands on
`request_received` — not on anything implying the visit is arranged. Do not add
a client-side write that marks a visit paid.

**Reports describe, they never conclude.** Observations, listing differences, who
said what, and an explicit list of what could not be checked. Never "safe",
"certified", "scam", "guaranteed", "legally verified". There is a test asserting
no affirmative safety claim exists in either locale — if you add copy and that
test fails, the copy is wrong, not the test.

**A verifier's notes must survive no signal.** Everything types into the
persisted local draft first; sync is opportunistic and failure-tolerant; photos
upload *after* text so a failed image cannot cost written observations. Do not
make a checklist field write straight to the network.

---

## 5. Known gaps and deliberate omissions

### Flows with no UI (spec §4.3 says handle these in the Supabase dashboard for v1)

An operator must currently do these by hand, and nothing in the app does them:

| Action | How, today |
| --- | --- |
| Confirm access with the property contact | Set `visits.access_confirmed`, then `status` |
| Assign a verifier | Set `visits.verifier_id` and `status = 'verifier_assigned'` |
| Set the live call URL | Set `visits.live_call_url` and `live_call_provider` |
| Promote a user to verifier | Set `profiles.role`, insert a `verifier_profiles` row |
| Issue a refund | In Stripe; the webhook updates the visit |

This is per spec, but it means a pilot needs someone watching the dashboard.
An internal admin tool is the obvious next build after the pilot.

### Unresolved product decisions (hardcoded, need a real answer)

- **Visit price: €49**, in `supabase/functions/create-payment-intent/index.ts`
  (`VISIT_PRICE_CENTS`). Server-side on purpose — the client never sends an
  amount — but the number itself is a guess.
- **Verifier payout: €20**, in `app/(verifier)/earnings.tsx` (`PAYOUT_PER_VISIT`).
  Verifiers have no RLS access to `payments`, so the earnings screen *counts
  completed visits at a flat rate* rather than reading real amounts. If payouts
  ever vary, this screen becomes a lie and needs a real data source.
- **Cancellation and refund rules.** The UI states a 24-hour policy in copy only.
  Spec §39 says refund logic must be configurable from the backend — it is not
  implemented anywhere yet.

### Other known gaps

- **Google sign-in button is disabled.** Wired in `features/auth/api.ts`, but the
  provider is not enabled in Supabase and the deep-link round-trip is untested.
- **Supabase client is untyped.** A hand-written `Database` type was tried and
  removed — it resolved every query builder to `never`. Generate real types once
  a project exists (`npx supabase gen types typescript --project-id <ref>`) and
  add the `<Database>` generic back in `src/lib/supabase/client.ts`. Until then
  `src/types/models.ts` is the contract.
- **App icons are placeholders** — a plain map-pin, not brand artwork. See
  `assets/README.md`.
- **`notify` needs a database webhook** on `INSERT into visit_events`. Until
  that exists, no push notification will ever fire.
- **Spanish copy was written by an English speaker.** It is accented and reads
  correctly, but a native Madrid speaker should review `src/i18n/locales/es.json`
  before a pilot — especially the report and legal strings.

---

## 6. Traps already hit — do not rediscover these

- **`cd x && cat > file` silently does nothing if the `cd` fails.** Two files
  were written this way and never landed; one (`babel.config.js`) broke every
  test suite and was not noticed for hours because nothing could run. Prefer
  absolute paths, and verify the file afterwards.
- **`tsc` was typechecking `supabase/functions/`.** Those are Deno — URL imports,
  `Deno` global — and account for 35 phantom errors if you remove the `exclude`
  in `tsconfig.json`. Check them with `deno check` instead.
- **`react-test-renderer` must be pinned to React's exact version** (19.0.0).
  Without the pin, npm cannot resolve the tree at all — `@testing-library/react-native`
  pulls a newer one whose peer range excludes Expo's React.
- **A banned-word test on the disclaimer will fail correctly.** The disclaimer is
  *required* to say "this is not a certified property inspection". Test for the
  denial being present, not for the substring being absent.

---

## 7. House rules for this repo

From `CLAUDE.md`, and they are enforced by hooks:

- **Run `graphify query "<question>"` before grepping.** There is a knowledge
  graph at `graphify-out/`. After changing code, run `graphify update .` (AST
  only, no API cost) and commit the result separately — the diff is large because
  the AST cache moves around.
- **For major decisions, run the adversarial loop**: `problem-finder` →
  `problem-solver` → `decision-judge`, then ask Alessandro before implementing
  anything risky or strategic. Do not skip to implementation on a product
  question.
- **Product language matters more than usual here.** Use: evidence collected,
  risk indicators, verification report, confidence level, unresolved concerns,
  permission-first visit. Never: guaranteed safe, scam-proof, legally verified,
  certified property, approved landlord.
- Be skeptical, do not overbuild, prefer manual MVP workflows, never claim legal
  certainty, keep Madrid as the first market.

---

## 8. Map of the code

```
mobile/
  app/                    Expo Router; (auth) (customer) (verifier)
  src/
    components/ui/        design system — Button, Card, Input, Timeline, States…
    components/           domain — VisitCard, VerifierCard, PermissionSummary…
    constants/            theme, priorities, observation categories, config
    features/             auth, visits, reports, profile, payments, verifier
    lib/                  supabase, stripe, notifications, analytics, monitoring
    store/                persisted drafts — request wizard, verifier checklist
    types/                domain enums + row models
    utils/                status mapping, permissions, validation, formatting
  supabase/
    migrations/           0001 schema · 0002 RLS · 0003 RPCs · 0004 storage
    functions/            create-payment-intent, stripe-webhook, notify, delete-account
    seed.sql              demo customer, verifier, three visits
```

The three files worth reading before changing anything:

1. `src/utils/permissions.ts` — the consent rule, small and load-bearing.
2. `src/utils/visit-status.ts` — how sixteen statuses become six milestones.
3. `supabase/migrations/0002_rls.sql` — who can see what, and the guards.

Docs: [architecture](../docs/mobile/architecture.md) ·
[database](../docs/mobile/database.md) · [setup](../docs/mobile/setup.md) ·
[Android release](../docs/mobile/release-android.md)
