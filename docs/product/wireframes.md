# Wireframes — low fidelity (first draft)

> **Status:** first draft, easily changed. Text/ASCII only — structure and content,
> not visual design. Stack-agnostic. Pairs with `web-plan.md` and `app-plan.md`.
> Boxes show layout intent, not final spacing, type, or colour.

## Conventions

`[ Button ]` action · `(•)` selected · `( )` unselected · `[x]`/`[ ]` checkbox
`____` input field · `▸` collapsed · `▾` expanded

---

## WEB

### W1 — Hero

```
┌──────────────────────────────────────────────────────────┐
│ HouseCheck        How it works · Included · FAQ · [Start] │
├──────────────────────────────────────────────────────────┤
│  MADRID · PILOT                                            │
│                                                            │
│  Visit a Madrid rental remotely                           │
│  before sending a deposit.                                │
│                                                            │
│  A trusted local verifier visits the flat while you join  │
│  by video call. You see it live, ask questions, and get   │
│  a short post-visit summary: listing-match, risk          │
│  indicators, confidence level, unresolved concerns.       │
│                                                            │
│  [ View my Madrid rental remotely ]   How it works ▸      │
│                                                            │
│  Not a guarantee · Not a real estate agency · Not legal   │
└──────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────┐
│ ⓘ No pressure, no urgency tricks. If a report can't reach │
│   you before your deposit deadline, we'll say so instead  │
│   of taking the fee.                                      │
└──────────────────────────────────────────────────────────┘
```

### W2 — How it works (5 steps)

```
How it works
 ①──────②──────③──────④──────⑤
 [1] Send the listing and viewing details.
 [2] HouseCheck confirms it fits the Remote Viewing Visit scope.
 [3] A trusted local verifier attends the viewing.
 [4] You join by live video call and ask questions.
 [5] You receive a short verification report after the visit.
```

### W3 — Included / Not included (side by side)

```
┌── What's included ──────────┐  ┌── Not included ─────────────┐
│ • Madrid only               │  │ • rent negotiation          │
│ • verifier attends w/ perm. │  │ • contract review           │
│ • live video call           │  │ • deposit handling          │
│ • listing comparison        │  │ • legal advice              │
│ • ask questions live        │  │ • ownership verification    │
│ • short post-visit summary  │  │ • landlord background checks│
│                             │  │ • guarantee it's safe       │
│                             │  │ • whether you should rent   │
└─────────────────────────────┘  └─────────────────────────────┘
```

### W4 — Intake form (`#start`)

```
┌── Start a Remote Viewing Visit ──────────────────────────┐
│ Name *            ____________________                   │
│ Email *           ____________________                   │
│ Phone *           ____________________                   │
│ Listing URL       ____________________                   │
│   or screenshots  [ Upload ]         (one of the two *)  │
│ Claimed address * ____________________                   │
│ Viewing date/time ____________________  (if arranged)    │
│ Video call *      (•) WhatsApp ( ) Meet ( ) Zoom         │
│ Landlord/agent    ____________________  (if available)   │
│ Concerns          [ textarea ]                           │
│                                                          │
│ [ ] I confirm I have a genuine rental interest in this   │
│     listing and the information provided is accurate to  │
│     the best of my knowledge. *                          │
│                                                          │
│ [ Submit request ]   (disabled until box is checked)     │
│ Manual pilot — no payment is taken.                      │
└──────────────────────────────────────────────────────────┘
```

### W5 — FAQ

```
FAQ
▾ Is this a guarantee the flat is safe?
    No. We collect evidence and note risk indicators; the decision stays yours.
▸ Why not just ask a friend to go?
▸ Can you stop a scam?
▸ Are you an official inspection or a real estate agency?
▸ What if my deposit deadline is today?
```

Footer: legal entity · contact email · registered address (placeholder) ·
Privacy · Data retention · "Not a guarantee. Not a real estate agency. Not legal advice."

---

## APP (one app, role-gated — see `app-plan.md`)

