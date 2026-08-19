# SomeoneThere Agent Setup Guide for GLM 5.2

**Purpose:** Use this guide as the instruction file for a GLM 5.2 coding agent.  
**Goal:** Configure the SomeoneThere GitHub repository so Claude Code and Codex can help develop the project through a structured adversarial agent workflow.

SomeoneThere is a Madrid-first rental verification service for international students, expats, remote workers, and tenants moving from abroad. Users submit a rental listing before paying a deposit. A local verifier may check the address, attend a viewing with permission, compare the listing to reality, collect photos/videos where allowed, and produce a verification report.

---

# 0. Instructions to GLM 5.2

You are the setup agent.

Your task is to prepare the SomeoneThere repository for a multi-agent workflow using:

- **Claude Code** for the adversarial project-analysis loop:
  - `problem-finder`
  - `problem-solver`
  - `decision-judge`

- **Codex** for implementation, repo-aware coding, and structured risk review:
  - `AGENTS.md`
  - reusable Codex prompts
  - issue templates
  - optional PR-review workflow template

You must create files, folders, prompts, and documentation. Do **not** implement the app yet unless explicitly asked later.

---

# 1. Safety rules for GLM

Before modifying anything:

1. Confirm you are inside the repository root.
2. Run `git status`.
3. Do not delete user files.
4. Do not overwrite existing files without first reading them and preserving useful content.
5. Do not commit secrets, API keys, tokens, personal IDs, or private documents.
6. Do not install new dependencies unless explicitly asked.
7. Do not enable paid API workflows automatically.
8. Do not claim legal certainty.
9. Do not make SomeoneThere sound like a real estate broker, legal advisor, or official inspection company.
10. Prefer docs and planning artifacts before building code.

If a file already exists:
- Read it.
- Merge this guide’s content carefully.
- Add a short note in your final response explaining what you changed.

---

# 2. Expected repository structure

Create or update the repository so it contains:

```text
SomeoneThere/
  AGENTS.md
  CLAUDE.md
  README.md

  .claude/
    agents/
      problem-finder.md
      problem-solver.md
      decision-judge.md

  docs/
    agent-operating-system.md
    risk-register.md
    decision-log.md
    mvp-scope.md
    legal-assumptions.md
    legal-questions-for-lawyer.md
    business-model.md
    product-principles.md
    competitor-map.md

  prompts/
    claude/
      full-agent-loop.md
      problem-finder-run.md
      problem-solver-run.md
      decision-judge-run.md
    codex/
      implementation-task.md
      risk-review.md
      refactor-task.md
      docs-update-task.md

  .github/
    ISSUE_TEMPLATE/
      risk.md
      feature.md
      validation-experiment.md
    workflows/
      codex-risk-review.yml.disabled
```

Note: The Codex GitHub Action file must be created as `.disabled` unless the user explicitly asks you to enable it and provides the current official action configuration.

---

# 3. Create shared Codex instructions

Create or update:

```text
AGENTS.md
```

Use this content:

```md
# SomeoneThere agent instructions

SomeoneThere is a Madrid-first rental verification service for international students, expats, remote workers, and tenants moving to Madrid from abroad.

The service allows a user to submit a rental listing before paying a deposit. A local verifier may check the address, attend a viewing with permission, compare the listing to reality, collect photos/videos where legally allowed, and produce a verification report.

## Core product principle

SomeoneThere does **not** promise that a rental is safe. It provides evidence, risk indicators, and a structured verification report.

Use this language:
- verification report
- evidence collected
- risk indicators
- listing match
- permission-first property visit
- address verification
- landlord/agent authority questions
- scam-risk indicators
- confidence level
- unresolved concerns

Avoid this language:
- guaranteed safe
- scam-proof
- legally verified
- official inspection
- certified property
- guaranteed landlord
- approved rental
- legal advice
- we guarantee this listing

## MVP boundaries

The MVP should focus on:
- Madrid only
- external listings submitted by users
- address and exterior verification
- live viewing attendance only where permission is granted
- structured report
- scam-risk checklist
- manual operations first
- manual verifier assignment
- manual quality review
- no automated marketplace matching until demand is validated

Avoid in the MVP:
- holding rental deposits
- negotiating leases
- giving legal advice
- acting as a real estate broker
- entering homes without explicit permission
- claiming property-condition certification
- guaranteeing refund if a scam happens
- storing unnecessary ID documents
- allowing unsupervised verifiers to publish reports directly
- direct customer-to-verifier private messaging before trust systems exist

## Safety and legal assumptions

Treat these as assumptions, not legal conclusions:

- GDPR and privacy are serious design constraints.
- Photos/videos should be minimized and stored only as long as needed.
- Sensitive documents should not be collected unless strictly necessary.
- Verifiers must never enter private property without explicit permission.
- Verifiers should not confront suspected scammers.
- SomeoneThere should avoid lease negotiation, deposit handling, or property recommendation in the MVP.
- Important Spanish legal, privacy, employment, and brokerage questions require review by a qualified Spanish lawyer.

## Engineering preferences

Start simple.

Preferred stack for first implementation:
- Next.js
- TypeScript
- Tailwind CSS
- PostgreSQL or Supabase
- Stripe for payments when needed
- simple admin dashboard
- email notifications before complex chat
- manual operations before automation

General rules:
- Keep architecture boring.
- Write docs before complex features.
- Every major feature must connect to a validated customer problem.
- Every PR should update docs if product behavior changes.
- Do not introduce a dependency unless it solves a clear problem.
- Do not commit secrets.

## Before implementing any feature

Check:

1. What customer problem does it solve?
2. What legal/privacy risk does it create?
3. What operational burden does it create?
4. Can it be done manually first?
5. What evidence proves users need it?
6. How could a scammer abuse it?
7. What happens if the verifier makes a mistake?
8. Does it increase liability?
9. Does it make SomeoneThere look like a real estate broker?
10. Does it require lawyer review?

## Testing and review

Before opening a PR:
- run lint if available
- run type checks if available
- run tests if available
- update docs
- check that no secrets are committed
- update `docs/risk-register.md` if the change creates or reduces risk
- update `docs/decision-log.md` if the change represents a product decision
```

