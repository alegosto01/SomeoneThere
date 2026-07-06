#!/usr/bin/env bash
# HouseCheck adversarial loop: Problem Finder → Problem Solver → Decision Judge
#
# Runs the three roles headlessly in sequence, piping each output into the next,
# and saves all artifacts under agent-runs/<timestamp>/.
#
# Usage:
#   ./scripts/adversarial-loop.sh <runtime> [--apply] [--topic "<topic>"]
#
#   runtime:  claude | codex | glm   (which CLI drives the loop)
#   --apply:  solver may edit docs directly (default: read-only, propose only)
#   --topic:  optional focus, e.g. "GDPR and verifier safety" (default: full review)
#
# Examples:
#   ./scripts/adversarial-loop.sh claude
#   ./scripts/adversarial-loop.sh codex --topic "seasonality and unit economics"
#   ./scripts/adversarial-loop.sh glm --apply
#
# Runtime commands are invoked via the patterns in docs/agent-routing.md.
# Adjust the *_CMD functions below if your installed CLI uses different flags.

set -euo pipefail

# ---------- config ----------
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

RUNTIME="${1:-}"
shift || true
APPLY=0
TOPIC=""
while [ $# -gt 0 ]; do
  case "$1" in
    --apply) APPLY=1; shift;;
    --topic) TOPIC="$2"; shift 2;;
    *) echo "Unknown arg: $1" >&2; exit 2;;
  esac
done

if [ -z "$RUNTIME" ]; then
  echo "Usage: $0 <claude|codex|glm> [--apply] [--topic \"<topic>\"]" >&2
  exit 2
fi

# ---------- runtime commands ----------
# Each takes: <role_file> <task_instruction>
# Each must read the role file as system context and the task as the user message,
# then print the model's reply to stdout.
run_role() {
  local role_file="$1"
  local task="$2"
  case "$RUNTIME" in
    claude)
      # Claude Code CLI: --print runs headless and prints the reply.
      claude --print --append-system-prompt "$(cat "$role_file")" "$task"
      ;;
    codex)
      # Codex CLI (exec mode): role file as system, task as the prompt.
      codex exec "$(cat "$role_file")" "$task"
      ;;
    glm)
      # GLM CLI shape; replace with your actual command if different.
      glm run --system "$(cat "$role_file")" "$task"
      ;;
    *)
      echo "Unknown runtime: $RUNTIME (expected claude|codex|glm)" >&2
      exit 2
      ;;
  esac
}

# ---------- workspace ----------
STAMP="$(date +%Y%m%d-%H%M%S)"
RUN_DIR="agent-runs/$STAMP"
mkdir -p "$RUN_DIR"

FOCUS="${TOPIC:-the whole HouseCheck project (legal, technical, financial, operational, trust, safety, privacy, product, marketplace, fraud, UX, competition)}"
EDIT_MODE="read-only: PROPOSE doc updates as fenced diff blocks in your output; do NOT edit files"
if [ "$APPLY" -eq 1 ]; then
  EDIT_MODE="apply mode: you MAY edit docs/risk-register.md, docs/decision-log.md, docs/mvp-scope.md, docs/legal-assumptions.md, docs/legal-questions-for-lawyer.md directly"
fi

echo "▶ HouseCheck adversarial loop"
echo "  runtime: $RUNTIME"
echo "  mode:    $EDIT_MODE"
echo "  topic:   $FOCUS"
echo "  output:  $RUN_DIR/"
echo

# ---------- stage 1: problem finder ----------
FINDER_REPORT="$RUN_DIR/01-finder-report.md"
echo "▶ [1/3] Problem Finder (read-only)…"
run_role ".claude/agents/problem-finder.md" \
  "Perform a complete adversarial review of $FOCUS. Produce the full report format defined in your instructions. Do not edit files." \
  > "$FINDER_REPORT"
echo "   saved: $FINDER_REPORT"

# ---------- stage 2: problem solver ----------
SOLVER_RESPONSE="$RUN_DIR/02-solver-response.md"
echo "▶ [2/3] Problem Solver ($EDIT_MODE)…"
run_role ".claude/agents/problem-solver.md" \
  "Below is the latest Problem Finder Report delimited by ===FINDER===. Take its risks and produce MVP-safe mitigations using your defined format. Mode: $EDIT_MODE. Topic: $FOCUS.

===FINDER===
$(cat "$FINDER_REPORT")
===END FINDER===" \
  > "$SOLVER_RESPONSE"
echo "   saved: $SOLVER_RESPONSE"

# ---------- stage 3: decision judge ----------
JUDGE_REVIEW="$RUN_DIR/03-judge-review.md"
echo "▶ [3/3] Decision Judge (read-only)…"
run_role ".claude/agents/decision-judge.md" \
  "Review the Problem Finder Report and Problem Solver Response below (delimited). Decide which mitigations are accepted, which need stronger mitigation, which require legal review, and which features should be excluded from the MVP. Produce your defined format. Do not edit files.

===FINDER===
$(cat "$FINDER_REPORT")
===END FINDER===

===SOLVER===
$(cat "$SOLVER_RESPONSE")
===END SOLVER===" \
  > "$JUDGE_REVIEW"
echo "   saved: $JUDGE_REVIEW"

# ---------- index ----------
INDEX="$RUN_DIR/README.md"
{
  echo "# Adversarial loop run — $STAMP"
  echo
  echo "- runtime: \`$RUNTIME\`"
  echo "- mode: $EDIT_MODE"
  echo "- topic: $FOCUS"
  echo
  echo "## Artifacts"
  echo
  echo "1. [Problem Finder Report](01-finder-report.md) — read-only risk analysis"
  echo "2. [Problem Solver Response](02-solver-response.md) — mitigations (and proposed/applied doc updates)"
  echo "3. [Decision Judge Review](03-judge-review.md) — verdicts on each mitigation"
  echo
  echo "## Next step"
  echo
  echo "Read the judge review. Alessandro decides which mitigations to accept, then a"
  echo "Codex/Claude/GLM implementation task runs the smallest useful next step."
} > "$INDEX"

echo
echo "✓ Done. Review:"
echo "  $INDEX"
if [ "$APPLY" -eq 0 ]; then
  echo
  echo "Note: run was read-only. Re-run with --apply to let the solver update docs."
fi