### A1 — Client: request status tracker

```
┌── Your request ─────────────────────────────┐
│ Calle Example 12, Madrid                     │
│                                              │
│ ✓ Submitted                                  │
│ ✓ Screened                                   │
│ ✓ Accepted                                   │
│ ● Verifier assigned        ← you are here    │
│ ○ Viewing scheduled                          │
│ ○ Visit in progress                          │
│ ○ Summary in review                          │
│ ○ Report delivered                           │
│                                              │
│ [ Join the video call ]  (active at visit)   │
│ [ View report ]          (active when ready) │
└──────────────────────────────────────────────┘
```

### A2 — Verifier: permission gate (hard block)

```
┌── Before you start ─────────────────────────┐
│ Permission is required. Nothing below        │
│ unlocks until both are confirmed.            │
│                                              │
│ [ ] Permission to ENTER granted              │
│ [ ] Permission to FILM / show interior       │
│                                              │
│ Rules:                                       │
│  • Don't secretly record                     │
│  • Don't film people unnecessarily           │
│  • Don't film documents, IDs, bank details,  │
│    mail, or personal photos                  │
│  • Stop filming if anyone asks               │
│                                              │
│ [ Start walkthrough ]  (disabled until both) │
│ [ Abort visit ]        (always available)    │
└──────────────────────────────────────────────┘
```

### A3 — Verifier: live listing-match checklist

```
┌── Listing match ────────────────────────────┐
│ Item                 Y  N  Part  Unclear     │
│ Entrance/common      (•)( )( )  ( )          │
│ Bedroom count        ( )(•)( )  ( )          │
│ Kitchen              (•)( )( )  ( )          │
│ Bathroom             ( )( )(•)  ( )          │
│ Living area          (•)( )( )  ( )          │
│ Windows / light      ( )( )( )  (•)          │
│ Furniture/appliances (•)( )( )  ( )          │
│ Cleanliness          (•)( )( )  ( )          │
│ Noise / street       (•)( )( )  ( )          │
│ Amenities            ( )(•)( )  ( )          │
│ Price/deposit/bills  (•)( )( )  ( )          │
│                                              │
│ [ Next: questions & risk indicators ]        │
└──────────────────────────────────────────────┘
```

### A4 — Client: report view (private)

```
┌── Verification report ──────────────────────┐
│ Summary (3–5 sentences)                      │
│ ─────────────────────────                    │
│ Listing-match: [matrix]                      │
│ Live observations: …                         │
│ Factual Q&A: …                               │
│ Risk indicators: …                           │
│ Evidence (permission-gated): [thumbnails]    │
│ Confidence level:  High / Medium / Low       │
│ Unresolved concerns: …                       │
│ ─────────────────────────                    │
│ Disclaimer: not a guarantee, not legal       │
│ advice, evidence-provenance note.            │
└──────────────────────────────────────────────┘
```
No `recommendation` and no `risk_score` shown — see the flagged conflict in `app-plan.md`.

---

## Shared component inventory (stack-agnostic)

| Component | Used in | Notes |
|---|---|---|
| Button (primary / ghost) | everywhere | primary = single main action per view |
| Text field / textarea | intake, capture | |
| Radio group | video-call choice, checklist rows | |
| Checkbox | attestation, permission gate | can gate a disabled submit |
| Status pill / stepper | client tracker | maps to request states |
| Checklist row (Y/N/Part/Unclear) | listing-match | |
| Permission toggle | verifier gate | blocks progress until set |
| Evidence-capture card | verifier | shows provenance-limit note |
| Disclaimer block | footer, report, confirmations | reused, never removed |
| Honesty banner | landing | never replaced by urgency copy |

## Design tokens (starting palette — reuse what `web/landing.html` already defines)

- `--ink` (text), `--accent` (`#2563eb`), `--radius`, system font stack.
- These are a *starting point* only; final visual design is out of scope for this draft.
- One responsive breakpoint is enough for the landing (mobile-first — target users are on phones).
