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
