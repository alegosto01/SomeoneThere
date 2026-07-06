# Problem Finder Report

> Role: Problem Finder (read-only). This report finds problems; it does not fix them. It does not claim legal certainty.

## Executive summary

HouseCheck has a clear, well-scoped MVP and unusually disciplined docs. The existing risk register (R001–R010) covers the *obvious* threats (brokerage classification, permission-first access, overpromising, collusion, unit economics, GDPR). The danger is in what is **missing**: the register treats each risk as a single line, but several hide *compound* failure modes, and at least twelve material risks are not tracked at all. The most dangerous gaps are (a) **defamation liability from naming a landlord/agent as a scammer in a written report**, (b) **seasonality crushing 8–10 months of revenue**, (c) **the free-substitute problem** (ask a friend / Facebook group), (d) **chargeback exposure on a low-margin digital good**, and (e) **the verifier-safety model assumes solo field visits with no concrete protocol beyond "don't feel unsafe."**

This report ranks the top 10 critical risks (seven are net-new), lists hidden assumptions, and ends with the questions the Problem Solver must answer.

---

## Top 10 critical risks

### Risk: Defamation / "honor" liability from accusing a named landlord or agent of being a scammer
- Category: Legal
- Severity: Critical
- Probability: Medium
- Why it matters: Spanish law (right to honor, Art. 18 CE; Ley Orgánica 1/1982) protects individuals from inaccurate public imputations. A report calling a named person a "scammer" or "fraudster" when the evidence is ambiguous is a civil (and potentially criminal) exposure. HouseCheck collects landlord/agent names and contact details (`docs/operations/verification-report-template.md` → "Landlord/agent interaction") and produces a written "red flag" report distributed to a user.
- Evidence from current project files: `docs/legal/risk-notes.md` admits "Avoiding defamation when reporting scam suspicion" but it is a bullet, not a register row. The report template has a "Red flag checklist" with no hedging language guidance beyond the disclaimer. No risk-register entry exists for this.
- Open questions: Is the report shared only with the paying user, or ever published? Who is the publisher/speaker of the accusation — HouseCheck or the verifier? Is there a libel-insurance line item?
- Suggested owner: Alessandro + lawyer
- Suggested next action: Add a defamation-risk row to the register; mandate hedged language in the report template; get lawyer review before MVP.

### Risk: Seasonality — Madrid rental demand (and thus verification demand) is concentrated in Aug–Oct; near-zero for months
- Category: Market / Financial
- Severity: Critical
- Probability: High
- Why it matters: Madrid's student/Erasmus intake peaks late August–October. Verification demand follows listing activity. Eight to ten months of thin demand makes verifier retention, cash flow, and unit economics far harder than a flat-rate annual model suggests. The business may be unviable as a full-time operation for 4–5 people but viable as seasonal side-work — a very different company.
- Evidence from current project files: `docs/mvp-scope.md` lists success metrics ("10 paid pilots") with no seasonality caveat. `docs/business-model.md` "Key assumptions" omits seasonality. `docs/risk-register.md` R005 (unit economics) and R010 (willingness to pay) do not mention it. `docs/problems.md` is empty.
- Open questions: Can the model survive €0 revenue for 4 months? Is this a seasonal side-business or a year-round company? Do verifiers get paid enough to return next season?
- Suggested owner: Alessandro
- Suggested next action: Model monthly demand; decide seasonal-vs-year-round operating posture; write it into the business model doc.

### Risk: Free substitutes — "ask a friend in Madrid" / post the address in a Facebook group
- Category: Market
- Severity: High
- Probability: High
- Why it matters: The core job-to-be-done (is this address real?) can be done for free by anyone already in Madrid. Expat/Erasmus Facebook groups routinely crowdsource "can someone drive past Calle X?" The paid product must beat *free + fast + trustworthy*, which is a hard bar. HouseCheck's edge is professionalism and evidence quality, but that is not yet argued in the landing page.
- Evidence from current project files: `docs/product/landing-page-outline.md` never addresses "why not just ask a friend?" `docs/competitor-map.md` and `docs/market-research/competitor-matrix.md` exist but weren't reviewed here — need to confirm free/crowd alternatives are captured. `docs/business-model.md` assumes willingness to pay with no differentiation argument.
- Open questions: What is the concrete advantage over a free favor? Is it speed, evidence admissibility, neutrality, or coverage? Which one is the marketing wedge?
- Suggested owner: Alessandro
- Suggested next action: Write the "vs. free" differentiation explicitly in the landing page and business model.

