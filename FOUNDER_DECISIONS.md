# Founder Decisions Required

> **This is Alessandro's queue.** Every item here needs a human decision before the project can proceed past it.
> Updated automatically by the adversarial loop (Finder → Solver). Last updated: Round 2 (2026-07-07), resolved 2026-07-08.
> When you decide, move the item to `docs/decision-log.md` and delete it from here.

## How to use this file

- Each item has: the question, why it matters, the options, and what blocks until you decide.
- Reply with **A / B / C** (or your own option D) and I'll record it in the decision log and unblock the work.
- Items are sorted: **blocking first**, then strategic.

---

## 🔴 BLOCKING — pilot cannot launch until decided

_All blocking items from Round 2 (D1, D2, D3) were resolved on 2026-07-08 — see `docs/decision-log.md`._

---with the update

## 🟡 STRATEGIC — decide before scaling, not before pilot

### D4. Stripe / payment processor contingency (R028)
**Why it matters:** HouseCheck is in a fraud-adjacent vertical (rentals). Stripe may hold reserves or freeze the account before chargeback history exists.
**Options:**
- **A) I'll contact Stripe support pre-launch** with the use case (I'll draft what to send).
- **B) Use SEPA bank transfer first** — slower, manual, but no processor-risk freeze.
- **C) Both — Stripe + SEPA fallback documented.**
**Blocks:** Financial resilience; not a hard launch blocker but a "don't get surprised" item.

---

## 📋 Standing items (no decision needed, just awareness)

- **Round 1 (R001–R020) mitigations are *written* but mostly still "Open" in the register.** Written ≠ done. Before launch, we should walk the register and confirm each is actually implemented.
- **Seasonality (R012):** MVP is treated as a seasonal Aug–Oct pilot. If you want to pursue off-season revenue, that's a separate decision after the pilot.

---

## Resolved decisions (moved to `docs/decision-log.md`)

- **2026-07-08 — D1 (R026):** Position around independence + structured speed. Option B+C.
- **2026-07-08 — D2 (R023/R025/R027):** Build public page without payment before lawyer review. Option B.
- **2026-07-08 — D3 (R024):** Use a backup helper for in-person coverage. Option A.
- **2026-07-08 — D5 (R029):** Accept pilot kill criteria as drafted. Option A.
- **2026-07-08 — D6 (R030):** Accept fairness-to-vulnerable-users principle. Option A.