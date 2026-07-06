# Founder Decisions Required

> **This is Alessandro's queue.** Every item here needs a human decision before the project can proceed past it.
> Updated automatically by the adversarial loop (Finder → Solver). Last updated: Round 2 (2026-07-07).
> When you decide, move the item to `docs/decision-log.md` and delete it from here.

## How to use this file

- Each item has: the question, why it matters, the options, and what blocks until you decide.
- Reply with **A / B / C** (or your own option D) and I'll record it in the decision log and unblock the work.
- Items are sorted: **blocking first**, then strategic.

---

## 🔴 BLOCKING — pilot cannot launch until decided

### D1. Positioning wedge (R026) — pick the marketing angle
**Why it matters:** Round 1 added an honest disclaimer ("evidence not independently verified as untampered"). That may undercut the "evidence quality" pitch we use to beat free substitutes (asking a friend). We need to know what we're actually selling.
**Options:**
- **A) Evidence quality** — "Better evidence than a friend's photo." (Risk: disclaimer undercuts this.)
- **B) Independence + neutrality** — "A neutral third party with no stake in the rental." (Disclaimer doesn't undercut.)
- **C) Speed + structured report** — "A keepable, structured report in <4h." (Disclaimer doesn't undercut.)
- **D) Some combination — tell me which.**
**Blocks:** Pricing confidence, landing page final copy, pilot ad spend. The landing page I'm building uses B+C by default until you say otherwise.

### D2. Lawyer review timing — when do we engage? (R023, R025, R027)
**Why it matters:** Three docs are drafted and waiting for a Spanish lawyer: the front-door compliance checklist, the data retention schedule, and the Spanish landlord notice. The payment link cannot go public until the front-door checklist is signed off.
**Options:**
- **A) Engage a lawyer now** — before any public page or payment.
- **B) Build the page (no payment) first**, then engage the lawyer before enabling payment.
- **C) I have a lawyer already — send me what to forward.** (I'll package the 3 docs into one handoff.)
**Blocks:** Payment link going live; storing any report; any field visit interacting with a person.

### D3. Backup admin + coverage hours (R024)
**Why it matters:** The verifier-safety SOP's check-in/escalation chain assumes an admin is always reachable. Right now that's only you. If you're asleep/sick/unavailable during a field visit, the safety net is broken at the worst moment.
**Options:**
- **A) I have someone in mind** — tell me who and I'll draft `docs/operations/on-call.md`.
- **B) No in-person packages until I find someone** — digital-only Basic review launches first.
- **C) I'll be on-call 24/7 for the pilot** — (not recommended; document it as a stated risk if so.)
**Blocks:** All in-person packages (Exterior, Viewing, Premium).

---

## 🟡 STRATEGIC — decide before scaling, not before pilot

### D4. Stripe / payment processor contingency (R028)
**Why it matters:** HouseCheck is in a fraud-adjacent vertical (rentals). Stripe may hold reserves or freeze the account before chargeback history exists.
**Options:**
- **A) I'll contact Stripe support pre-launch** with the use case (I'll draft what to send).
- **B) Use SEPA bank transfer first** — slower, manual, but no processor-risk freeze.
- **C) Both — Stripe + SEPA fallback documented.**
**Blocks:** Financial resilience; not a hard launch blocker but a "don't get surprised" item.

### D5. Pilot kill-criteria — accept the thresholds? (R029)
**Why it matters:** Success metrics exist, but no "stop" thresholds. Without them, optimism can push past failing data. I drafted conservative kill-criteria in `docs/mvp-scope.md`.
**Proposed stop triggers:** refund rate >40%, <3/20 willing to pay, verifier cost >70% of price, SLA missed 3x, processor freeze >7 days, safety near-miss.
**Options:**
- **A) Accept as drafted.**
- **B) Too strict — loosen to [your numbers].**
- **C) Too loose — tighten to [your numbers].**
**Blocks:** Commitment to stop on failing data; recommended before pilot spend.

### D6. Fairness to vulnerable users principle (R030)
**Why it matters:** Target users are frightened and time-pressured — the same state scammers exploit. The funnel shouldn't mirror scam urgency.
**Options:**
- **A) Accept the principle** (drafted in `docs/product-principles.md` §11) — no urgency cues, honest timing, consider free triage.
- **B) Modify — tell me what to change.**
- **C) Reject — we sell on urgency like everyone else.** (Not recommended; legal/reputational risk.)
**Blocks:** Landing-page tone; not a hard launch blocker but an identity decision.

---

## 📋 Standing items (no decision needed, just awareness)

- **Round 1 (R001–R020) mitigations are *written* but mostly still "Open" in the register.** Written ≠ done. Before launch, we should walk the register and confirm each is actually implemented.
- **Seasonality (R012):** MVP is treated as a seasonal Aug–Oct pilot. If you want to pursue off-season revenue, that's a separate decision after the pilot.

---

## Resolved decisions (moved to `docs/decision-log.md`)

_None from this queue yet — the first one you answer goes here and into the decision log._