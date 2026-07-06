# Problem Solver Response

> Role: Problem Solver. Takes the Problem Finder Report and converts risks into MVP-safe mitigations. This run is **read-only**: doc updates are proposed as fenced diff blocks, not applied. No legal certainty is claimed.

## Summary

The Finder surfaced 10 risks (7 net-new) and 10 hidden assumptions. Six are plausibly company-killing. The good news: most can be mitigated for the MVP with **docs, language rules, and manual SOPs** rather than code. The two that genuinely require build-time attention are (a) verifier safety (needs a concrete SOP + insurance before any paid visit) and (b) evidence integrity (needs a one-day technical spike to pick a capture model). The strategic risks — seasonality and free substitutes — cannot be "solved" by mitigation; they must be answered by **positioning and channel choice**, which is Alessandro's decision.

The MVP-safe path is: ship only the **Basic listing review + Exterior check**, defer all in-person viewing packages until the safety SOP and insurance exist, charge **before** delivery, and write hedged language into every report template. Treat the pilot as learning, not as a business.

---

## Risk-by-risk mitigation plan

### Problem: Defamation / honor liability from naming a landlord (Finder Risk 1)
- Recommended decision: **MVP mitigates with language + pseudonymization; lawyer review before launch.**
- MVP mitigation:
  - Reports **never** call a person a "scammer," "fraud," or "criminal." Use only observed-fact language: "the person present could not produce a property registry match," "listing photos did not match the exterior," "deposit was requested before any viewing."
  - In MVP, pseudonymize the landlord/agent in the report (e.g. "Person A, claiming to be the landlord"). Store the real name internally for QA only, not in the deliverable.
  - Report is delivered **only to the paying user**; never published.
- Long-term mitigation: lawyer-approved report wording; libel insurance.
- Product change: rewrite `docs/operations/verification-report-template.md` Red flag section with hedged language rules.
- Operational change: QA reviewer checks every report for accusatory language before delivery.
- Technical change: none for MVP.
- Legal/compliance note: **blocking** — get lawyer sign-off on report language before first paid report.
- Estimated difficulty: Low (docs only).
- Should this block launch? **Yes** — language rules must exist before any report is delivered.
- GitHub issue title: "Define non-defamatory report language rules and rewrite report template"
- Acceptance criteria:
  - [ ] Report template uses only observed-fact language
  - [ ] Landlord/agent pseudonymized in deliverable
  - [ ] Legal review logged in decision-log

### Problem: Seasonality (Finder Risk 2)
- Recommended decision: **Alessandro decides explicitly; do not default into a year-round assumption.**
- MVP mitigation:
  - Model monthly demand explicitly (Aug–Oct peak; Dec–Feb near-zero).
  - Price and staffing assume seasonal, not flat, revenue.
  - Frame the MVP pilot window around the Aug–Oct 2026 intake — this is when willingness-to-pay is highest.
- Long-term mitigation: off-season products (e.g. annual subscription for relocation HR) only if demand appears.
- Product change: add a seasonality section to `docs/business-model.md`.
- Operational change: hire verifiers as seasonal, not retained.
- Technical change: none.
- Legal/compliance note: ties into employment classification (Risk 10).
- Estimated difficulty: Low (a decision + a doc).
- Should this block launch? **No** — but the *wrong default* (assuming year-round) is a strategic trap.
- GitHub issue title: "Model Madrid rental seasonality and decide seasonal vs year-round posture"
- Acceptance criteria:
  - [ ] Monthly demand estimate written
  - [ ] Operating posture (seasonal/year-round) recorded in decision-log

### Problem: Free substitutes — "ask a friend" (Finder Risk 3)
- Recommended decision: **Position against free on speed + neutrality + evidence quality; pick one wedge.**
- MVP mitigation:
  - Add a "Why not just ask a friend?" section to the landing page answering: (a) your friend isn't insured/neutral, (b) you get a structured report you can keep, (c) consistent turnaround.
  - Test the wedge in user interviews before assuming it works.
- Long-term mitigation: build the brand into the trust signal (report provenance, QA).
- Product change: update `docs/product/landing-page-outline.md` with a vs-free section.
- Operational change: none.
- Technical change: none.
- Legal/compliance note: none.
- Estimated difficulty: Low (copy + interviews).
- Should this block launch? **No** — but it blocks *pricing confidence*.
- GitHub issue title: "Define differentiation vs free substitutes and add to landing page"
- Acceptance criteria:
  - [ ] Landing page has a vs-free section
  - [ ] 5 interviewees asked to react to the wedge

