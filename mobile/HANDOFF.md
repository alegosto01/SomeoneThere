# Handoff — SomeoneThere mobile app

For whoever picks this up next. Written 2026-08-21, updated same day after
finishing the SDK upgrade.

Read this, then [docs/product/mobile-app-spec.md](../docs/product/mobile-app-spec.md)
— the spec is the source of truth. Where this file and the spec disagree, the
spec wins and this file is out of date.

---

## 1. SDK 57 upgrade: DONE and green

The Expo SDK 53 → 57 upgrade is finished. Manifest, lockfile and
`node_modules` now agree. Everything below is verified in the upgraded tree:

```bash
npx tsc --noEmit                     # clean
npx jest                             # 73 tests, 7 suites
npm run lint                         # 0 errors, 2 benign i18next warnings
npx expo export --platform android   # bundles fine
npx expo export --platform web       # bundle parses, no import.meta trap
```

Browser smoke (headless Chrome against the local Supabase stack): login,
customer home with seeded visit, verifier role routing to Jobs — all render
with zero console errors.

**None of the upgrade is committed yet.** `git status` shows `package.json`,
`package-lock.json`, `tsconfig.json`, `eslint.config.js`, two tab layouts,
`Sheet.tsx`, `viewing.tsx`, `payment.tsx`, `_layout.tsx`, `AuthProvider.tsx`
and `graphify-out/` modified.

What it took beyond dependency math:

- `@types/react` → `^19.1.1` (RN 0.86 peer), `typescript` → `~6.0.3`,
  `eslint-config-expo` → `~57.0.1` (via `expo install --fix`).
- `i18next` → `^26.4.0` and `react-i18next` → `^17.0.12` — the old majors
  peer-require `typescript@^5` and block install under TS 6.
- The `pretty-format` 29.7.0 pin and `overrides` block are **deleted** —
  RN 0.86 declares its own `pretty-format@^29.7.0` dependency, so the tree
  resolves correctly on its own (§6 trap closed).
- `tsconfig.json` gained `"types": ["jest"]` — TS 6 no longer auto-includes
  `@types/jest` globals.
- `StyleSheet.absoluteFillObject` is gone in RN 0.86 — `Sheet.tsx` uses
  explicit insets now. Tab icon `color` is typed `ColorValue`, not `string`.
- `eslint-config-expo` 57 ships react-compiler-era rules; three idiomatic
  spots carry `eslint-disable` comments with reasons, and
  `viewing.tsx`'s in-render `Date.now()` became a `useState` initializer.

### What is still NOT verified

- **Expo Go on a real phone.** SDK 57 removes the version mismatch that
  blocked this, but nobody has scanned the QR yet. Do that next.
- Stripe and push remain untested (§4).

## 3. Environment (already set up, persists)

Node and the Supabase CLI live in a conda env, **not** on the system:

```bash
conda activate someonethere
node -v        # v25.8.2
supabase --version   # 2.115.0
```

If a command says "node: command not found", you have not activated the env.

### Currently running

- **Supabase local stack: up** (11 containers, API on `http://127.0.0.1:54321`).
  Studio at `http://127.0.0.1:54323`.
- **Expo dev server: running** on the SDK 57 tree (started with `--clear`).

`mobile/.env` is gitignored and points at the **LAN IP**, not `127.0.0.1`, so a
phone on the same Wi-Fi can reach Supabase. If the laptop's IP changes, update
it — a phone resolving `127.0.0.1` reaches itself and you get a login screen
that can never authenticate.

---

## 4. Where things stand otherwise

**Branch:** `main`, pushed, in sync with `origin/main` at `c312771` **plus
uncommitted SDK 57 upgrade changes** (see §1).
Remote is `git@github.com:alegosto01/SomeoneThere.git`.

Verified green in the upgraded tree (§1 has the commands): typecheck, Jest
(73 tests, 7 suites), lint, `test:sql` (68 assertions), android + web export,
and a browser drive of both demo accounts.

Demo logins (password `demo-password` for both):

```
customer@example.com   3 visits: assigned / awaiting verifier / completed+report
verifier@example.com   the verifier side
```

### Not verified

- **Stripe has never run.** No PaymentIntent created, no webhook received.
  Payments are on hold by the owner's decision.
- **Push has never actually delivered.** The trigger and function are tested
  against a stubbed `net.http_post`; nothing has reached a real device.
- **Never rendered on a phone.** Browser only, which is React Native through
  the DOM — spacing, fonts and touch targets are not what a device shows.

---

## 5. Invariants — do not break these

Each is enforced in more than one place on purpose, and each has tests.

**A request is never consent.** `photos_requested` / `recording_requested` are
what the customer asked for when booking. `photos_allowed` / `recording_allowed`
are what the property contact agreed to, out loud, at the door. Only the second
pair unlocks capture, only `record_capture_consent` sets it, and it cannot grant
more than was requested. A CHECK constraint, a storage policy and
`capturePermissions()` each refuse independently. **Nothing records by default
and no screen offers a way to make it.** If you are adding a default-on
recording toggle, stop and re-read spec §12 and §59.

**Payment is not confirmed access.** The client's report of success only
advances the UI. `stripe-webhook` is what moves the visit, and it lands on
`request_received` — not on anything implying the visit is arranged.

**Reports describe, they never conclude.** Observations, listing differences,
who said what, and an explicit list of what could not be checked. Never "safe",
"certified", "scam", "guaranteed". A test asserts no affirmative safety claim
exists in either locale — if you add copy and it fails, the copy is wrong.