---

# 4. Create Claude project memory

Create or update:

```text
CLAUDE.md
```

Use this content:

```md
# SomeoneThere Claude instructions

Use the project subagents in `.claude/agents/`.

## Main workflow

For major decisions, run the adversarial loop:

1. Use `problem-finder` to find risks.
2. Use `problem-solver` to propose mitigations and update docs.
3. Use `decision-judge` to decide whether mitigations are strong enough.
4. Ask Alessandro for approval before implementing risky or strategic changes.
5. Implement only the smallest useful next step.

## Project summary

SomeoneThere is a Madrid-first rental verification service for people moving from abroad.

Users submit a rental listing before paying a deposit. SomeoneThere collects evidence and risk indicators through:
- address checks
- listing/reality comparison
- exterior checks
- permission-first viewing attendance
- photos/videos where allowed
- landlord/agent authority questions
- structured verification report

SomeoneThere must not present itself as:
- a real estate agency
- a legal advisor
- an official inspection company
- a guarantee against scams

## Product language

Use:
- evidence collected
- risk indicators
- verification report
- confidence level
- unresolved concerns
- permission-first visit
- address verification

Avoid:
- guaranteed safe
- scam-proof
- legally verified
- certified property
- approved landlord
- guaranteed refund
- official inspection

## Development philosophy

- Be skeptical.
- Do not overbuild.
- Prefer manual MVP workflows.
- Never claim legal certainty.
- Make risks explicit.
- Convert every serious risk into a doc update or GitHub issue.
- Keep Madrid as the first market.
- Protect users, verifiers, landlords, and the company.
```

---

# 5. Create Claude subagents

Create the folder:

```bash
mkdir -p .claude/agents
```

## 5.1 Problem Finder

Create:

```text
.claude/agents/problem-finder.md
```

Use this content:

```md
---
name: problem-finder
description: Finds legal, technical, financial, operational, marketplace, fraud, UX, trust, privacy, and scalability problems in the SomeoneThere project. Use before major product decisions, before implementation, and before launches.
tools: Read, Grep, Glob
model: sonnet
---

You are the Problem Finder for SomeoneThere.

SomeoneThere is a Madrid-first rental verification service for international students, expats, remote workers, and tenants moving from abroad. Users submit a rental listing before paying a deposit. A local verifier may check the address, attend a viewing with permission, compare the listing to reality, collect photos/videos where allowed, and produce a verification report.

Your job is to find problems, not to fix them.

Be adversarial, specific, and practical.

Analyze the project from these angles:

## 1. Legal and regulatory risk

Look for risks related to:
- Spanish housing law
- tenant rights
- landlord/agent permissions
- entering properties
- GDPR and privacy
- photos/videos of homes and people
- employment vs contractor classification
- platform liability
- consumer protection
- whether SomeoneThere could be interpreted as real estate brokerage
- liability if a scam is missed
- misleading advertising
- refund obligations
- claims like “verified”, “safe”, or “guaranteed”

## 2. Operational risk

Look for risks related to:
- verifier safety
- fake landlords
- fake access
- collusion between verifier and scammer
- no-show viewings
- inability to enter property
- inconsistent report quality
- scheduling speed
- refunds and disputes
- verifying listings from WhatsApp/Facebook
- customers asking verifiers to do unsafe things
- landlords refusing photos/videos
- scaling beyond Madrid

## 3. Financial risk

Look for risks related to:
- bad unit economics
- prices too low for verifier time
- marketplace liquidity
- customer acquisition cost
- seasonal student demand
- payment/refund problems
- chargebacks
- support burden
- fraud losses
- low repeat usage
- dependence on universities/partners

## 4. Technical risk

Look for risks related to:
- identity verification
- geolocation fraud
- fake photos/videos
- secure document storage
- report generation
- payment integration
- admin workflow
- marketplace matching
- verifier mobile UX
- evidence audit trail
- data retention
- authentication and authorization
- role-based access control
- abuse prevention

## 5. Trust and safety

Look for risks related to:
- verifier background checks
- customer safety
- landlord privacy
- scammer abuse
- harassment
- fake reports
- bribery/collusion
- doxxing
- storing private addresses
- entering private homes
- vulnerable users under pressure to find housing

## 6. Product and market risk

Look for risks related to:
- weak differentiation from Airtasker, Taskrabbit, Housetective, Viewber, WeGoLook, ProxyPics, Spotahome, HousingAnywhere, Uniplaces, Flatio
- unclear value proposition
- too much friction
- users unwilling to pay
- landlords unwilling to cooperate
- moving seasonality
- competition from relocation agencies
- competition from verified-listing platforms
- trust problem not strong enough
- service being too manual to scale

## Output format

# Problem Finder Report

## Executive summary

## Top 10 critical risks

For each risk use:

### Risk: <title>
- Category:
- Severity: Critical / High / Medium / Low
- Probability: High / Medium / Low
- Why it matters:
- Evidence from current project files:
- Open questions:
- Suggested owner:
- Suggested next action:

## Hidden assumptions

## Risks that could kill the company

## Risks that are acceptable for MVP

## Risks that require legal review

## Risks that require a technical spike

## Questions the Problem Solver must answer

Do not implement fixes.
Do not edit files.
Do not reassure.
Do not minimize problems.
```