### Problem: Chargeback / friendly-fraud exposure (Finder Risk 4)
- Recommended decision: **Charge before delivery; clear no-refund-after-delivery policy; log delivery.**
- MVP mitigation:
  - Users pay upfront (Stripe Payment Link in Phase 0). No "pay after."
  - Refund policy: full refund if HouseCheck fails to deliver a report; **no refund after the report is delivered** (the service has been rendered). Lawyer to confirm enforceability.
  - Log report delivery (email send + PDF download) as evidence of service rendered.
  - Cap dispute exposure by keeping the Basic package price low (€29–49).
- Long-term mitigation: Stripe dispute-evidence automation; reserve fund.
- Product change: write refund policy into a new `docs/legal/refund-policy-draft.md`.
- Operational change: deliver reports via a tracked channel (email with read receipt or signed link).
- Technical change: in Phase 1, log delivery events.
- Legal/compliance note: **blocking** — no card payments until refund policy exists.
- Estimated difficulty: Low (policy doc) / Medium (logging in Phase 1).
- Should this block launch? **Yes** — before accepting any card payment.
- GitHub issue title: "Draft refund/chargeback policy and decide pay-before-vs-after"
- Acceptance criteria:
  - [ ] Refund policy drafted
  - [ ] Pay-before decision recorded
  - [ ] Delivery logging specified for Phase 1

### Problem: Verifier safety protocol not specified (Finder Risk 5)
- Recommended decision: **MVP blocking. Write a concrete SOP + buy insurance before any in-person visit.**
- MVP mitigation:
  - Create `docs/operations/verifier-safety-sop.md` covering: check-in cadence (text admin on arrival + every 30 min + on leaving), buddy/pair for all interior viewings, abort-and-leave rule (verifier may abort no questions asked, full pay), daylight-only for exterior checks, no high-risk areas, emergency contact tree, location-share during the job.
  - **No interior/viewing packages are sold until the SOP exists and insurance is in place.** Only the Basic listing review (no visit) and Exterior-only check are sold first.
- Long-term mitigation: in-app panic button + live check-in (Phase 1+).
- Product change: remove Viewing/Premium packages from the landing page until SOP is signed off.
- Operational change: every verifier signs the SOP before first job.
- Technical change: none for MVP (SOP is manual).
- Legal/compliance note: **blocking + catastrophic** — get insurance quote before first visit.
- Estimated difficulty: Medium (SOP writing) / Cost (insurance).
- Should this block launch? **Yes** — blocks all in-person packages.
- GitHub issue title: "Write verifier safety SOP and obtain field-visit insurance quote"
- Acceptance criteria:
  - [ ] SOP drafted with check-in cadence, abort rule, daylight rule
  - [ ] Insurance quote obtained
  - [ ] Viewing packages gated behind SOP sign-off in decision-log

### Problem: Landlord personal-data lawful basis (Finder Risk 6)
- Recommended decision: **Split R006; lawful-basis assessment + pseudonymization in MVP.**
- MVP mitigation:
  - Pseudonymize landlord/agent in the delivered report (links to Risk 1 mitigation).
  - Internally, process landlord data under a documented legitimate-interest assessment (LIA) — drafted now, confirmed by lawyer.
  - Minimize: capture only what the report needs; do not build a landlord database.
- Long-term mitigation: full GDPR data-flow map; retention schedule.
- Product change: report template pseudonymization (overlaps with Risk 1).
- Operational change: retention rule for landlord data (e.g. delete 90 days after delivery).
- Technical change: none for MVP.
- Legal/compliance note: **blocking** — LIA before storing landlord identity.
- Estimated difficulty: Low (LIA doc) / Medium (retention enforcement later).
- Should this block launch? **Yes** — before storing landlord names.
- GitHub issue title: "Draft legitimate-interest assessment for landlord data and pseudonymize in report"
- Acceptance criteria:
  - [ ] LIA drafted
  - [ ] Report pseudonymizes landlord
  - [ ] Retention rule written

### Problem: Evidence integrity / tampering (Finder Risk 7)
- Recommended decision: **One-day technical spike; for pilot, accept phone photos with explicit disclosure.**
- MVP mitigation:
  - For the pilot: phone photos + visible metadata, and the report **explicitly states** the evidence's provenance and limits ("photos provided by the verifier; not independently verified as untampered"). Honesty over false confidence.
  - Spike: decide Phase 1 model — (a) server upload with EXIF strip + server timestamp, (b) live capture app, (c) media hashing log. Pick the smallest.
