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

## Runtime choice (which model runs each role)

The roles above are **runtime-neutral** plain-text instructions. You can run each one in Claude Code, Codex, or GLM depending on which you have available — useful when you are out of Claude tokens.

- Choose the runtime per session; there is no persistent setting to maintain.
- Claude Code reads `.claude/agents/*.md` natively as subagents; override the model with `--model` or `/model`.
- Codex and GLM: feed the role file as system context, then state the task.
- Do **not** edit the `model:` field in `.claude/agents/*.md` to a non-Claude value.

Full commands and the fallback order when Claude is unavailable: see `docs/agent-routing.md`.

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