### Risk: Chargeback / friendly-fraud exposure on a low-margin, hard-to-prove digital service
- Category: Financial / Fraud
- Severity: High
- Probability: High
- Why it matters: The product is a digital report delivered online. Under card-scheme rules the burden of proof for "service rendered" is weak; a user can receive the report, act on it, then dispute the charge as "service not as described." With gross margins that are presumably thin (R005), a single chargeback can wipe several jobs' profit. There is **no refund/chargeback policy** anywhere in the repo.
- Evidence from current project files: `docs/mvp-scope.md` mentions "< 20% refund/dispute rate" as a metric but no policy. `docs/legal-questions-for-lawyer.md` Q27 asks "What refund policy is required?" — unanswered. `docs/risk-register.md` has no chargeback row.
- Open questions: When is a refund owed (verifier no-show? access denied? user unhappy with conclusion?)? Do users pre-pay or pay on delivery? Is there evidence-of-delivery logging?
- Suggested owner: Alessandro + lawyer
- Suggested next action: Draft a refund/chargeback policy; decide pay-before vs pay-after; add a register row.

### Risk: Verifier safety protocol is asserted, not specified — solo field visits to strangers' properties
- Category: Safety
- Severity: Critical
- Probability: Low (but catastrophic when it happens)
- Why it matters: R009's mitigation is "safety protocol, no confrontation, location sharing, no high-risk visits, emergency process." None of that protocol actually exists in the repo. `docs/operations/verifier-checklist.md` says only "Do not accept if the task feels unsafe." A verifier attending a viewing alone, at an address controlled by a (possibly fraudulent) counterparty, with no check-in system, is a serious personal-safety exposure. One incident is a company-ending event.
- Evidence from current project files: `docs/operations/verifier-checklist.md` has no check-in cadence, no emergency contact, no buddy system, no "abort criteria," no time-of-day limits. The architecture doc has no "panic button" / check-in feature in scope. `docs/legal-questions-for-lawyer.md` Q22 ("safety obligations") is unanswered.
- Open questions: Do verifiers work in pairs for viewings? Is there a mandatory check-in app/SMS? Is there an abort-and-leave rule? Is there insurance?
- Suggested owner: Alessandro
- Suggested next action: Write a real, concrete verifier-safety SOP before the first paid visit; add a register row for "incomplete safety SOP."

### Risk: Landlord/agent personal data in the report is GDPR processing that is not consented or lawful-basis-justified
- Category: Privacy / Legal
- Severity: High
- Probability: High
- Why it matters: The report template captures "Person met/spoken with," "Role claimed," names, and contact details. That is personal data of a third party (the landlord/agent) who has **not** agreed to be processed by HouseCheck and may not even know the service exists. R006 only covers photos/videos, not the text/identity data. The lawful basis is unclear (legitimate interest? consent of whom?).
- Evidence from current project files: `docs/operations/verification-report-template.md` → "Landlord / agent interaction." `docs/legal-questions-for-lawyer.md` Q19 ("Can reports include landlord/agent names or contact details?") — unanswered. `docs/risk-register.md` R006 mitigation scope = "photos, videos, or documents."
- Open questions: What is the lawful basis for processing the landlord's identity? Must the landlord be informed? Should reports pseudonymize the landlord?
- Suggested owner: Alessandro + lawyer
- Suggested next action: Split R006 into "media" and "identity/contact data"; get legal basis documented.

