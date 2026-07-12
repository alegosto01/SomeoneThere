# HouseCheck

HouseCheck helps people moving to Madrid visit a rental remotely before sending a deposit.

The core service is simple: a trusted local verifier attends a property viewing, the client joins by WhatsApp, Google Meet, or Zoom video call, and the verifier shows the flat with permission while comparing it with the online listing. After the visit, the client receives a short verification report with listing match observations, risk indicators, confidence level, and unresolved concerns.

HouseCheck does not guarantee that a rental is safe. The verifier is only the client's eyes and ears.

## Target users

- International students moving to Madrid
- Erasmus students
- Expats and remote workers
- Young professionals relocating to Madrid
- Parents helping children find housing abroad

## Positioning

Primary:

> Visit a Madrid rental remotely before sending a deposit.

Alternative:

> A trusted local verifier visits the flat while you join by video call.

## MVP scope

The MVP focuses on one package only: **Remote Viewing Visit**.

- Madrid only
- trusted local verifier attends the viewing
- client joins by live video call
- verifier walks through the apartment with permission
- verifier compares the property with the listing
- client asks questions live
- client receives a short post-visit summary

Digital-only scam analysis, duplicate-image search, landlord background checks, ownership verification, AI risk scoring, contract review, and price analysis are deprioritized. They may become later add-ons, but they are not the main service.

## Safety boundaries

The verifier must not:

- enter without permission
- secretly record
- film people unnecessarily
- film private documents
- negotiate rent
- sign anything
- pay anything
- collect keys
- give legal advice
- guarantee the property is safe
- recommend whether the client should rent
- confront suspected scammers

## First milestone

3-5 people moving to Madrid use a HouseCheck verifier to view a rental remotely by video call and say the service helped them decide whether to continue.

## Repository structure

```text
HouseCheck/
├── README.md
├── docs/
│   ├── market-research/
│   ├── product/
│   ├── operations/
│   ├── business/
│   ├── legal/
│   └── tech/
├── backlog/
└── .github/
    └── ISSUE_TEMPLATE/
```

## Important files

- `docs/mvp-scope.md` - current MVP scope
- `docs/remote-viewing-checklist.md` - visit checklist
- `docs/operations/verifier-safety-sop.md` - verifier safety SOP
- `docs/pilot-plan.md` - pilot sequence and success criteria
- `docs/report-template.md` - post-visit summary template
- `docs/risk-register.md` - live risk register
- `docs/decision-log.md` - product decision history

## Current status

This repo is prepared for manual product validation and MVP planning. It does not yet contain production software.
