# SomeoneThere Claude instructions

Use the project subagents in `.claude/agents/`.

## Choosing the model / runtime

The roles (Problem Finder, Problem Solver, Decision Judge, and the Codex prompts) are runtime-neutral: you can run them in Claude Code, Codex, or GLM per session — useful when Claude tokens run out.

- Claude Code: override the default `model: sonnet` per session with `claude --model <model>` or `/model <model>` inside the REPL.
- Codex / GLM: feed the role file in `.claude/agents/` or `prompts/codex/` as system context, then state the task.

See `docs/agent-routing.md` for exact commands and the fallback order.

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

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
