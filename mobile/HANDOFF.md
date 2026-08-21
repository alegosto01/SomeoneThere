# Handoff — SomeoneThere mobile app

For whoever picks this up next. Written 2026-08-21.

Read this, then [docs/product/mobile-app-spec.md](../docs/product/mobile-app-spec.md)
— the spec is the source of truth. Where this file and the spec disagree, the
spec wins and this file is out of date.

---

## 1. STOP: the working tree is mid-upgrade and does not build

An Expo SDK 53 → 57 upgrade was started and **interrupted partway through**.
`package.json` has mostly been rewritten to SDK 57, but `npm install` failed on
a peer conflict, so `node_modules` still holds the old tree. They disagree:

| package | package.json says | actually installed | SDK 57 wants |
| --- | --- | --- | --- |
| expo | ^57.0.15 | **57.0.15** | — |
| react | 19.2.3 | **19.0.0** | 19.2.3 |
| react-native | 0.86.2 | **0.79.6** | 0.86.2 |
| jest-expo | **~53.0.0** | 53.0.14 | ~57.0.4 |
| react-test-renderer | 19.0.0 | 19.0.0 | should match react |

`npx tsc --noEmit` currently reports **2 errors** (`expo-notifications` changed
its permissions type). Nothing else has been run in this state — assume Jest,
the bundlers and the app are all broken until proven otherwise.

**None of this is committed.** `git status` shows only `package.json` and
`package-lock.json` modified. Everything committed at `c312771` was green.

### Your first decision

**Option A — finish the upgrade** (recommended; see §2 for why it is needed).

**Option B — abandon it and get back to green:**

```bash
cd mobile
git checkout package.json package-lock.json
rm -rf node_modules && npm install
npx tsc --noEmit && npx jest        # should be clean, 73 tests
```

Do not leave it half-done. A tree where the manifest and the lockfile describe
different apps is the worst of both.

---

## 2. Why the upgrade is needed at all

The app was written against **SDK 53**. That was my error — I wrote the
dependency list from memory and `expo install --fix` reconciled *within* 53
rather than telling me 53 was four majors stale. Current is **57**.

It matters for one concrete reason: **Expo Go only ever supports the newest
SDK.** Scanning a QR for an SDK 53 project with a current Expo Go fails with an
incompatibility error, which is exactly where this stopped. There is no
"see it on a phone" path on SDK 53 that does not involve sideloading an old
Expo Go APK or building a dev client with an EAS account.

### Finishing the upgrade

The install failed on a peer conflict. The known offenders:

- `jest-expo` is still `~53.0.0` and pins the old react-native. Move it to
  `~57.0.4`.
- `react-test-renderer` is pinned to `19.0.0` and must track react (`19.2.3`).
  It was pinned deliberately — without a pin npm cannot resolve the tree at all.
- The `overrides: { "pretty-format": "29.7.0" }` block and the explicit
  `pretty-format` devDependency exist because RN 0.79's HMR client used a
  default export that pretty-format 30 removed (§6). **Re-test whether RN 0.86
  still needs this** — if not, delete both; a stale override is a trap.

Then:

```bash
rm -rf node_modules package-lock.json
npm install
npx expo install --fix
```

Expect real breakage beyond dependency math — this is four majors of
react-native. The two known typecheck errors are in
`src/lib/notifications/index.ts`, where `getPermissionsAsync()` no longer
returns `.status` in the same shape.

---

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
- **Expo dev server: running** but serving the broken tree. Kill and restart
  once the upgrade is resolved.

`mobile/.env` is gitignored and points at the **LAN IP**, not `127.0.0.1`, so a
phone on the same Wi-Fi can reach Supabase. If the laptop's IP changes, update
it — a phone resolving `127.0.0.1` reaches itself and you get a login screen
that can never authenticate.

---

## 4. Where things stand otherwise

**Branch:** `main`, pushed, in sync with `origin/main` at `c312771`.
Remote is `git@github.com:alegosto01/SomeoneThere.git`.

Everything below was verified green **before** the upgrade started:

```bash
npx tsc --noEmit                     # clean
npx jest                             # 73 tests, 8 suites
npm run test:sql                     # 68 assertions, needs Docker
npx expo export --platform android   # 2605 modules
```

The app has been driven end to end in a real browser against the real Supabase
stack: both demo accounts sign in, role routing sends the verifier to Jobs, and
each side renders its seeded visit with zero console errors.

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
