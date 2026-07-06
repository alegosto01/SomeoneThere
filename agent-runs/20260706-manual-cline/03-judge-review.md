# Decision Judge Review

> Role: Decision Judge (read-only). Reviews the Finder and Solver outputs and decides whether each mitigation is strong enough. Skeptical but fair. No legal certainty claimed.

## Summary

The Finder found 10 risks; the Solver proposed a concrete mitigation for each. My verdict: **6 mitigations are Accepted** as MVP-safe, **3 are Needs stronger mitigation**, **1 Needs legal review before it can be trusted**, and **1 Needs a technical spike before it can be classified**. The Solver's overall MVP-safe path (defer all in-person packages behind a safety SOP + insurance, ship the digital Basic tier first) is **correct and should be adopted**.

The single most important call: the Solver's evidence-integrity mitigation ("phone photos + honest disclosure for the pilot") is **Accepted only because** the disclosure is mandatory. If the disclosure is dropped, the product's core value claim collapses and this becomes *Needs stronger mitigation*.

---

## Decisions

### Decision: Defamation / honor liability from naming a landlord (Finder 1 / Solver 1)
- Verdict: **Accepted** (with one strengthening condition)
- Reason: Pseudonymization + observed-fact-only language + QA + lawyer sign-off is the right MVP mitigation. The condition: the Solver's language rule ("never call a person a scammer") must be written **into the report template itself**, not just described in a separate doc — verifiers fill the template, so the constraint must live where they work.
- Required follow-up: lawyer signs off on the template wording before first paid report.
- Blocker before MVP? **Yes** — no report is delivered until the language rule is in-template and lawyer-approved.
- Recommended GitHub issue: "Define non-defamatory report language rules and rewrite report template"
- Required doc update: `docs/operations/verification-report-template.md`, `docs/risk-register.md` (R011).

### Decision: Seasonality (Finder 2 / Solver 2)
- Verdict: **Needs stronger mitigation**
- Reason: "Decide explicitly" is necessary but not sufficient. Seasonality is a *company-killing* risk (the Finder lists it as such) and the Solver's answer is "model it and decide." That's a process, not a mitigation. The mitigation is missing: **what does HouseCheck do during the 8 off-season months?** The Solver must return with either (a) a confirmed seasonal posture with an explicit "we do not operate Feb–Jun" or (b) a second off-season revenue line. Without one of these, the risk is unmitigated.
- Required follow-up: Alessandro picks (a) or (b); Solver writes the financial implication into the business model.
- Blocker before MVP? **No** for the pilot (pilot should run *in* peak season anyway, Aug–Oct). **Yes** for any "year-round company" assumption.
- Recommended GitHub issue: "Decide seasonal vs year-round posture and model off-season cash"
- Required doc update: `docs/business-model.md`, `docs/decision-log.md`.

### Decision: Free substitutes (Finder 3 / Solver 3)
- Verdict: **Accepted** (as a *hypothesis to test*, not as a fact)
- Reason: "Position on speed + neutrality + structured report" is a reasonable MVP wedge and the Solver correctly sends it to user-interview validation rather than asserting it. The honesty is appropriate. The risk is that *none* of those wedges survives interviewing — in which case this becomes *Should not be included in MVP* at the product level. But that's a validation question, not a mitigation defect.
- Required follow-up: 5 interviews must include "why not just ask a friend?" as a direct question.
- Blocker before MVP? **No**.
- Recommended GitHub issue: "Define differentiation vs free substitutes and add to landing page"
- Required doc update: `docs/product/landing-page-outline.md`.

### Decision: Chargeback / friendly-fraud (Finder 4 / Solver 4)
- Verdict: **Accepted**
- Reason: Pay-before + no-refund-after-delivery + delivery logging is the correct, standard mitigation for a digital-goods chargeback risk. Keeping the Basic price low caps exposure. The only open item is lawyer confirmation of the no-refund clause's enforceability in Spain, which the Solver correctly flags.
- Required follow-up: lawyer confirms refund clause; Stripe dispute evidence is stored per transaction.
- Blocker before MVP? **Yes** — no card payments until refund policy is drafted and pay-before is wired.
- Recommended GitHub issue: "Draft refund/chargeback policy and decide pay-before-vs-after"
- Required doc update: new `docs/legal/refund-policy-draft.md`, `docs/risk-register.md` (R014).

