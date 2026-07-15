# Web Plan — HouseCheck landing + intake (first draft)

> **Status:** first draft, easily changed. Stack-agnostic on purpose.
> Describes *what* each section, field, and state is — never *which* framework.
> Reconciled to the current single-package scope (Remote Viewing Visit), not the
> stale 4-tier model still live in `web/landing.html`.
>
> **Do not treat as committed:** stack (backlog #10), pricing (unset), and the
> public payment link (blocked until lawyer review, decision D2) are all still open.

## Sources this is built from

- `docs/product/landing-page-outline.md` — copy + section base
- `docs/operations/request-lifecycle.md` — intake fields, status machine, QA gate (authoritative)
- `docs/product-principles.md` §7 (honest language), §11 (fairness / no dark patterns)
- `docs/legal/front-door-compliance-checklist.md` — public-surface compliance gate
- `docs/mvp-scope.md`, `docs/product/prd.md` — single package + non-goals

## Scope of the web surface (MVP)

One marketing/landing page + one intake form. No dashboard, no login, no payment
on the public page yet. Everything points at a single service: the **Remote
Viewing Visit** (Madrid only).

## Information architecture (top → bottom)

1. **Header / nav** — brand "HouseCheck"; anchors: How it works · What's included · FAQ · Start.
2. **Hero**
   - Eyebrow: `Madrid · Pilot`
   - H1: *Visit a Madrid rental remotely before sending a deposit.*
   - Sub: *A trusted local verifier visits the flat while you join by video call.
     You see the property live, ask questions, and receive a short post-visit
     summary with listing-match observations, risk indicators, confidence level,
     and unresolved concerns.*
   - Primary CTA: **View my Madrid rental remotely** → `#start`
   - Secondary CTA: How it works → `#how`
   - Micro-note under CTAs: *Not a guarantee. Not a real estate agency. Not legal advice.*
3. **Honesty / anti-urgency banner** (implements principle §11 / D6)
   - *No pressure, no urgency tricks. If a report can't reach you before your
     deposit deadline, we'll tell you instead of taking the fee.*
   - Hard rule: this section must never be replaced with a countdown, "limited
     spots," or "act now" copy.
4. **Problem** — *Moving to Madrid from another city or country is stressful. You
   may need to decide quickly, but you cannot always visit the flat yourself
   before sending money.*
5. **Solution** — *HouseCheck sends a trusted local verifier to attend the viewing
   on your behalf. You join by WhatsApp, Google Meet, or Zoom. The verifier walks
   through the apartment with permission and compares what you see with the listing.*
6. **How it works** (`#how`, 5 steps, verbatim from the outline)
   1. Send the listing and viewing details.
   2. HouseCheck confirms the request fits the Remote Viewing Visit scope.
   3. A trusted local verifier attends the viewing.
   4. You join by live video call and ask questions.
   5. You receive a short verification report after the visit.
7. **What's included** — the Remote Viewing Visit bullet list (Madrid only;
   verifier attends with permission; live call; listing comparison; live questions;
   short post-visit summary).
8. **Not included** (verbatim boundary list — keep as a visible list, not fine print)
   - rent negotiation · contract review · deposit handling · legal advice ·
     ownership verification · landlord background checks · guarantee that the
     property is safe · recommendation whether the client should rent.
9. **Trust message** — *HouseCheck does not guarantee that a rental is safe, legal,
   or scam-free. The verifier is only your eyes and ears. We provide observed facts,
   listing-match notes, risk indicators, confidence level, and unresolved concerns.*