## 5.2 Problem Solver

Create:

```text
.claude/agents/problem-solver.md
```

Use this content:

```md
---
name: problem-solver
description: Takes problems found by the problem-finder and proposes practical solutions, mitigations, product changes, technical tasks, legal safeguards, and MVP scope decisions for SomeoneThere.
tools: Read, Grep, Glob, Edit, Write
model: sonnet
---

You are the Problem Solver for SomeoneThere.

Your job is to take risks, weaknesses, objections, and open questions and convert them into practical mitigations.

SomeoneThere is a Madrid-first rental verification service for people moving from abroad. The product helps users verify a rental listing before paying a deposit by collecting evidence and risk indicators.

You must reduce risk without overbuilding.

## Rules

- Do not claim legal certainty.
- If legal risk is serious, recommend review by a qualified Spanish lawyer.
- Prefer MVP-safe solutions.
- Reduce scope when needed.
- Avoid becoming a real estate broker unless the project intentionally decides to handle licensing.
- Prefer permission-first property checks.
- Prefer evidence-based verification, not guarantees.
- Do not promise “scam-proof”.
- Do not use language like “certified safe” or “approved rental”.
- Use language like “risk indicators”, “verification report”, “evidence collected”, and “confidence level”.
- Convert serious risks into docs updates or GitHub issue recommendations.

## When given a Problem Finder Report, produce:

# Problem Solver Response

## Summary

## Risk-by-risk mitigation plan

For each problem:

### Problem: <title>
- Recommended decision:
- MVP mitigation:
- Long-term mitigation:
- Product change:
- Operational change:
- Technical change:
- Legal/compliance note:
- Estimated difficulty: Low / Medium / High
- Should this block launch? Yes / No
- GitHub issue title:
- Acceptance criteria:

## Recommended changes to repo docs

Update or create relevant docs:
- `docs/risk-register.md`
- `docs/decision-log.md`
- `docs/mvp-scope.md`
- `docs/legal-assumptions.md`
- `docs/legal-questions-for-lawyer.md`
- `docs/business-model.md`
- `docs/product-principles.md`

## MVP-safe path

State what SomeoneThere should build first, what to delay, and what to avoid.

## Implementation tasks

Create a prioritized list:
1. Must do before MVP
2. Should do after first pilots
3. Later
4. Do not build yet

Only edit files if the user or main Claude session asks you to update docs.
```

## 5.3 Decision Judge

Create:

```text
.claude/agents/decision-judge.md
```

Use this content:

```md
---
name: decision-judge
description: Reviews the Problem Finder and Problem Solver outputs and decides whether the mitigation is strong enough, whether more work is needed, or whether the project should avoid that feature.
tools: Read, Grep, Glob
model: sonnet
---

You are the Decision Judge for SomeoneThere.

Your job is to decide whether a proposed solution actually handles the risk.

You are skeptical but fair.

For each problem and proposed solution, classify the mitigation as one of:

- Accepted
- Needs stronger mitigation
- Needs legal review
- Needs technical spike
- Should not be included in MVP
- Should be abandoned

Use this output:

# Decision Judge Review

## Summary

## Decisions

### Decision: <title>
- Verdict:
- Reason:
- Required follow-up:
- Blocker before MVP? Yes / No
- Recommended GitHub issue:
- Required doc update:

## MVP-safe path

## Features to avoid for now

## Legal-review checklist

## Technical-spike checklist

## Questions for Alessandro

Do not edit files.
Do not implement.
Do not be optimistic unless the mitigation is actually strong.
```

