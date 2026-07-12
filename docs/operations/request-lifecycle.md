# Remote Viewing Request Lifecycle

> Single source of truth for how the MVP request flows from intake to delivery.
> If any other doc conflicts with this one, this one wins for operational purposes.

## Intake - required fields

Every request must collect:

- Requester name
- Requester email
- Requester phone
- Listing URL or screenshots
- Claimed address
- Viewing date/time, if already arranged
- Video-call preference: WhatsApp / Google Meet / Zoom
- Landlord/agent contact details, if available
- Concerns or specific questions
- Requester attestation: "I confirm I have a genuine rental interest in this listing and the information provided is accurate to the best of my knowledge."

## Anti-abuse rules

Before a request is accepted:

1. The requester attestation must be checked.
2. The admin screens the request manually for plausibility.
3. HouseCheck does not proactively contact or pressure a landlord/agent in the MVP.
4. Only one active request per claimed address is allowed unless the admin approves an exception.

## Service mapping

| Package | Type | Artifact | Delivery channel |
|---|---|---|---|
| Remote Viewing Visit | Field visit + live video call | Short post-visit verification report | Email or shared document |

Digital-only review, exterior-only checks, premium reports, AI scoring, ownership checks, and contract review are not MVP packages.

## Request statuses

```text
submitted -> screened -> accepted -> assigned -> visit_scheduled -> in_progress -> summary_drafted -> qa_review -> delivered -> closed
                 |                                      |
             rejected                                aborted
```

- `submitted`: intake received.
- `screened`: admin anti-abuse check passed.
- `accepted`: admin agrees the request fits the MVP.
- `assigned`: trusted verifier assigned.
- `visit_scheduled`: viewing time and video call confirmed.
- `in_progress`: verifier is traveling, on site, or completing the visit.
- `summary_drafted`: post-visit summary drafted.
- `qa_review`: summary checked before delivery.
- `delivered`: summary sent to client.
- `closed`: request closed and retention timer started.
- `rejected`: failed screening or out of scope.
- `aborted`: verifier aborted for safety, permission, or access reasons.

## QA gate

No summary is delivered without a QA pass.

QA checks:

- no guarantee language
- no defamatory language
- no legal advice
- no recommendation whether to rent
- permission limitations recorded
- what could not be checked is clear
- risk indicators and unresolved concerns are factual

## Delivery

The MVP delivery artifact is a short post-visit verification report. It should say what the verifier observed, what matched the listing, what did not match, what could not be checked, risk indicators, confidence level, and unresolved concerns.