- Long-term mitigation: tamper-evident capture (Phase 1+).
- Product change: add provenance statement to report disclaimer.
- Operational change: QA spot-checks for obvious metadata inconsistency.
- Technical change: spike only in MVP.
- Legal/compliance note: none directly.
- Estimated difficulty: Low (disclosure) / Medium (spike).
- Should this block launch? **No** — but only if the report is honest about provenance.
- GitHub issue title: "Evidence provenance: add disclosure to report + run capture-model spike"
- Acceptance criteria:
  - [ ] Report disclaimer states provenance limits
  - [ ] Spike result documented in decision-log

### Problem: Time-to-value (Finder Risk 8)
- Recommended decision: **Two-tier SLA: fast basic review (<4h) + in-person (next day).**
- MVP mitigation:
  - Split the product into a **fast digital tier** (Basic listing review, target <4h, no visit) and a **slower field tier** (Exterior/Viewing, target next-day). This beats the deposit deadline for the basic question "is the address even real?"
  - Set per-package SLAs explicitly; don't promise "24h" as one number.
- Long-term mitigation: verifier scheduling tool.
- Product change: rewrite SLAs in `docs/mvp-scope.md`.
- Operational change: staff the fast tier aggressively during peak hours.
- Technical change: none for MVP.
- Legal/compliance note: none.
- Estimated difficulty: Low (SLA doc) / Medium (operational discipline).
- Should this block launch? **No**.
- GitHub issue title: "Set per-package SLAs and add fast basic-review tier"
- Acceptance criteria:
  - [ ] Per-package SLAs written
  - [ ] Fast tier target (<4h) realistic via one timed dry run