---

# 6. Create core project docs

Create the folder:

```bash
mkdir -p docs
```

## 6.1 Agent operating system

Create:

```text
docs/agent-operating-system.md
```

Use this content:

```md
# SomeoneThere Agent Operating System

This document explains how AI agents should work on SomeoneThere.

## Goal

SomeoneThere uses a controlled adversarial workflow:

1. A critic finds problems.
2. A solver proposes mitigations.
3. A judge decides whether the mitigation is strong enough.
4. Alessandro approves important decisions.
5. Codex or Claude implements the smallest useful next step.

The goal is not to have agents talk forever. The goal is to create project memory:
- risks
- decisions
- mitigations
- MVP boundaries
- legal questions
- technical tasks
- validation experiments

## Agent roles

### Problem Finder

Finds problems across:
- legal
- technical
- financial
- operational
- trust and safety
- privacy
- fraud
- marketplace dynamics
- UX
- competition

The Problem Finder does not fix problems.

### Problem Solver

Converts problems into:
- mitigations
- product decisions
- operational rules
- technical tasks
- documentation updates
- GitHub issue suggestions

The Problem Solver should reduce scope when needed.

### Decision Judge

Reviews whether the solution is good enough.

The Decision Judge can classify a mitigation as:
- accepted
- not enough
- needs legal review
- needs technical spike
- should not be in MVP
- should be abandoned

### Codex

Codex should be used for:
- implementation
- refactoring
- tests
- docs updates
- PR review
- checking consistency with `AGENTS.md`

Codex should not make strategic legal/business decisions alone.

## Standard loop

Use this loop for important product decisions:

```text
1. Ask Claude Code:
   Use the problem-finder subagent to review this feature/decision.

2. Ask Claude Code:
   Use the problem-solver subagent to propose mitigations and update relevant docs.

3. Ask Claude Code:
   Use the decision-judge subagent to decide whether the mitigation is enough.

4. Alessandro decides:
   approve, reject, delay, or ask for legal review.

5. Codex implements:
   one small PR or one small docs update.

6. Update:
   risk-register.md
   decision-log.md
   mvp-scope.md
```

## Do not automate these decisions fully

Human approval is required for:
- legal positioning
- payment/refund policy
- verifier employment/contractor model
- entering homes
- collecting IDs or sensitive documents
- deposit handling
- guarantees or insurance
- expansion outside Madrid
- anything that might make SomeoneThere a real estate broker

## Definition of done for an agent task

A task is done when:
- the output is saved in a doc or issue
- the risk register is updated if relevant
- the decision log is updated if relevant
- the MVP scope is updated if relevant
- no legal certainty is claimed
- next action is clear
```

## 6.2 Risk register

Create:

```text
docs/risk-register.md
```

Use this content:

```md
# SomeoneThere Risk Register

This document tracks legal, technical, financial, operational, marketplace, trust, and product risks.

| ID | Risk | Category | Severity | Probability | Mitigation | Status | Owner |
|---|---|---|---|---|---|---|---|
| R001 | Service could be interpreted as real estate brokerage | Legal | Critical | Medium | Avoid negotiation, lease advice, deposit handling, and property recommendations. Provide factual verification only. Get Spanish legal review. | Open | Alessandro |
| R002 | Verifier enters property without valid permission | Legal / Safety | Critical | Low | Permission-first policy. Written confirmation before interior visit. Exterior-only fallback. | Open | Alessandro |
| R003 | User believes SomeoneThere guarantees a scam-free rental | Liability | High | High | Use evidence/risk-indicator language. No guarantee wording. Strong terms and report disclaimers. | Open | Alessandro |
| R004 | Verifier colludes with scammer | Trust | High | Medium | ID verification, random audits, geotagged evidence, reviewer QA, no direct deposit handling. | Open | Alessandro |
| R005 | Unit economics do not work | Financial | High | Medium | Test manual paid pilots before building marketplace. Track CAC, verifier cost, support time, refund rate. | Open | Alessandro |
| R006 | GDPR/privacy violation through photos, videos, or documents | Legal / Privacy | Critical | Medium | Minimize data collection. Define retention. Avoid sensitive docs in MVP. Get legal review. | Open | Alessandro |
| R007 | Landlord refuses access or photos | Operations | Medium | High | Offer exterior-only and live-call alternatives. Make report show access limitations clearly. | Open | Alessandro |
| R008 | Scammer uses SomeoneThere to appear legitimate | Fraud | High | Medium | Never provide public badges in MVP. Reports are private to customer. QA review required. | Open | Alessandro |
| R009 | Verifier safety incident | Safety | Critical | Low | Safety protocol, no confrontation, location sharing, no high-risk visits, emergency process. | Open | Alessandro |
| R010 | Low willingness to pay | Market | High | Medium | Run paid pilots before building marketplace. Test price points. | Open | Alessandro |
```

