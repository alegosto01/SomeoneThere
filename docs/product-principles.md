# HouseCheck Product Principles

## 1. Evidence, not guarantees

HouseCheck collects evidence and surfaces risk indicators. It never promises a rental is safe, scam-proof, or guaranteed.

## 2. Permission-first

Never enter a property without explicit permission from someone legally able to grant access.

## 3. Manual before automated

Validate demand with manual, concierge-style operations before building marketplace software.

## 4. Madrid-first

Stay focused on Madrid until the model is proven. Do not expand prematurely.

## 5. Smallest useful step

Every change should be the smallest useful step that reduces risk or validates a hypothesis.

## 6. Make risks explicit

Risks are written down in `docs/risk-register.md`, not hidden. Decisions are written in `docs/decision-log.md`.

## 7. Honest language

Use: evidence collected, risk indicators, verification report, confidence level, unresolved concerns.

Avoid: guaranteed safe, scam-proof, legally verified, official inspection, certified property, approved landlord.

## 8. Protect all parties

Protect users, verifiers, landlords, and the company. Never put a verifier in a dangerous situation for a report.

## 9. No brokerage in MVP

Do not negotiate, recommend, hold deposits, or act as an agent in the MVP.

## 10. Lawyer review for serious legal questions

Never claim legal certainty. Refer serious questions to `docs/legal-questions-for-lawyer.md`.

## 11. Fairness to vulnerable users (DRAFT — awaiting Alessandro acceptance, R030)

> Proposed by the Round 2 adversarial process. Alessandro must accept, modify, or reject.

The target user is often frightened, in a hurry, and under financial pressure — the same emotional state scammers exploit. HouseCheck must not mirror that pressure to sell:

- **No urgency cues** ("act now," "limited spots") that echo scam tactics.
- **No dark patterns** that push a stressed user to pay before they understand what a report is and is not.
- Consider a **free triage** path for clearly hopeless listings (e.g., obvious duplicate-address red flags) — if we would tell a friend "don't bother," we should not charge a stressed user to discover it.
- Report timing must be honest: if a report will not land before the user's deposit deadline, we should say so rather than take the fee.
