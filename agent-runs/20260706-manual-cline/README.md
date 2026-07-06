# Adversarial loop run — 20260706-manual-cline

- runtime: `cline` (this conversation — no `glm`/`codex`/`claude` CLI is installed)
- mode: read-only (solver proposes doc edits as fenced diffs; nothing applied)
- topic: full HouseCheck review

## Artifacts

1. [Problem Finder Report](01-finder-report.md) — 10 ranked risks (7 net-new), hidden assumptions, company-killers, legal-review and technical-spike checklists.
2. [Problem Solver Response](02-solver-response.md) — MVP-safe mitigation per risk + proposed (not applied) diffs to `risk-register.md`, `mvp-scope.md`, `decision-log.md`.
3. [Decision Judge Review](03-judge-review.md) — verdicts: 6 Accepted, 3 Needs stronger mitigation, 1 Needs legal review, 1 Needs technical spike. Plus 5 questions for Alessandro.
4. [Codex 5.5 Medium Resume Pass](04-codex-5.5-medium-resume.md) — autonomous implementation pass that applied conservative MVP-safe defaults and updated docs.

## Why this run exists

The user asked for the adversarial loop to be "run with glm." Check: no `glm`, `codex`, or `claude` CLI binary is installed on this machine — the AI tools present are VS Code extensions (Claude Code, ChatGPT, Cline), which a shell script cannot drive headlessly. So this run was produced inline by the current Cline agent instead, and saved to disk so the artifacts persist.

To get a real script-driven run later: install any one of the CLIs (`npm i -g @anthropic-ai/claude-code`, etc.), then `./scripts/adversarial-loop.sh <runtime>`.

## Top verdicts (TL;DR)

- **Ship first:** Basic listing review (digital, <4h, pay-before) + Exterior-only check. All in-person packages hard-gated behind a safety SOP + insurance.
- **MVP-blocking:** verifier safety SOP, defamation-safe report language, refund policy, landlord-data lawful basis, employment model review.
- **Needs Alessandro's call (5 questions):** seasonality posture, safety gate willingness, evidence-honesty willingness, free-substitute wedge, channel capacity.

## Resume result

Codex 5.5 medium resumed the loop without human intervention by applying conservative defaults:

- seasonal Aug-Oct MVP posture
- hard safety gate for in-person interior/viewing packages
- evidence-provenance disclosure in every report
- structured neutral report as the primary wedge versus free substitutes
- organic university and expat/Erasmus channels, no paid ads in MVP

Remaining blocks: Spanish lawyer review, field-visit insurance quote, evidence-capture technical spike, and timed dry runs before publishing SLAs.