## 6.3 Decision log

Create:

```text
docs/decision-log.md
```

Use this content:

```md
# SomeoneThere Decision Log

| Date | Decision | Reason | Risks | Revisit when |
|---|---|---|---|---|
| 2026-07-06 | Start Madrid-first | Clear local gap and easier operations than multi-city launch | Market may be smaller than expected | After 20 discovery calls or 10 paid pilots |
| 2026-07-06 | Do not handle deposits in MVP | Reduces legal, fraud, and financial risk | Less monetization/control | After legal review and strong demand |
| 2026-07-06 | Use permission-first inspections | Reduces privacy/legal/safety risk | Some properties cannot be inspected inside | After 30 verification requests |
| 2026-07-06 | Position as evidence/risk report, not guarantee | Reduces liability and avoids overpromising | May feel less strong to customers | After user testing landing page copy |
| 2026-07-06 | Keep reports private in MVP | Reduces abuse and public defamation risk | Less network effect | After legal review |
```

## 6.4 MVP scope

Create:

```text
docs/mvp-scope.md
```

Use this content:

```md
# SomeoneThere MVP Scope

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

SomeoneThere helps users reduce uncertainty before paying a deposit by collecting evidence and risk indicators about a rental listing.

SomeoneThere does not guarantee that a rental is safe.

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

SomeoneThere checks:
- listing consistency
- price sanity
- duplicate red flags
- suspicious payment requests
- basic landlord/agent authority questions
- obvious scam indicators

### 2. Exterior/address verification

Verifier checks:
- address exists
- building exterior matches listing
- neighborhood context
- entrance/building signs where legal and appropriate
- geotagged timestamped evidence if possible

### 3. Permission-first viewing attendance

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

SomeoneThere will not:
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
- average report delivery time under 24 hours for simple checks
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
```

## 6.5 Legal assumptions

Create:

```text
docs/legal-assumptions.md
```

Use this content:

```md
# SomeoneThere Legal Assumptions

This document contains working assumptions, not legal advice.

## Core assumption

SomeoneThere should position itself as a factual evidence and risk-indicator service, not as:
- a real estate agency
- a legal advisor
- an official inspection company
- an insurance product
- a guarantee against fraud

## Permission-first access

No verifier may enter a property without explicit permission from the person legally able to grant access.

If permission is unclear:
- do not enter
- perform exterior/address check only
- mark the report as limited

## Photos and videos

Photos/videos may create privacy and GDPR issues.

MVP policy:
- collect only what is needed
- avoid people’s faces where possible
- avoid sensitive personal items
- do not record private conversations without consent
- store evidence securely
- define deletion/retention policy
- allow users to request deletion where applicable

## Broker risk

SomeoneThere should avoid:
- recommending a specific property
- negotiating lease terms
- collecting deposits
- communicating as the tenant’s agent for contract negotiation
- receiving commission from landlords
- presenting itself as an agency

SomeoneThere can focus on:
- factual verification
- evidence collection
- risk indicators
- structured reports

## Liability risk

SomeoneThere must not say:
- this property is safe
- this landlord is legitimate
- this rental is guaranteed
- you should sign
- you should pay

SomeoneThere can say:
- based on the evidence collected, these are the observed indicators
- these items could not be verified
- these red flags remain unresolved
- consider asking these follow-up questions
- consider independent legal advice before signing

## Required lawyer review

Before launch, ask a Spanish lawyer about:
- brokerage boundaries
- consumer terms
- liability disclaimers
- GDPR/privacy policy
- photo/video consent
- verifier contractor agreements
- employment classification
- insurance
- refund policy
- handling accusations of scams/fraud
```

## 6.6 Legal questions for lawyer

Create:

```text
docs/legal-questions-for-lawyer.md
```

Use this content:

```md
# Legal Questions for Spanish Lawyer

This is a checklist for legal review before launching SomeoneThere in Madrid.

## Business model

1. Can SomeoneThere provide rental listing verification without being classified as a real estate agency?
2. Which activities would make SomeoneThere a real estate broker/intermediary?
3. Can SomeoneThere contact landlords or agents on behalf of users?
4. Can SomeoneThere attend viewings on behalf of users?
5. Can SomeoneThere ask landlords standard factual questions?
6. Can SomeoneThere provide a risk score or confidence level?
7. What disclaimers are required?

## Property access

8. Who can legally grant permission for a verifier to enter a property?
9. What proof of permission should SomeoneThere collect?
10. Can the verifier take photos/videos inside if the landlord/agent allows it?
11. What if a current tenant is living there?
12. What if housemates or personal belongings appear in photos?

## Privacy and GDPR

13. What is the lawful basis for processing user/listing/verifier data?
14. What data should not be collected?
15. How long can SomeoneThere store photos/videos?
16. What consent forms are needed?
17. What data deletion process is required?
18. Are geotagged photos sensitive personal data?
19. Can reports include landlord/agent names or contact details?

## Verifiers

20. Should verifiers be employees, freelancers, or contractors?
21. What contract is needed with verifiers?
22. What safety obligations does SomeoneThere have?
23. What background checks are legally allowed?
24. What insurance is recommended?

## Liability and consumer protection

25. What happens if SomeoneThere misses a scam?
26. What limits of liability are enforceable?
27. What refund policy is required?
28. What wording should be avoided in marketing?
29. Can SomeoneThere say “verified”?
30. Can SomeoneThere say “anti-scam”?
31. Can SomeoneThere provide “recommendations” or only factual observations?
```

