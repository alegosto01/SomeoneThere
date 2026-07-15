# App Plan — one role-gated HouseCheck app (first draft)

> **Status:** first draft, easily changed. Stack-agnostic.
>
> **Ahead-of-roadmap caveat:** `docs/product/prd.md` lists "full mobile app" under
> **MVP non-goals**. This document is a *forward draft* — written on Alessandro's
> instruction to do durable advance work — and must be revisited **after** the
> manual pilot proves demand. Do not read it as committed scope. The MVP still ships
> as a landing page + manual ops (`web-plan.md`) with reports delivered by email.

## Concept

**One app, two roles.** The same app exposes different features depending on the
signed-in user's role:

- **Client** — the person moving to Madrid who wants a flat checked.
- **Verifier** — the trusted local person who attends the viewing.

A third role, **admin** (screening, assignment, QA), is noted here but is most
likely a lightweight **web console**, not this app, in the MVP. Kept out of scope
for the app draft to avoid overbuild.

## Sources this is built from

- `docs/operations/request-lifecycle.md` — intake fields + status machine (authoritative)
- `docs/remote-viewing-checklist.md` — the verifier's on-site flow, step by step
- `docs/product/prd.md` — client side / verifier side / safety boundaries
- `docs/product-principles.md` §2 (permission-first), §7 (honest language), §9 (no brokerage)
- `docs/tech/architecture.md` — data entities (structure only, stack-agnostic)

## Shared shell (both roles)

- Sign in (role is set by HouseCheck at onboarding, not self-selected).
- A single **Request** object is the spine both roles see, from different angles.
- Notifications (status changes, assignment) — channel-agnostic (push/email).
- Video calls are **not built in-app**: the app deep-links to WhatsApp / Google
  Meet / Zoom (matches MVP + avoids building calling infra).

## Client role — flows

1. **Submit a listing** — same fields as the web intake (see `web-plan.md` table:
   name, email, phone, listing URL/screenshots, claimed address, video-call
   preference, optional viewing time / landlord contact / concerns, required
   attestation). One-active-request-per-address rule applies.
2. **Track request status** — read-only view of the request state machine:
   `submitted → screened → accepted → assigned → visit_scheduled → in_progress →
   summary_drafted → qa_review → delivered → closed` (+ `rejected`, `aborted`).
   Show plain-language labels, not raw state names.
3. **Join the live viewing** — at `visit_scheduled`/`in_progress`, a button
   deep-links to the chosen video app at call time.
4. **Read the report** — at `delivered`, the short post-visit verification report:
   summary, listing-match notes, risk indicators, confidence level, unresolved
   concerns, disclaimer. Report is **private to the client** (no public badge — R008).

Client never sees: verifier identity beyond first name, payout, internal QA notes,
or any landlord personal data kept for internal QA only (R016).

## Verifier role — flows (mirrors `remote-viewing-checklist.md`)

1. **Assigned visit** — address, viewing time, meeting point, client's video-call
   preference, listing claims to compare, check-in contact + backup admin.
2. **Pre-visit checklist** — confirm address/time/meeting point; confirm client
   will join; save listing URL + screenshots; note listing claims (rooms, size,
   floor, furniture, amenities, price, deposit, bills, move-in); confirm who granted
   access; device/network check.
3. **Permission gate (hard block)** — explicit toggles the verifier must set before
   proceeding, from checklist L23–31:
   - Permission to **enter** (required before the walkthrough unlocks).
   - Permission to **film / show interior on the call**.
   - Standing rules shown on-screen: don't secretly record; don't film people
     unnecessarily; don't film documents/IDs/bank details/mail/personal photos;
     stop filming if anyone asks.
   - If permission is refused, the flow routes to **abort**, not "continue anyway."
4. **Live listing-match checklist** — one row per item to mark
   Yes/No/Partially/Unclear: building entrance & common areas, bedroom count,
   kitchen, bathroom, living area, windows/light, furniture/appliances,
   cleanliness/condition, noise/street context, claimed amenities, claimed
   price/deposit/bills/move-in.
5. **Factual Q&A capture** — the neutral question set (role re the flat, who signs,
   what's included, deposit requested, availability, house rules, repairs expected).
   Guardrail text: do not negotiate or give legal advice.
6. **Risk indicators** — checklist of observed indicators (refuses live video after
   access arranged; address/entrance mismatch; material differences; pressure to pay
   immediately; unclear role; refuses basic questions; unusual payment method;
   "contract only after payment"; verifier asked to pay/sign/collect keys).
7. **Evidence capture** — attach only permission-gated photos/video. App reminds
   that phone media provenance is limited (R017) — never presented as tamper-proof.
8. **Draft summary → hand to QA** — verifier drafts the summary; it goes to
   `qa_review`. Verifier **cannot** deliver directly (QA gate is mandatory).

Verifier safety boundaries surfaced in-app (from `prd.md`): must not enter without
permission, secretly record, film people/documents, negotiate rent, sign anything,
pay anything, collect keys, give legal advice, guarantee safety, recommend whether
to rent, or confront suspected scammers. An **abort** action is always one tap away.

## Screen inventory

| Screen | Role | Purpose |
|---|---|---|
| Sign in | both | auth; role resolved server-side |
| My requests (list) | client | all the client's requests + current state |
| New request | client | intake form |
| Request detail / status tracker | client | state machine, join-call button, report link |
| Report view | client | delivered verification report (private) |
| My visits (list) | verifier | assigned visits |
| Visit brief | verifier | address, time, listing claims, contacts |
| Pre-visit checklist | verifier | readiness steps |
| Permission gate | verifier | enter/film toggles + rules; abort route |
| Live listing-match checklist | verifier | per-item Yes/No/Partially/Unclear |
| Q&A + risk indicators | verifier | factual capture |
| Evidence capture | verifier | permission-gated media |
| Summary draft | verifier | draft → send to QA |
| Abort visit | verifier | safety/permission/access exit |

Shared: Sign in, notifications, the Request spine. Everything else is role-gated.

## Data-model + state map (stack-agnostic; from `architecture.md` entities)

- `User{ role: client | verifier | admin }` gates which screens render.
- `VerificationRequest{ status }` drives the client tracker **and** which verifier
  screens are active (e.g. checklist unlocks at `in_progress`).
- `VerificationJob` (verifier assignment, scheduling, payout) backs the verifier's
  "My visits" — payout stays server-side, never shown to the client.
- `VerificationReport` backs both the verifier draft and the client report view.

### ⚠ Flagged conflict — do NOT design in, resolve separately

`architecture.md`'s `VerificationReport` still carries **`recommendation`** and
**`risk_score`** fields. These violate hard rules: no recommendation whether to rent
(`prd.md`, request-lifecycle QA gate) and no safety scoring (§7, R-loop). This draft
deliberately shows neither field in any client- or verifier-facing screen.

**Action:** open a GitHub issue to reconcile the data model (rename/remove
`recommendation`/`risk_score`, keep `confidence_level` + factual `risk_indicators`),
per CLAUDE.md "convert every serious risk into a doc update or issue." Not resolved here.

## Deliberately out of scope for this draft

- Framework / native-vs-PWA choice (backlog #10 stays open).
- In-app video calling, in-app chat, in-app payments/payouts, verifier
  matching/ratings, live tracking — all "future marketplace features" in
  `architecture.md`; building them now is exactly the throwaway work to avoid.
- Admin console screens (separate surface).
- Direct customer↔verifier messaging (an explicit `prd.md` non-goal).
