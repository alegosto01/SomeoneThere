# Verification Request Lifecycle

> Single source of truth for how a request flows from intake to delivery.
> Reconciles `docs/mvp-scope.md`, `docs/tech/architecture.md`, and `docs/operations/verification-report-template.md` to one contract.
> If any other doc conflicts with this one, **this one wins** for operational purposes.

## Intake — required fields

Every request must collect:

- Requester name
- Requester email (verified — confirmation link)
- Requester phone (optional but recommended)
- Listing URL (or screenshots if the listing was deleted)
- Claimed address (street, number, city, neighborhood)
- Claimed price and deposit requested
- Landlord/agent contact details (if available)
- Package type: `basic` | `exterior` | `viewing` | `premium`
- Urgency note (free text; does not change SLA)
- **Requester attestation** (required): "I confirm I have a genuine rental interest in this listing and the information provided is accurate to the best of my knowledge."
- Concerns / specific questions (free text)

## Anti-abuse rules (intake gate)

Before a request is accepted:

1. **Requester attestation** must be checked (genuine rental interest).
2. **Address dedupe**: only one active request per claimed address. If a duplicate arrives, flag for manual admin review before assignment — do not auto-dispatch a second verifier to the same address.
3. **No automatic landlord contact**: HouseCheck does not proactively contact the landlord/agent in the MVP. If the verifier interacts with anyone on-site, it is incidental and covered by the Spanish landlord notice.
4. **Manual screening**: for the pilot (≤10 requests), the admin reviews every intake for plausibility before accepting.

## Package → SLA → Artifact mapping

| Package | Type | SLA target | Artifact | Delivery channel |
|---|---|---|---|---|
| Basic listing review | Digital only | < 4 hours | Text report (no field photos) | Email (tracked) |
| Exterior/address check | Field (daylight) | Next business day | Report + exterior photos | Email (tracked) |
| Viewing attendance | Field (interior) | **BLOCKED** until SOP + insurance signed off | — | — |
| Premium scam check | Field (interior) | **BLOCKED** until SOP + insurance signed off | — | — |

## SLA clock

- The SLA clock **starts** when the admin accepts the request (status → `accepted`), not when the user submits.
- The clock **pauses** if waiting on the requester for missing info.
- The clock **does not apply** to blocked packages.

## Request statuses (finite list)

```
submitted → screened → accepted → assigned → in_progress → qa_review → delivered → closed
                 ↓                                          ↓
             rejected                                  aborted
```

- `submitted`: intake form received, not yet reviewed.
- `screened`: admin anti-abuse check passed.
- `accepted`: admin committed to delivering; SLA clock starts.
- `assigned`: verifier assigned (field packages) or reviewer assigned (basic).
- `in_progress`: work underway.
- `qa_review`: report drafted, waiting QA check (every report is QA-reviewed before delivery).
- `delivered`: report sent to requester via tracked email; SLA clock stops.
- `closed`: payment reconciled, retention timer started.
- `rejected`: failed anti-abuse screen or out of scope.
- `aborted`: verifier aborted for safety or access; partial report may still be delivered.

## Assignment rule

- **Basic**: assigned to a reviewer (can be remote; no field visit).
- **Exterior/Viewing/Premium**: assigned to a verifier who has signed the safety SOP and for whom insurance is confirmed (when required).

## QA gate

- No report is delivered without a QA pass.
- QA checks: hedged language compliance, no defamatory terms, landlord pseudonymized, evidence provenance statement present, "what could not be checked" section filled.
- QA reviewer should not be the same person who wrote the report (round 2 Risk 3).

## Delivery channel

- MVP: tracked email (delivery receipt or signed link).
- The report PDF + evidence links are attached/linked.
- Delivery timestamp is logged for chargeback defense (R014).