# HouseCheck

HouseCheck is a Madrid-focused rental scam verification service for people moving to the city before they can visit a property themselves.

The core idea is simple: a tenant finds a rental listing anywhere online, submits the listing to HouseCheck, and a local verifier checks whether the property exists, whether the address matches the listing, and whether there are visible red flags. The user receives a structured verification report with photos, videos, timestamps, and notes.

## Target users

- International students moving to Madrid
- Erasmus students
- Expats and remote workers
- Young professionals relocating to Spain
- Parents helping children find housing abroad
- Tenants worried about fake listings, fake landlords, or deposit scams

## Initial positioning

Most rental platforms only verify listings inside their own marketplace. HouseCheck focuses on **bring-your-own-listing verification**: the user can submit a listing from Idealista, Facebook groups, WhatsApp, Milanuncios, agency websites, or any other source.

## MVP principle

Start as a manual concierge service before building a full marketplace.

1. User submits listing URL, address, landlord contact, and desired checks.
2. HouseCheck manually assigns a local verifier.
3. Verifier visits the location, joins a live call if needed, takes evidence, and fills a report.
4. User receives a structured verification report.
5. After repeated demand, automate matching, payments, verifier onboarding, and scheduling.

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
- `docs/agent-routing.md` — choose the model / runtime (Claude, Codex, GLM) per session

## MVP scope

See `docs/mvp-scope.md`.

## Risks

See `docs/risk-register.md`.

## Legal assumptions

See `docs/legal-assumptions.md` and `docs/legal-questions-for-lawyer.md`.

## Current status

This repo is prepared as a starting point for product validation, market research, and MVP planning. It does not yet contain production code.

## First milestone

Validate whether people moving to Madrid will pay for a one-off rental verification before building a complete app.

Suggested first milestone:

- Create landing page
- Create listing submission form
- Define verification report format
- Recruit 3-5 trusted local verifiers
- Run 10 manual paid or semi-paid tests
- Interview users before and after each verification
- Decide whether to build marketplace software based on real demand

## Key hypothesis

People moving to Madrid are willing to pay for independent, fast, local verification when they find a suspicious but attractive rental listing and cannot visit it themselves.