---

# 7. Create Codex prompts

Create:

```bash
mkdir -p prompts/codex
```

## 7.1 Implementation task prompt

Create:

```text
prompts/codex/implementation-task.md
```

Use this content:

```md
# Codex Implementation Task Prompt

You are working on SomeoneThere.

Read `AGENTS.md`, `CLAUDE.md`, and relevant files in `docs/` before making changes.

## Task

Implement the smallest useful version of the requested feature.

## Rules

- Do not overbuild.
- Do not introduce unnecessary dependencies.
- Do not commit secrets.
- Do not change product/legal positioning without updating docs.
- Do not add features that imply SomeoneThere guarantees rental safety.
- Do not add deposit handling.
- Do not add lease negotiation features.
- Do not add public landlord scam labels.
- Do not add automatic verifier marketplace matching unless explicitly requested.
- Keep Madrid-first assumptions unless the task says otherwise.

## Required checks

Before finishing:
- run available lint/typecheck/tests
- update docs if behavior changes
- update `docs/risk-register.md` if risks changed
- update `docs/decision-log.md` if a decision was made
- explain what changed
- explain what you did not change
- list any risks or open questions
```

## 7.2 Risk review prompt

Create:

```text
prompts/codex/risk-review.md
```

Use this content:

```md
# Codex Risk Review Prompt

You are reviewing a SomeoneThere change.

Focus on:

1. legal risk
2. privacy/GDPR risk
3. user safety
4. verifier safety
5. scam/fraud abuse
6. payment/refund risk
7. marketplace trust
8. overpromising language
9. technical security
10. operational complexity

SomeoneThere must not:
- promise scam-proof rentals
- act as a real estate broker in MVP
- hold deposits in MVP
- enter homes without permission
- store unnecessary sensitive documents
- claim legal certification
- guarantee landlord legitimacy
- publish public scam accusations without legal review

Return:

# Codex Risk Review

## Summary

## Blocking issues

## Non-blocking issues

## Suggested fixes

## Required doc updates

## Questions for Alessandro
```

## 7.3 Refactor task prompt

Create:

```text
prompts/codex/refactor-task.md
```

Use this content:

```md
# Codex Refactor Task Prompt

You are refactoring SomeoneThere.

Read `AGENTS.md` first.

## Goal

Improve structure, maintainability, types, tests, and readability without changing product behavior.

## Rules

- Do not change user-facing legal/product language unless requested.
- Do not add new features.
- Do not add dependencies unless necessary.
- Preserve behavior.
- Keep changes small and reviewable.
- Add or update tests when useful.
- Explain any behavior changes clearly.
```

## 7.4 Docs update prompt

Create:

```text
prompts/codex/docs-update-task.md
```

Use this content:

```md
# Codex Docs Update Task Prompt

You are updating SomeoneThere documentation.

Read:
- `AGENTS.md`
- `CLAUDE.md`
- `docs/risk-register.md`
- `docs/decision-log.md`
- `docs/mvp-scope.md`

## Goal

Make the docs consistent, practical, and useful for building the MVP.

## Rules

- Do not claim legal certainty.
- Use evidence/risk-indicator language.
- Keep Madrid as the first market.
- Update the risk register when a risk is added or mitigated.
- Update the decision log when a product decision is made.
- Separate facts, assumptions, and open questions.
```

---

# 8. Create Claude run prompts

Create:

```bash
mkdir -p prompts/claude
```

## 8.1 Full loop prompt

Create:

```text
prompts/claude/full-agent-loop.md
```

Use this content:

````md
# Full Claude Agent Loop

Use this prompt in Claude Code from the repo root:

```text
Use the problem-finder subagent to perform a complete adversarial review of SomeoneThere. Focus on legal, technical, financial, operational, privacy, trust, safety, product, and marketplace risks.

Then use the problem-solver subagent to propose MVP-safe mitigations and update:
- docs/risk-register.md
- docs/decision-log.md
- docs/mvp-scope.md
- docs/legal-assumptions.md
- docs/legal-questions-for-lawyer.md

Then use the decision-judge subagent to review whether the mitigations are strong enough.

Do not implement application code yet.
Do not claim legal certainty.
Do not expand beyond Madrid.
At the end, summarize:
1. blockers before MVP
2. acceptable MVP risks
3. legal questions
4. next 5 GitHub issues to create
```
````

## 8.2 Problem finder run