### Risk: Evidence integrity / tampering — geotags and timestamps can be faked; the product's core value is unverified
- Category: Technical / Trust
- Severity: High
- Probability: Medium
- Why it matters: HouseCheck sells "evidence." But the evidence chain is a verifier's phone photos with metadata that is trivially spoofable. R004 lists "geotagged evidence" as a collusion mitigation, but a colluding verifier can fake geotags. If the product's central artifact is not demonstrably authentic, the whole value proposition is hollow and a scammer-colluding verifier is undetectable.
- Evidence from current project files: `docs/tech/architecture.md` has an `evidence_urls` field but no hashing, no server-side capture, no chain-of-custody. `docs/operations/verifier-checklist.md` says "Enable timestamp/location metadata" — phone-side only, not tamper-evident.
- Open questions: Is there server-side ingestion that re-stamps media? Are media hashes logged? Is there live capture (stream → server) vs upload-anytime?
- Suggested owner: Alessandro + technical
- Suggested next action: Decide the MVP evidence-capture model (upload vs live capture) and whether hashing/audit-log is in Phase 1 scope.

### Risk: Time-to-value — by the time a manual verification completes, the listing (or the user's money) is already gone
- Category: Product / Operational
- Severity: High
- Probability: High
- Why it matters: Scams work by *urgency* ("three other people want it, pay the deposit today"). HouseCheck's manual MVP (assign verifier, schedule visit, travel, write report, QA) is a multi-hour-to-multi-day cycle. The user under pressure will pay the deposit before the report lands. If the product can't return a basic check in hours, it loses to the scammer's urgency tactic. The "< 24h" target in `mvp-scope.md` may be too slow for the actual decision window.
- Evidence from current project files: `docs/mvp-scope.md` → "average report delivery time under 24 hours." `docs/operations/verifier-checklist.md` shows a multi-step manual workflow with no SLA tiers. The basic listing-only review (no travel) could be fast, but the in-person packages cannot.
- Open questions: What is the realistic end-to-end time per package? Is there a "fast basic review in 2h, in-person later" two-tier model?
- Suggested owner: Alessandro
- Suggested next action: Time-stamp a manual dry run end-to-end; set per-package SLAs.

### Risk: No acquisition channel — the landing page is not a channel, and CAC for a one-off low-LTV service is brutal
- Category: Market / Financial
- Severity: High
- Probability: High
- Why it matters: Verification is a one-off (low repeat usage — you move once). LTV ≈ one purchase. Any paid acquisition (ads) with CAC above the per-job margin destroys the model. There is no channel strategy in the repo beyond "build a landing page." Universities, Erasmus offices, relocation HR, and consulate/Facebook groups are the realistic free/cheap channels and none are in the plan.
- Evidence from current project files: `backlog/phase-1-issues.md` issue #4 is "Create landing page copy" — that is a page, not a channel. `docs/business-model.md` has no CAC or channel section. R005's mitigation mentions "Track CAC" but not how to *acquire*.
- Open questions: Which channel brings users at near-zero CAC? University partnerships? Are partners even approvable given HouseCheck makes no guarantees?
- Suggested owner: Alessandro
- Suggested next action: Identify 2–3 concrete acquisition channels and a partner-conversation plan.

### Risk: Verifier employment classification (autónomo vs. empleado) under Spanish law
- Category: Legal / Operational
- Severity: High
- Probability: Medium
- Why it matters: Spain is strict on "falso autónomo" (misclassified self-employed workers). If verifiers are effectively economically dependent on HouseCheck, work its hours, and use its tools, they may be deemed employees, triggering back-taxes, fines, and labor obligations. This affects the entire operating model and per-job cost.
- Evidence from current project files: `docs/legal-questions-for-lawyer.md` Q20–Q24 cover this and are unanswered. `docs/risk-register.md` has no row for employment classification. `docs/operations/verifier-checklist.md` treats verifiers as task-acceptors (gig-like), which raises the misclassification flag.
- Open questions: Are verifiers B2B subcontractors, true freelancers, or employees? Does HouseCheck dictate hours and methods?
- Suggested owner: Alessandro + lawyer + labor counsel
- Suggested next action: Add a register row; get labor-law review before paying a third verifier.

---

## Hidden assumptions

