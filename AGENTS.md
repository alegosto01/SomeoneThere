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

---

## MANDATORY: Graphify First Rule

**This is the highest-priority instruction for code-navigation tasks.**

Whenever the user asks a question about the codebase, architecture, modules, dependencies, or how something works — **YOU MUST run `graphify query "<the user's question>"` FIRST** before reading any source files, grepping, or using ripgrep.

**NO EXCEPTIONS except:**
1. The user explicitly says "do not use graphify"
2. The task is about fixing stale/incorrect graph output
3. `graphify-out/graph.json` does not exist

**Why:** Querying the graph costs ~40× fewer tokens than grepping raw files. If you skip graphify and start grepping, the user pays for every file you open. The graph gives you scoped, relevant files immediately.

**After graphify query:** Read only the files the graph points you to. Do not browse broadly.

**After code changes:** Run `graphify update .` to keep the graph current (AST-only, no API cost).

**Specific tools:**
- Broad questions: `graphify query "<question>"`
- Relationships between two things: `graphify path "<A>" "<B>"`
- Focused concept: `graphify explain "<concept>"`
- Only if graphify returns nothing useful: fall back to `rg` on the specific files it surfaced

## graphify (reference)

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use Graphify before doing anything else. If a dedicated `skill` tool is available, invoke it with `skill: "graphify"`; otherwise run the `graphify` CLI directly.

- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify.

## Ponytail coding rule

Use Ponytail-style minimalism for coding work: first ask whether the change needs to exist, then reuse existing repo code, stdlib, platform features, or installed dependencies before adding new code. Prefer deletion, boring fixes, and the fewest files possible. Do not simplify away trust-boundary validation, data-loss protection, security, accessibility, explicit user requirements, or the Graphify-first rule.

When the user says `ponytail`, `lazy mode`, `simplest solution`, `minimal solution`, `YAGNI`, `do less`, or similar, use `.agents/skills/ponytail/SKILL.md`.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