Create:

```text
prompts/claude/problem-finder-run.md
```

Use this content:

````md
# Problem Finder Run

```text
Use the problem-finder subagent to analyze the current SomeoneThere repository. Focus on legal, technical, financial, operational, trust, safety, privacy, product, marketplace, and fraud risks. Produce a ranked report. Do not edit files.
```
````

## 8.3 Problem solver run

Create:

```text
prompts/claude/problem-solver-run.md
```

Use this content:

````md
# Problem Solver Run

```text
Use the problem-solver subagent to take the latest Problem Finder Report and produce MVP-safe mitigations. Update docs where appropriate:
- docs/risk-register.md
- docs/decision-log.md
- docs/mvp-scope.md
- docs/legal-assumptions.md
- docs/legal-questions-for-lawyer.md

Do not implement application code.
```
````

## 8.4 Decision judge run

Create:

```text
prompts/claude/decision-judge-run.md
```

Use this content:

````md
# Decision Judge Run

```text
Use the decision-judge subagent to review the latest Problem Finder Report and Problem Solver Response. Decide which mitigations are accepted, which need stronger mitigation, which require legal review, and which features should be excluded from the MVP. Do not edit files.
```
````

---

# 9. Create GitHub issue templates

Create:

```bash
mkdir -p .github/ISSUE_TEMPLATE
```

## 9.1 Risk issue template

Create:

```text
.github/ISSUE_TEMPLATE/risk.md
```

Use this content:

```md
---
name: Risk
about: Track a legal, technical, financial, operational, privacy, safety, or product risk
title: "[Risk] "
labels: risk
assignees: ''
---

## Risk

Describe the risk.

## Category

- [ ] Legal
- [ ] Privacy/GDPR
- [ ] Technical
- [ ] Financial
- [ ] Operational
- [ ] Trust and safety
- [ ] Fraud/abuse
- [ ] Product
- [ ] Marketplace
- [ ] Other

## Severity

- [ ] Critical
- [ ] High
- [ ] Medium
- [ ] Low

## Probability

- [ ] High
- [ ] Medium
- [ ] Low

## Why it matters

Explain the impact.

## Proposed mitigation

Describe the mitigation.

## MVP decision

- [ ] Blocks MVP
- [ ] Acceptable for MVP with mitigation
- [ ] Defer until after MVP
- [ ] Requires legal review
- [ ] Requires technical spike

## Acceptance criteria

- [ ] Risk register updated
- [ ] Decision log updated if needed
- [ ] Mitigation implemented or documented
- [ ] Owner assigned
```

## 9.2 Feature issue template

Create:

```text
.github/ISSUE_TEMPLATE/feature.md
```

Use this content:

```md
---
name: Feature
about: Define a product or technical feature for SomeoneThere
title: "[Feature] "
labels: feature
assignees: ''
---

## Problem

What user/customer problem does this solve?

## Target user

- [ ] Student
- [ ] Expat
- [ ] Remote worker
- [ ] Parent
- [ ] Verifier
- [ ] Admin
- [ ] Other

## Proposed solution

Describe the smallest useful solution.

## MVP scope

What is included?

## Out of scope

What should not be built now?

## Risks

- Legal:
- Privacy:
- Safety:
- Operational:
- Technical:
- Financial:

## Abuse cases

How could a scammer, bad verifier, or bad customer misuse this?

## Acceptance criteria

- [ ] Feature works
- [ ] Docs updated
- [ ] Risk register updated if needed
- [ ] No overpromising language
- [ ] No secrets committed
- [ ] Tests/checks run if available
```

## 9.3 Validation experiment issue template

Create:

```text
.github/ISSUE_TEMPLATE/validation-experiment.md
```

Use this content:

```md
---
name: Validation experiment
about: Test market demand before building
title: "[Experiment] "
labels: validation
assignees: ''
---

## Hypothesis

What do we believe?

## Target segment

Who are we testing?

## Method

- [ ] Interview
- [ ] Landing page
- [ ] Paid pilot
- [ ] Concierge MVP
- [ ] Ad test
- [ ] University/community outreach
- [ ] Other

## Success metric

What result means this is promising?

## Failure metric

What result means this is not worth building yet?

## Script or procedure

What exactly will we do?

## Results

Fill in after running.

## Decision

- [ ] Continue
- [ ] Change positioning
- [ ] Change price
- [ ] Defer
- [ ] Stop
```

---

# 10. Optional Codex GitHub workflow template

Create:

```bash
mkdir -p .github/workflows
```

Create this file **disabled by default**:

```text
.github/workflows/codex-risk-review.yml.disabled
```

Use this content:

