# HouseCheck MVP Scope

## MVP goal

Validate whether people moving to Madrid from abroad will pay for independent rental listing verification before paying a deposit.

## Target users

Primary:
- international students
- Erasmus students
- expats
- remote workers
- young professionals relocating to Madrid

Secondary:
- parents helping students move
- employees relocating for work
- people moving from another Spanish city

## Core MVP promise

HouseCheck helps users reduce uncertainty before paying a deposit by collecting evidence and risk indicators about a rental listing.

HouseCheck does not guarantee that a rental is safe.

## MVP services

### 1. Basic listing risk review

User submits:
- listing URL
- screenshots
- landlord/agent contact details if available
- price
- deposit request
- neighborhood
- concerns

HouseCheck checks:
- listing consistency
- price sanity
- duplicate red flags
- suspicious payment requests
- basic landlord/agent authority questions
- obvious scam indicators

Target pilot SLA: under 4 hours after payment and complete intake, only after a timed dry run proves this is realistic.

### 2. Exterior/address verification

Verifier checks:
- address exists
- building exterior matches listing
- neighborhood context
- entrance/building signs where legal and appropriate
- geotagged timestamped evidence if possible

Target pilot SLA: next day after payment and complete intake, only after a timed dry run proves this is realistic.

### 3. Permission-first viewing attendance

Blocked until `docs/operations/verifier-safety-sop.md` exists, a field-visit insurance quote is reviewed, and the safety gate is recorded in `docs/decision-log.md`.

Only when access is legitimately arranged.

Verifier can:
- attend a viewing
- join a live video call
- compare listing photos to reality
- check room/property condition at a basic visual level
- ask standard questions
- collect photos/videos only when allowed

### 4. Verification report

Report includes:
- summary
- what was checked
- what could not be checked
- evidence collected
- risk indicators
- confidence level
- unresolved concerns
- recommended next questions

## Out of scope for MVP

HouseCheck will not:
- negotiate rent
- sign contracts
- give legal advice
- hold deposits
- transfer money to landlords
- guarantee rental safety
- act as a real estate broker
- certify property condition
- publicly label landlords as scammers
- enter homes without permission
- store unnecessary personal documents

## MVP success metrics

Validation metrics:
- 20 user interviews
- 10 paid pilots
- at least 30% of interviewed target users say they would pay
- at least 5 users pay before the product is automated
- average gross margin per verification is positive
- Basic listing risk review delivered under 4 hours when dry-run evidence supports that SLA
- Exterior/address verification delivered next day when dry-run evidence supports that SLA
- less than 20% refund/dispute rate during pilot

## Pilot kill-criteria (DRAFT — awaiting Alessandro acceptance, R029)

> Success metrics tell us when to build. Kill-criteria tell us when to **stop**.
> These are proposed thresholds; Alessandro must accept or modify and commit in `docs/decision-log.md`.

Stop the pilot and reassess if **any** of these occur:

- Refund/dispute rate exceeds **40%** across the first 10 paid reports (twice the acceptable ceiling).
- Fewer than **3 of 20** interviewed target users indicate willingness to pay (below ~15%).
- Average verifier cost per job exceeds **70%** of the price charged for two consecutive pilots (structurally negative margin).
- No paid pilot can be completed within **3x** the target SLA (e.g., Basic > 12h) after two attempts (SLA is unrealistic).
- Stripe (or processor) places a hold/reserve that freezes operations for more than **7 days**.
- A safety incident or a near-miss during a field visit (R009/R015) before the backup-admin gate (R024) is resolved.

These thresholds are deliberately conservative for a first pilot. They exist to prevent sunk-cost drift, not to abandon prematurely.

## Pricing hypotheses

These are hypotheses to test, not final prices:

- Basic listing risk review: €29–€49
- Exterior/address check: €59–€99
- Viewing attendance: €99–€179
- Full verification report: €149–€249

Track:
- customer willingness to pay
- verifier cost
- travel time
- QA time
- support time
- refund requests
