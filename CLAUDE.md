# HouseCheck Claude instructions

Use the project subagents in `.claude/agents/`.

## Main workflow

For major decisions, run the adversarial loop:

1. Use `problem-finder` to find risks.
2. Use `problem-solver` to propose mitigations and update docs.
3. Use `decision-judge` to decide whether mitigations are strong enough.
4. Ask Alessandro for approval before implementing risky or strategic changes.
5. Implement only the smallest useful next step.

## Project summary

HouseCheck is a Madrid-first rental verification service for people moving from abroad.

Users submit a rental listing before paying a deposit. HouseCheck collects evidence and risk indicators through:
- address checks
- listing/reality comparison
- exterior checks
- permission-first viewing attendance
- photos/videos where allowed
- landlord/agent authority questions
- structured verification report

HouseCheck must not present itself as:
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