### Problem: No acquisition channel (Finder Risk 9)
- Recommended decision: **Pursue 2 organic channels; no paid ads in MVP.**
- MVP mitigation:
  - Channel A: Erasmus/international-office partnerships at Madrid universities (free, high-trust).
  - Channel B: targeted presence in Madrid expat/Erasmus Facebook + WhatsApp groups (free, but read each group's rules).
  - No paid ads — CAC would exceed LTV for a one-off purchase.
  - Landing page exists to *convert* referred traffic, not to *acquire* via Google.
- Long-term mitigation: SEO for "Madrid rental scam check" once content exists.
- Product change: add channel plan to `docs/business-model.md`.
- Operational change: Alessandro initiates 3 partner conversations.
- Technical change: none.
- Legal/compliance note: partnerships must not imply endorsement of safety (R003).
- Estimated difficulty: Medium (relationship work, not code).
- Should this block launch? **No** — but without it the pilot gets no users.
- GitHub issue title: "Define 2 organic acquisition channels and start partner conversations"
- Acceptance criteria:
  - [ ] Channel plan written
  - [ ] 3 partner conversations started

### Problem: Verifier employment classification (Finder Risk 10)
- Recommended decision: **MVP uses B2B subcontractors (autónomos with their own invoices); lawyer confirms.**
- MVP mitigation:
  - Treat verifiers as self-employed autónomos who invoice HouseCheck per job. Do not dictate hours, methods, or exclusivity.
  - Keep the relationship genuinely B2B (verifier chooses whether to accept a job, uses their own equipment, can work for others).
  - Lawyer confirms before the third verifier is paid.
- Long-term mitigation: re-evaluate if any verifier exceeds ~20% of their income from HouseCheck.
- Product change: none.
- Operational change: contract template + invoice workflow.
- Technical change: none.
- Legal/compliance note: **blocking** before scaling beyond founder's personal network.
- Estimated difficulty: Medium (legal).
- Should this block launch? **No** for pilots with personal contacts; **Yes** for hiring strangers.
- GitHub issue title: "Decide verifier contract model (autónomo B2B) and get labor-law review"
- Acceptance criteria:
  - [ ] Contract model decided in decision-log
  - [ ] Lawyer review before 3rd verifier

---

## Recommended changes to repo docs

These are **proposed** (read-only mode). Apply with Alessandro's approval.

### Proposed: `docs/risk-register.md` — add 7 rows

```diff
  | R010 | Low willingness to pay | Market | High | Medium | Run paid pilots before building marketplace. Test price points. | Open | Alessandro |
+ | R011 | Defamation suit from naming a landlord as a scammer in a report | Legal | Critical | Medium | Pseudonymize landlord in report; use observed-fact language only; QA review; lawyer sign-off before launch. | Open | Alessandro |
+ | R012 | Seasonality collapses revenue for 8+ months/year | Market / Financial | Critical | High | Model monthly demand; price for seasonal revenue; pilot in Aug-Oct 2026 intake. | Open | Alessandro |
+ | R013 | Free substitutes (ask a friend / Facebook group) | Market | High | High | Position on speed + neutrality + structured report; add vs-free section to landing page. | Open | Alessandro |
+ | R014 | Chargeback / friendly-fraud on low-margin digital report | Financial / Fraud | High | High | Charge before delivery; no-refund-after-delivery policy; log delivery; keep Basic price low. | Open | Alessandro |
+ | R015 | Verifier safety SOP missing (solo visits, no check-in) | Safety | Critical | Low | Write concrete SOP (check-ins, pairs, abort rule, daylight); obtain insurance; gate in-person packages behind SOP. | Open | Alessandro |
+ | R016 | Landlord personal data processed without lawful basis | Privacy / Legal | High | High | Pseudonymize in report; draft legitimate-interest assessment; retention rule; lawyer review. | Open | Alessandro |
+ | R017 | Evidence tampering undetected (fake geotags/photos) | Technical / Trust | High | Medium | Report states provenance limits honestly; one-day spike on capture model; hashing in Phase 1 if cheap. | Open | Alessandro |
+ | R018 | Time-to-value longer than the user's deposit deadline | Product / Operational | High | High | Two-tier SLA: fast basic review (<4h) + in-person (next day). | Open | Alessandro |
+ | R019 | No acquisition channel; CAC > LTV for one-off service | Market / Financial | High | High | 2 organic channels (university offices + expat groups); no paid ads in MVP. | Open | Alessandro |
+ | R020 | Verifier misclassified as autónomo (falso autónomo) | Legal / Operational | High | Medium | B2B subcontractor model; verifiers invoice per job; lawyer review before 3rd verifier. | Open | Alessandro |
```

### Proposed: `docs/mvp-scope.md` — gate in-person packages

```diff
  ### 3. Permission-first viewing attendance
-
- Only when access is legitimately arranged.
+ 
+ **BLOCKED until `docs/operations/verifier-safety-sop.md` exists and field-visit insurance is in place.**
+ Only when access is legitimately arranged.
```

### Proposed: `docs/decision-log.md` — add gating decisions

```diff
  | 2026-07-06 | Add automated adversarial loop script | Hands-off Finder to Solver to Judge chain; default read-only to preserve Alessandro's approval gate | Untested CLIs may need flag tweaks; --apply bypasses doc review | After first real run on each runtime |
+ | 2026-07-06 | Gate in-person packages behind safety SOP + insurance | Verifier safety is catastrophic if mishandled (R015) | Delays Viewing/Premium revenue | When SOP signed + insurance quote accepted |
+ | 2026-07-06 | Charge before delivery; no refund after delivery | Reduces chargeback exposure (R014) | Lower conversion; needs lawyer confirmation | After 10 paid transactions |
+ | 2026-07-06 | Pseudonymize landlord in report | Reduces defamation (R011) + GDPR (R016) exposure | Less specific evidence for user | After lawyer review of report language |
```

---

## MVP-safe path

**Build first (manual, Phase 0):**
1. Landing page + intake form + Stripe Payment Link (pay-before).
2. Basic listing review (digital, <4h SLA) — the fast tier.
3. Exterior-only address check (field, daylight, solo-OK per SOP).
4. Hedged-language report template + QA checklist.
5. Refund policy + landlord LIA + verifier SOP + insurance quote.

**Delay until safety/insurance exist:**
- Viewing attendance, Premium scam check (all in-person interior packages).

**Avoid in MVP:**
- Paid ads, public reports, landlord database, in-app chat, automated matching, deposit handling.

---

## Implementation tasks

1. **Must do before MVP:**
   - Write `docs/operations/verifier-safety-sop.md` (gate for in-person packages).
   - Draft `docs/legal/refund-policy-draft.md` and landlord LIA.
   - Rewrite report template with hedged language + pseudonymization.
   - Get lawyer review on report language, refund policy, employment model.

2. **Should do after first pilots:**
   - Run evidence-capture spike; decide Phase 1 model.
   - Time end-to-end dry runs; confirm SLAs.
   - Add seasonality model to business doc.
   - Start 3 university/expat-group partner conversations.

3. **Later:**
   - Tamper-evident evidence capture.
   - In-app check-in/panic for verifiers.
   - SEO content for organic acquisition.

4. **Do not build yet:**
   - Marketplace matching, verifier ratings, in-app chat, public reports, deposit handling.

---

**Problem Solver did not edit files (read-only mode). Proposed diffs above are for Alessandro's review.**