### Decision: Verifier safety SOP missing (Finder 5 / Solver 5)
- Verdict: **Accepted** — this is the Solver's strongest and most important mitigation.
- Reason: Gating *all* in-person packages behind (a) a concrete SOP and (b) insurance is exactly right. The check-in cadence, abort-and-leave rule, daylight rule, and buddy-for-interior are the correct contents. The decision to sell only Basic + Exterior first is the single most defensible call in the whole Solver response. One strengthening note: the SOP must also state **what insurance** (civil liability + accident) and **who pays for it** — unanswered.
- Required follow-up: SOP drafted with the insurance specifics; insurance quote in hand; gating recorded in decision-log.
- Blocker before MVP? **Yes** — hard gate on all interior/viewing packages.
- Recommended GitHub issue: "Write verifier safety SOP and obtain field-visit insurance quote"
- Required doc update: new `docs/operations/verifier-safety-sop.md`, `docs/mvp-scope.md` (gate section 3), `docs/decision-log.md`.

### Decision: Landlord personal-data lawful basis (Finder 6 / Solver 6)
- Verdict: **Needs legal review**
- Reason: Pseudonymization + minimization + retention is good operational hygiene, but the **lawful basis itself** is a legal question the Solver cannot resolve. "Legitimate interest" for processing a non-consenting third party's identity is non-trivial under GDPR Art. 6(1)(f); a lawyer must confirm the LIA is actually valid. The Solver's draft LIA is a useful input to that review, not a substitute for it.
- Required follow-up: lawyer reviews and approves (or rejects) the LIA before any landlord name is stored.
- Blocker before MVP? **Yes** — before storing landlord identity.
- Recommended GitHub issue: "Draft legitimate-interest assessment for landlord data and pseudonymize in report"
- Required doc update: new `docs/legal/landlord-data-lia-draft.md`, `docs/risk-register.md` (split R006 / add R016).

### Decision: Evidence integrity (Finder 7 / Solver 7)
- Verdict: **Needs a technical spike**
- Reason: The "honest disclosure for the pilot" half is **Accepted** — it's the only honest thing to do. But the *mitigation* (what stops a colluding verifier from faking evidence?) is deferred to a spike that hasn't happened. I cannot classify this as Accepted until the spike decides whether server-side timestamping or hashing is cheap enough for Phase 1. If the spike finds neither is cheap, the product must live with "unverified photos" as a permanent caveat, which materially weakens R004 (collusion) too.
- Required follow-up: one-day spike; result written to decision-log before the product claims "evidence."
- Blocker before MVP? **No** — *if* the disclosure is in every report. **Yes** for any marketing claim stronger than the disclosure supports.
- Recommended GitHub issue: "Evidence provenance: add disclosure to report + run capture-model spike"
- Required doc update: `docs/operations/verification-report-template.md` (disclosure), `docs/decision-log.md` (spike result).

### Decision: Time-to-value (Finder 8 / Solver 8)
- Verdict: **Accepted**
- Reason: Two-tier SLA (fast digital <4h + field next-day) directly answers the deposit-deadline problem and is operationally realistic for Phase 0. The Solver correctly requires a timed dry run before the SLA is promised to users.
- Required follow-up: one timed dry run per package; SLA written only if the dry run supports it.
- Blocker before MVP? **No**.
- Recommended GitHub issue: "Set per-package SLAs and add fast basic-review tier"
- Required doc update: `docs/mvp-scope.md` (SLA section).