**A verifier's notes must survive no signal.** Everything types into the
persisted local draft first; sync is opportunistic; photos upload *after* text
so a failed image cannot cost written observations.

---

## 6. Traps already hit — do not rediscover these

- **A blank page with a clean server log is a bundle parse error.** The web
  bundle contained `import.meta` (from zustand's devtools middleware, which we
  never use but which ships beside `persist`). Expo serves web as a classic
  `<script>`, where that is a syntax error, so the browser discards the file
  before executing a line. There is no runtime error to find. `node --check` on
  the served bundle is how to catch this class.
- **Verify by driving a browser, not by reading logs.** 73 Jest tests, a clean
  typecheck and a successful bundle all passed while the app could not render
  or serve a single authenticated request. Puppeteer is installed in the session
  scratchpad; re-add it if you need it.
- **Metro's stale bundle can be byte-identical after a fix.** `--clear` alone
  was not enough; `node_modules/.cache`, `.expo` and `/tmp/metro-*` all had to
  go. A working fix looked like a failed one for several rounds.
- **`Tabs.Screen name="visit"` silently matches nothing** when the route is
  `visit/[id]` (a folder with no `_layout.tsx` is not a navigator). The dynamic
  routes leaked into the tab bar as extra tabs. Expo Router does not warn.
- **Migrations must GRANT explicitly.** PostgREST connects as `authenticated`
  and a role with no table privileges is refused *before* RLS is consulted.
  Supabase's defaults did not cover these tables; the whole API returned 42501.
- **GoTrue cannot scan NULL into a Go string.** Seeded `auth.users` rows need
  `confirmation_token` and friends set to `''`, plus an `auth.identities` row,
  or every login fails with "Database error querying schema" and no hint.
- **`cd x && cat > file` silently does nothing if the `cd` fails.** Two files
  were written this way and never landed; one broke every test suite invisibly.
- **`pkill -f "expo start"` matches your own shell command line** and kills the
  command issuing it. Kill by PID from `ss -ltnp` instead.

---

## 7. Known gaps

### Flows with no UI (spec §4.3: operator does these from the dashboard)

Migration `0005` added RPCs so these are one safe call each rather than raw
UPDATEs: `admin_set_access`, `admin_assign_verifier`, `admin_set_live_call`,
`admin_set_live_call_ready`, `admin_cancel_visit`, `admin_make_verifier`.
A pilot still needs a person watching Studio. An internal admin tool is the
obvious next build.

### Unresolved product decisions (hardcoded, owner's call — currently on hold)

- **Visit price €49** — `create-payment-intent/index.ts` (`VISIT_PRICE_CENTS`).
- **Verifier payout €20** — `app/(verifier)/earnings.tsx`. Verifiers have no RLS
  access to `payments`, so this screen multiplies completed visits by a flat
  rate. If payouts ever vary it becomes a lie and needs a real data source.
- **Refund rules** — a 24-hour policy stated in copy only, enforced nowhere.

### Other

- **Google sign-in** is wired but disabled; the provider slot is in
  `supabase/config.toml` awaiting an OAuth client.
- **Supabase client is untyped.** A hand-written `Database` type resolved every
  query to `never` and was removed. Generate real types once a hosted project
  exists; `src/types/models.ts` is the contract meanwhile.
- **App icons are placeholders** — see `assets/README.md`.
- **Spanish copy was written by an English speaker.** A native Madrid speaker
  should review `src/i18n/locales/es.json` before a pilot, especially the report
  and legal strings.

---

## 8. House rules

From `CLAUDE.md`, enforced by hooks:

- **Run `graphify query "<question>"` before grepping.** After changing code run
  `graphify update .` and commit the result separately.
- **For major decisions run the adversarial loop**: `problem-finder` →
  `problem-solver` → `decision-judge`, then ask Alessandro before implementing
  anything risky or strategic.
- **Product language**: evidence collected, risk indicators, verification
  report, confidence level, unresolved concerns, permission-first visit. Never:
  guaranteed safe, scam-proof, legally verified, certified property.
- Be skeptical, do not overbuild, prefer manual MVP workflows, never claim legal
  certainty, keep Madrid as the first market.

---

## 9. Map

```
mobile/
  app/                    Expo Router; (auth) (customer) (verifier)
  src/
    components/ui/        design system
    features/             auth, visits, reports, profile, payments, verifier
    lib/                  supabase, stripe, notifications, analytics, monitoring
    store/                persisted drafts — request wizard, verifier checklist
    utils/                status mapping, permissions, validation, formatting
  supabase/
    migrations/           0001 schema+grants · 0002 RLS · 0003 RPCs ·
                          0004 storage · 0005 operator + notify trigger
    functions/            create-payment-intent, stripe-webhook, notify,
                          delete-account
    tests/                run.sh — schema + RLS against a throwaway Postgres
    seed.sql              demo customer, verifier, three visits
```

Read before changing anything:

1. `src/utils/permissions.ts` — the consent rule, small and load-bearing.
2. `src/utils/visit-status.ts` — sixteen statuses to six milestones.
3. `supabase/migrations/0002_rls.sql` — who can see what, and the guards.

Docs: [architecture](../docs/mobile/architecture.md) ·
[database](../docs/mobile/database.md) · [setup](../docs/mobile/setup.md) ·
[Android release](../docs/mobile/release-android.md)