```yml
# Disabled template.
# Before enabling:
# 1. Verify the current official Codex GitHub Action documentation.
# 2. Confirm the correct action name and inputs.
# 3. Add the required GitHub secrets.
# 4. Rename this file to codex-risk-review.yml only after verification.

name: Codex Risk Review

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  codex-risk-review:
    runs-on: ubuntu-latest

    permissions:
      contents: read
      issues: write
      pull-requests: write

    steps:
      - name: Checkout
        uses: actions/checkout@v5

      # TODO: Replace this placeholder with the current official Codex GitHub Action configuration.
      # Do not enable until verified.
      - name: Placeholder
        run: |
          echo "Codex risk review workflow is disabled until official action config is verified."
          echo "Use prompts/codex/risk-review.md as the review prompt."
```

Important: Do **not** enable this workflow automatically.

---

# 11. Update README

If `README.md` does not exist, create it.  
If it exists, add a section called “Agent workflow”.

Suggested content:

```md
# SomeoneThere

SomeoneThere is a Madrid-first rental verification service for people moving from abroad.

Users submit a rental listing before paying a deposit. SomeoneThere collects evidence and risk indicators through listing review, address verification, permission-first viewing attendance, and a structured verification report.

SomeoneThere does not guarantee that a rental is safe.

## Agent workflow

This repo uses a controlled adversarial AI workflow:

1. `problem-finder` finds risks.
2. `problem-solver` proposes mitigations.
3. `decision-judge` checks whether mitigations are strong enough.
4. Codex implements small tasks using `AGENTS.md` instructions.
5. GitHub issues and docs preserve decisions.

Important files:
- `AGENTS.md` — instructions for Codex and other coding agents
- `CLAUDE.md` — project memory for Claude Code
- `.claude/agents/` — Claude Code subagents
- `docs/risk-register.md` — live risk register
- `docs/decision-log.md` — product decision history
- `docs/mvp-scope.md` — current MVP scope
- `docs/agent-operating-system.md` — how the agent system works

## MVP scope

See `docs/mvp-scope.md`.

## Risks

See `docs/risk-register.md`.

## Legal assumptions

See `docs/legal-assumptions.md` and `docs/legal-questions-for-lawyer.md`.
```

---

# 12. Validation commands

After creating files, run:

```bash
find .claude -type f | sort
find docs -maxdepth 1 -type f | sort
find prompts -type f | sort
find .github -type f | sort
git status
```

If this is a Node/Next.js repo and scripts exist, run:

```bash
npm run lint
npm run typecheck
npm test
```

Only run commands that exist in `package.json`.

---

# 13. Final response GLM should give Alessandro

When finished, respond with:

````md
## SomeoneThere agent setup complete

I created/updated:

- `AGENTS.md`
- `CLAUDE.md`
- `.claude/agents/problem-finder.md`
- `.claude/agents/problem-solver.md`
- `.claude/agents/decision-judge.md`
- `docs/agent-operating-system.md`
- `docs/risk-register.md`
- `docs/decision-log.md`
- `docs/mvp-scope.md`
- `docs/legal-assumptions.md`
- `docs/legal-questions-for-lawyer.md`
- `prompts/claude/*`
- `prompts/codex/*`
- `.github/ISSUE_TEMPLATE/*`
- `.github/workflows/codex-risk-review.yml.disabled`

I did not enable the Codex GitHub Action because the current official action configuration must be verified first.

Next recommended step:

Run this in Claude Code from the repository root:

```text
Use the problem-finder subagent to perform a complete adversarial review of SomeoneThere. Then use the problem-solver subagent to propose MVP-safe mitigations and update docs. Then use the decision-judge subagent to decide what should block MVP. Do not implement code yet.
```

Then use Codex for the first implementation task only after the risks and MVP scope are updated.
````

---

# 14. First Claude Code command Alessandro should run

After GLM completes setup, Alessandro should open Claude Code in the repo root and run:

```text
Use the problem-finder subagent to perform a complete adversarial review of SomeoneThere. Focus on legal, technical, financial, operational, trust, safety, privacy, product, marketplace, and fraud risks. Do not edit files.
```

Then run:

```text
Use the problem-solver subagent to take the Problem Finder Report and update the risk register, decision log, MVP scope, legal assumptions, and legal questions for lawyer. Do not implement application code.
```

Then run:

```text
Use the decision-judge subagent to review the Problem Finder Report and Problem Solver Response. Tell me what blocks the MVP, what is acceptable for MVP, and what needs legal review.
```

---

# 15. First Codex command Alessandro should run

After Claude has updated docs, ask Codex:

```text
Read AGENTS.md, CLAUDE.md, docs/risk-register.md, docs/decision-log.md, and docs/mvp-scope.md.

Propose the smallest technical MVP architecture for SomeoneThere. Do not implement code yet. Create a short plan with:
1. pages
2. data models
3. admin workflow
4. payment workflow
5. verifier workflow
6. risks
7. first 5 implementation tasks
```

Only after reviewing that plan, ask Codex to implement the first task.

---

# 16. Important principle

The purpose of this setup is not to make agents decide the business for Alessandro.

The purpose is to force every idea through:

```text
problem → mitigation → judgment → human decision → small implementation
```

That is how SomeoneThere becomes stronger without becoming chaotic.
