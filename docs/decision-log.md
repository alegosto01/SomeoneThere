# HouseCheck Decision Log

| Date | Decision | Reason | Risks | Revisit when |
|---|---|---|---|---|
| 2026-07-06 | Start Madrid-first | Clear local gap and easier operations than multi-city launch | Market may be smaller than expected | After 20 discovery calls or 10 paid pilots |
| 2026-07-06 | Do not handle deposits in MVP | Reduces legal, fraud, and financial risk | Less monetization/control | After legal review and strong demand |
| 2026-07-06 | Use permission-first inspections | Reduces privacy/legal/safety risk | Some properties cannot be inspected inside | After 30 verification requests |
| 2026-07-06 | Position as evidence/risk report, not guarantee | Reduces liability and avoids overpromising | May feel less strong to customers | After user testing landing page copy |
| 2026-07-06 | Keep reports private in MVP | Reduces abuse and public defamation risk | Less network effect | After legal review |
| 2026-07-06 | Make agent runtime per-session (Claude / Codex / GLM) | Lets work continue when one runtime is out of quota; roles are runtime-neutral prompt files | Output quality may vary between runtimes | If a role's behavior diverges meaningfully across runtimes |
| 2026-07-06 | Add automated adversarial loop script | Hands-off Finder to Solver to Judge chain; default read-only to preserve Alessandro's approval gate | Untested CLIs may need flag tweaks; --apply bypasses doc review | After first real run on each runtime |
| 2026-07-06 | Resume adversarial loop with Codex 5.5 medium defaults | User asked to continue the no-human-intervention GLM-style process; unresolved founder questions were answered with conservative MVP-safe defaults | Defaults may be too cautious or commercially weak | When Alessandro explicitly overrides any default |
| 2026-07-06 | Treat HouseCheck MVP as seasonal until proven otherwise | Madrid relocation demand is likely concentrated around Aug-Oct; year-round staffing would create cash risk | Off-season revenue is not solved | After 10 paid pilots or a validated off-season channel |
| 2026-07-06 | Gate in-person interior/viewing packages behind SOP and insurance | Verifier safety is catastrophic if mishandled; manual SOP and insurance come before revenue expansion | Delays Viewing/Premium revenue | When SOP is signed, insurance quote is accepted, and first dry run passes |
| 2026-07-06 | Charge before delivery and draft no-refund-after-delivery policy | Reduces chargeback and non-payment exposure for a delivered digital report | Lower conversion; needs Spanish lawyer confirmation | After lawyer review and 10 paid transactions |
| 2026-07-06 | Pseudonymize landlord/agent identity in customer reports | Reduces defamation and GDPR exposure while still describing observed facts | User receives less identifying detail | After lawyer review of report wording and landlord-data LIA |
| 2026-07-06 | Disclose evidence provenance limits in every report | Honest pilot evidence is phone-based and not independently proven untampered | Weakens marketing claims about evidence strength | After evidence-capture technical spike |
