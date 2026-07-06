# Data Retention Schedule (Draft)

> Draft for lawyer review before the first report is stored. GDPR Art. 5(1)(e) requires defined retention periods, not "as needed."
> All TTLs below are **proposals**; lawyer must confirm.

## Principles

- Keep the shortest period consistent with: (a) delivering the service, (b) defending against chargebacks, (c) legal/insurance obligations.
- Different data categories have different TTLs — do not apply one global number.
- Deletion must be executable (manual for the pilot; automated in Phase 1).

## Proposed retention by category

| Category | Examples | Proposed TTL | Rationale |
|---|---|---|---|
| Report text (delivered) | Summary, red flags, notes | 24 months from delivery | Chargeback defense window + lawyer review window |
| Field photos / videos | Exterior, interior, entrance | 12 months from delivery | Evidence for disputes; minimize privacy footprint sooner than text |
| Landlord/agent personal data | Name, phone, role | 90 days from delivery | Not needed after QA + dispute window closes; pseudonymized in the deliverable anyway |
| Requester data | Name, email, phone | 24 months from delivery | Customer support + legal defense |
| Payment references | Stripe charge ID, receipt | 7 years (tax/accounting) | Spanish tax law retention; keep reference only, not full card data |
| Intake that was rejected | Failed anti-abuse screen | 30 days | Short, for audit only, then deleted |
| Evidence metadata (EXIF) | Geo, timestamp | Same TTL as the media it belongs to | Travels with the photo |

## Notes

- These TTLs assume the **report is private** to the requester (decision-log, 2026-07-06). If reports are ever published, retention logic changes.
- "Delete on request" right: requester can ask for deletion of their own data; landlord data deletion follows its own TTL regardless of requester request (third-party rights).
- Backup hygiene: deleted data must also be purged from backups within a defined window (Phase 1 concern; for the pilot, document the manual purge).

## Lawyer review checkpoint

- [ ] Lawyer confirms each TTL.
- [ ] Privacy policy references this schedule.
- [ ] Retention review logged in `docs/decision-log.md`.