10. **Intake CTA + form** (`#start`) — see next section.
11. **FAQ** — at minimum:
    - *Is this a guarantee the flat is safe?* → No. We collect evidence and note risk indicators; the decision stays yours.
    - *Why not just ask a friend to go?* (free-substitute answer, from the adversarial loop) → A trusted verifier follows a fixed checklist, joins you on a live call, stays neutral, and keeps to permission limits — a favour from a friend usually does none of these consistently.
    - *Can you stop a scam?* → No. We can surface risk indicators; we can't guarantee an outcome.
    - *Are you an official inspection or a real estate agency?* → No. Neither, and not a legal advisor.
    - *What if my deposit deadline is today?* → If we can't deliver in time, we'll say so up front rather than take the fee.
12. **Disclaimer + footer** — legal entity name, contact email, **registered address**
    (LGDCU/DSA requirement — placeholder until the entity exists), links to Privacy
    Policy and Data Retention (placeholders), repeat of the "not a guarantee / not an
    agency / not legal advice" line.

## Intake form spec (`#start`)

Fields — exactly the required set from `request-lifecycle.md` (no more, no less):

| Field | Required | Notes |
|---|---|---|
| Requester name | yes | |
| Requester email | yes | |
| Requester phone | yes | |
| Listing URL **or** screenshots | yes | one of the two |
| Claimed address | yes | drives the one-active-request rule below |
| Viewing date/time (if arranged) | no | |
| Video-call preference | yes | WhatsApp / Google Meet / Zoom |
| Landlord/agent contact (if available) | no | |
| Concerns or specific questions | no | free text |
| Attestation checkbox | yes | *"I confirm I have a genuine rental interest in this listing and the information provided is accurate to the best of my knowledge."* |

**Rules / states (described, not coded — stack-agnostic):**

- Submit is blocked until the attestation is checked.
- **One active request per claimed address.** A second submission for an address
  that already has an open request is refused with a neutral message (admin can
  approve an exception). No public reason that could out a landlord.
- **No sensitive data.** Do not collect ID documents in the MVP.
- On success: neutral confirmation that this is a manual pilot and **no payment
  has been taken**. Restate that the deliverable is a *report*, not a guarantee.
- Post-submit status (`submitted → screened → …`) is **not** shown on the public
  page in MVP; coordination happens by email/WhatsApp. (A status view is an app
  concern — see `app-plan.md`.)

## Compliance gate (maps `front-door-compliance-checklist.md` → where this page satisfies it)

| Checklist rule | Where satisfied here |
|---|---|
| No "guaranteed/safe/certified/verified-safe/scam-proof/legally verified" | Copy table below; enforced across all sections |
| Hero carries "evidence, not guarantee" framing | Hero micro-note + Trust message |
| No urgency cues / dark patterns | §11 honesty banner; FAQ deadline answer; hard rule in §3 |
| Legal entity + contact + registered address visible | Footer (placeholder until entity exists) |
| Attestation required, not optional | Intake form, required |
| Privacy + retention linked from intake | Footer + intake links (placeholder) |
| No sensitive data (no IDs) | Intake "no sensitive data" rule |
| Usable on mobile | Responsive layout is a build requirement (target users on phones) |
| Prices show IVA + "no refund after delivery" at checkout | **N/A now** — no public price/payment until lawyer sign-off (D2). Add before enabling payment. |

**Blocking:** the public payment link stays OFF until this checklist is
lawyer-approved against the *live* page and the review is logged in
`docs/decision-log.md`.

## Allowed / forbidden copy (reuse of principle §7 — apply to every future edit)

- **Use:** evidence collected · risk indicators · verification report · confidence
  level · unresolved concerns · listing-match observations · permission-first visit.
- **Never use:** guaranteed safe · scam-proof · legally verified · official
  inspection · certified property · approved landlord · guaranteed refund.

## Deliberately out of scope for this draft

- Framework / hosting / no-code-tool choice (backlog #10 stays open).
- Pricing numbers and any checkout/payment UI (D2 lawyer gate).
- Public "verified" badges or trust seals — explicitly forbidden (risk R008): a
  scammer could reuse them to look legitimate. Reports stay private to the client.
- High-fidelity visual design (see `wireframes.md` for low-fi structure only).
