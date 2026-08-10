# Full Claude Agent Loop

Use this prompt in Claude Code from the repo root:

```text
Use the problem-finder subagent to perform a complete adversarial review of SomeoneThere. Focus on legal, technical, financial, operational, trust, safety, privacy, product, and marketplace risks.

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