### Decision: No acquisition channel (Finder 9 / Solver 9)
- Verdict: **Accepted**
- Reason: Two organic channels (university international offices + expat/Erasmus groups) and an explicit "no paid ads in MVP" rule is the correct posture for a one-off, low-LTV service. The Solver's caveat that partnerships must not imply a safety endorsement (R003) is sharp and correct.
- Required follow-up: 3 partner conversations started; partnership terms do not promise safety.
- Blocker before MVP? **No** — but no pilot users will appear without it.
- Recommended GitHub issue: "Define 2 organic acquisition channels and start partner conversations"
- Required doc update: `docs/business-model.md`.

### Decision: Verifier employment classification (Finder 10 / Solver 10)
- Verdict: **Accepted** (as the MVP posture; lawyer-confirmed)
- Reason: B2B autónomo-with-invoice is the standard, lowest-risk Spanish model for gig-style work and the Solver's safeguards (no dictated hours/methods, no exclusivity, re-evaluate at ~20% dependency) are the right tripwires. This must be lawyer-confirmed before a non-personal-contact verifier is paid, which the Solver states.
- Required follow-up: lawyer confirms; contract template exists; dependency monitored.
- Blocker before MVP? **No** for personal-contact pilots; **Yes** for any stranger verifier.
- Recommended GitHub issue: "Decide verifier contract model (autónomo B2B) and get labor-law review"
- Required doc update: `docs/decision-log.md`, `docs/risk-register.md` (R020).

---

## MVP-safe path

**Adopted from the Solver, with the gating enforced:**

Ship first (Phase 0, manual):
- Basic listing review (digital, target <4h, pay-before, hedged language, no visit).
- Exterior-only address check (daylight, solo-OK per SOP, evidence with honest disclosure).

Hard-gated behind SOP + insurance + lawyer sign-off:
- Viewing attendance, Premium scam check.

Avoid in MVP:
- Paid ads, public reports, landlord DB, in-app chat, automated matching, deposit handling, any "guarantee" language.

The single most important MVP decision: **the in-person packages do not launch until the safety SOP exists, insurance is quoted, and the gating is recorded in the decision log.** This is non-negotiable.

## Features to avoid for now

- Any in-person interior package (until SOP + insurance).
- Any marketing claim of "verified," "safe," or "guaranteed."
- Pay-after-delivery pricing.
- Public/shared reports.
- A landlord database.
- Paid acquisition.
- Automated verifier matching.

## Legal-review checklist

1. **Report language** — does the hedged, observed-fact wording avoid defamation under Spanish law? (Blocks first paid report.)
2. **Landlord data LIA** — is legitimate interest a valid basis for processing a non-consenting landlord's identity? (Blocks storing landlord names.)
3. **Refund clause** — is "no refund after delivery" enforceable in Spain? (Blocks card payments.)
4. **Employment model** — is B2B autónomo defensible given how HouseCheck assigns work? (Blocks non-personal verifiers.)
5. **Brokerage boundary** — already on R001; remains open.
6. **Insurance scope** — what coverage is required for field verifiers?

## Technical-spike checklist

1. **Evidence capture model** — one day: server-upload+timestamp vs live-capture vs hash-log; pick the smallest that improves on "trivially fakeable." Output to decision-log.
2. **End-to-end dry run** — time each package once manually before promising any SLA.

## Questions for Alessandro

1. **Seasonality (urgent):** do you operate HouseCheck as a seasonal service (Aug–Oct peak only) or do you have an off-season revenue plan? The Solver's answer is incomplete without your decision.
2. **Safety gate (urgent):** are you willing to hard-gate all in-person packages behind the SOP + insurance, even if it means launching with only the digital Basic + Exterior tier?
3. **Evidence honesty (blocking on marketing):** are you willing to have every report explicitly say the photos are not independently verified as untampered? If not, the evidence spike becomes MVP-blocking.
4. **Free-substitute wedge:** which of {speed, neutrality, structured report} do you believe is the real wedge? Interviews will test it, but your prior sets the landing-page copy.
5. **Channel capacity:** do you have the time/relationships to run the 3 university/expat-group partner conversations yourself in the next 4 weeks? If not, the pilot has no acquisition path.

---

**Decision Judge did not edit files.** Next step: Alessandro reviews this verdict, decides the 5 questions above, and only then does a Solver/implementation step apply the proposed doc updates.