# SomeoneThere Agent Routing

This document explains how to **choose the model / agent at the start of each work session**.

The SomeoneThere roles (Problem Finder, Problem Solver, Decision Judge, and the Codex implementation/review prompts) are written as plain-text instructions. They are **runtime-neutral**: the same prompt body runs in Claude Code, the Codex CLI, or a GLM session. You pick the runtime each time based on what you have available.

> Why this matters: if you are out of Claude tokens, you can keep working by routing the same roles to Codex or GLM. Nothing in the role definitions is Claude-specific except the YAML frontmatter in `.claude/agents/*.md`, which other runtimes simply ignore.

---

## 1. The roles and their source files

| Role | Source file (feed this to any runtime) | Edit access |
|---|---|---|
| Problem Finder | `.claude/agents/problem-finder.md` | read-only |
| Problem Solver | `.claude/agents/problem-solver.md` | may edit docs |
| Decision Judge | `.claude/agents/decision-judge.md` | read-only |
| Implementation | `prompts/codex/implementation-task.md` | may edit code |
| Refactor | `prompts/codex/refactor-task.md` | may edit code |
| Risk review | `prompts/codex/risk-review.md` | read-only |
| Docs update | `prompts/codex/docs-update-task.md` | may edit docs |

The `.claude/agents/*.md` files contain a YAML header (`name:`, `tools:`, `model:`). That header is only used by Claude Code's subagent system. Codex and GLM ignore it and just read the instruction body — this is expected and safe.

---

## 2. How to choose, per session

Ask yourself one question at the start of each session:

> **Which runtime do I have available right now?**

- Have Claude Code quota → use Claude Code (best fit for the adversarial loop, because the three subagents can be invoked natively).
- Out of Claude quota, have Codex → use the Codex CLI for every role.
- Out of Claude + Codex, have GLM → use GLM for every role.
- Mixed → run analysis roles (Finder/Solver/Judge) where reasoning is strongest, and implementation in Codex.

There is no persistent "selected model" setting to maintain. The choice happens by **which command you run**.

---

## 3. Run commands

The commands below are templates. Replace the path after the invocation with the role file you want to run, then append your task instruction.

### 3.1 Claude Code

Claude Code reads `.claude/agents/*.md` natively as subagents. The `model: sonnet` line in each file is only the **default**; you can override it per session.

```bash
# Override the model for the whole session (e.g. fall back to haiku when low on Sonnet quota)
claude --model haiku

# Or switch model mid-session inside the Claude Code REPL
/model haiku

# Then run a role by name as a subagent:
#   Use the problem-finder subagent to review the current repository.
```

To run the full loop, paste the contents of `prompts/claude/full-agent-loop.md`.

### 3.2 Codex CLI

Codex does not read the `.claude/agents/` folder, so feed it the role file directly. It will ignore the YAML header.

```bash
# Analysis role (read-only)
codex exec "$(cat .claude/agents/problem-finder.md)" \
  "Review the current SomeoneThere repository and produce the report defined above."

# Implementation (codex prompt)
codex exec "$(cat prompts/codex/implementation-task.md)" \
  "Implement <feature X>, smallest useful version."
```

> Adjust flags (`exec`, `--model`, etc.) to your installed Codex version. The pattern is: pass the role file as system context, then state the task.

### 3.3 GLM (or any other LLM runtime)

Same pattern as Codex: load the role file, then state the task. Use whatever invocation your GLM setup provides (CLI, IDE extension, or API shell).

```bash
# Example shape — replace `glm` with your actual command:
glm run --system "$(cat .claude/agents/problem-solver.md)" \
  "Take the latest Problem Finder Report and propose MVP-safe mitigations."
```

If your GLM runtime has no CLI, just open the role file in the IDE, paste its contents as the system/first message, and follow it with your task.

---

## 4. Automated loop (Finder → Solver → Judge in one run)

`scripts/adversarial-loop.sh` runs all three roles headlessly in sequence, piping each output into the next, and saves artifacts under `agent-runs/<timestamp>/`. Choose the runtime per invocation.

```bash
# Full review, read-only (default — solver proposes doc edits, doesn't apply)
./scripts/adversarial-loop.sh claude
./scripts/adversarial-loop.sh codex
./scripts/adversarial-loop.sh glm

# Focus on a specific topic
./scripts/adversarial-loop.sh claude --topic "GDPR and verifier safety"

# Let the solver edit docs directly (use after you trust the role's output)
./scripts/adversarial-loop.sh claude --apply
```

Each run produces:
- `agent-runs/<timestamp>/01-finder-report.md`
- `agent-runs/<timestamp>/02-solver-response.md`
- `agent-runs/<timestamp>/03-judge-review.md`
- `agent-runs/<timestamp>/README.md` (index)

The default is **read-only** so the adversarial analysis cannot change docs without your explicit `--apply`. This matches the AGENTS.md rule that Alessandro approves important changes. `agent-runs/` is gitignored — these are local working artifacts.

> If your installed CLI uses different flags than the script assumes (e.g. `codex` doesn't use `exec`, or `glm` isn't your binary name), edit the `run_role` function in the script. The role files and loop logic stay the same.

## 5. Recommended fallback order when Claude tokens run out

1. **Analysis roles (Finder → Solver → Judge):** try Claude Code first (native subagents). If unavailable, run them in GLM or Codex — the instruction bodies are identical and runtime-neutral.
2. **Implementation / refactor:** prefer Codex (it is the designated coding runtime in this project). Fall back to Claude Code or GLM if Codex is unavailable.
3. **Risk review:** any runtime works; this is a read-only reasoning task.

---

## 6. Notes and guardrails

- The runtime choice is **operational**, not strategic. It does not change SomeoneThere's product, legal, or safety positioning.
- Whichever runtime you use, the role's rules still apply: no legal certainty, no guarantees, Madrid-first, update `docs/risk-register.md` and `docs/decision-log.md` when relevant.
- Do **not** edit the `model:` field in `.claude/agents/*.md` to a non-Claude value (e.g. `codex`, `glm`). Claude Code cannot resolve those values; other runtimes ignore the field anyway, so it would only break Claude Code without helping anyone. To change Claude's model, use `--model` or `/model` as shown above.
- If a role's behavior differs noticeably between runtimes, record it in `docs/decision-log.md` so the team knows which runtime produced which output.