1. **Awareness assumption:** Users know they might be scammed *before* paying. Many don't; they pay first, then search. HouseCheck's funnel assumes a pre-deposit user.
2. **Trust cold-start:** A brand-new service with no reviews asks a wary user (already afraid of scams) to pay *it* money. The trust hurdle is higher than acknowledged.
3. **Verifier trustworthiness:** "Recruit 3–5 trusted verifiers" (backlog #7) assumes trust exists before any trust *system*. MVP has no ratings, no history, no insurance.
4. **Manual scales to 24h:** The SLA assumes one verifier can turn a job around same-day. Travel time, no-shows, and QA likely push this past 24h for in-person packages.
5. **Landlord cooperation:** The model assumes a landlord will tolerate a third-party "checker" showing up or joining a viewing. Landlords have *negative* incentive (time cost + scrutiny) and may simply refuse, making the Premium package undeliverable.
6. **"Evidence" is enough:** Users may want a *decision* ("should I pay?"), not evidence. The product's discipline against giving guarantees may conflict with what users actually buy.
7. **One report = enough:** A scammer reuses the same address/listing for the next victim. HouseCheck doesn't (and shouldn't, in MVP) publish — so it cannot warn the next victim. The scam continues per-report.
8. **Free is not a competitor:** See Risk 3. The implicit assumption is that paid beats free; this is unproven.
9. **Listing persists:** By verification time the Idealista/Facebook post may be deleted; the source-of-truth is screenshots the user took, which may be incomplete.
10. **Madrid = homogeneous:** Madrid has neighborhoods where sending a verifier with a camera is itself a safety/nuisance issue. "Madrid-first" is treated as one market; operationally it is many.

## Risks that could kill the company

- **Defamation suit from a named landlord** (Risk 1) — one lawsuit exceeds MVP runway.
- **Verifier injury/death on a solo visit** (Risk 5) — criminal + civil + reputational end.
- **Brokerage reclassification** (R001, existing) — regulatory shutdown.
- **Unit economics vs. seasonality + free substitutes** (Risks 2, 3) — structural unprofitability, not a fixable bug.
- **Chargeback spiral** (Risk 4) — if >5–10% of transactions dispute, Stripe reserves/holds follow, freezing cash flow.

## Risks that are acceptable for MVP (with current mitigation)

- R002 (verifier enters without permission) — permission-first policy + exterior fallback is sufficient for MVP; revisit at 30 requests.
- R007 (landlord refuses access/photos) — exterior-only fallback is a genuine product, not just a failure mode.
- R008 (scammer uses HouseCheck for legitimacy) — private reports + no public badges is a strong mitigation; acceptable.

## Risks that require legal review

- Defamation/honor from naming landlords (Risk 1) — **blocking** before any report names a person.
- Landlord personal-data lawful basis (Risk 6) — **blocking** before storing landlord identity.
- Brokerage boundary (R001) — already flagged; remains blocking.
- Employment classification (Risk 10) — **blocking** before scaling beyond the founder's personal network of verifiers.
- Refund/chargeback policy (Risk 4) — needed before accepting card payments.
- Insurance: professional civil liability + verifier field insurance — needed before first paid visit.

## Risks that require a technical spike

- Evidence integrity (Risk 7): a short spike to decide upload-vs-live-capture and whether content hashing is Phase-1 or Phase-2. Do not build blockchain-style provenance; decide the *minimum* that makes a photo more trustworthy than a free friend's photo.
- SLA feasibility (Risk 8): run one timed manual dry run per package *before* promising any SLA to users.

## Questions the Problem Solver must answer

1. How do we state scam suspicion in a report *without* defaming a named individual? (language rules + pseudonymization?)
2. Is HouseCheck a year-round company or a seasonal service? What does each imply for staffing and pricing?
3. What is our one-sentence answer to "why not just ask a friend in Madrid?"
4. What is the exact refund rule, and do we charge before or after delivery?
5. What is the minimum verifier-safety SOP we will not launch without (check-ins, pairs, abort rules, insurance)?
6. What is the lawful basis for processing landlord/agent identity data in the report?
7. Is evidence hashing/live-capture in Phase 1, or do we accept "phone photo" integrity for the pilot and say so explicitly in the report?
8. What per-package SLA is realistic, and is there a "fast basic review" tier that beats the deposit deadline?
9. Which 1–2 acquisition channels do we pursue at near-zero CAC?
10. Are verifiers employees, freelancers, or B2B subcontractors — and what does each cost per job?

---

**Problem Finder did not edit any files.**