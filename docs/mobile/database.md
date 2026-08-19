# SomeoneThere mobile — database and security model

Migrations live in `mobile/supabase/migrations/` and apply in order:

| File | Contents |
| --- | --- |
| `0001_schema.sql` | Enums, tables, triggers, the verifier card view |
| `0002_rls.sql` | Row Level Security policies and the guards behind them |
| `0003_workflow_functions.sql` | Check-in, check-out, consent, report submission |
| `0004_storage.sql` | Private buckets and their access policies |

## Tables

| Table | Holds |
| --- | --- |
| `profiles` | One row per auth user; carries the role |
| `verifier_profiles` | Bio, languages, identity flag, visit count, rating |
| `properties` | The listing a customer submitted |
| `visits` | The booking: schedule, status, consent flags, call details |
| `property_contacts` | Landlord/agent/tenant for one visit |
| `visit_priorities` | What the customer asked to have checked |
| `visit_events` | Append-only timeline |
| `reports` | One per visit; `submitted_at` is the freeze point |
| `report_observations` | Category + rating + note |
| `report_differences` | Observed differences from the listing |
| `report_questions` | Question, answer, who said it |
| `report_unchecked_areas` | What could not be checked |
| `report_media` | Storage paths for permitted photos |
| `payments` | Stripe intent id and status |
| `device_tokens` | Push tokens per device |

Every status-like column is a Postgres enum. There are no free-text statuses.

## Who can see what

**Customer**

- Own profile, own properties, own visits, and everything hanging off them.
- Reports for their own visits — but only once `submitted_at` is set. A
  half-written report is not something to show anyone.
- Their own payment rows, read-only.
- Verifier details only through `verifier_public_cards`.

**Verifier**

- Visits assigned to them, and the property, contact and priorities for those.
- Their own report rows, editable until submitted.
- Photo uploads, only where `photos_allowed` is true.
- **No access to `payments` at all** — there is no policy granting it, so the
  table is invisible to them.

**Admin**

- Everything, through explicit `is_admin()` policies.

## Guards beyond the policies

Policies say who may touch a row. Three triggers and one constraint say what they
may do with it:

- `profiles_role_guard` — a user cannot change their own role. Promotion to
  verifier is an operator action.
- `visits_verifier_guard` — an assigned verifier cannot reassign the visit,
  change the customer's requests, set `access_confirmed`, or move the visit into
  a status they do not own.
- `reports_immutable` — once `submitted_at` is set, the verifier cannot edit the
  report. Corrections are an admin job.
- `recording_requires_consent` — `recording_allowed` cannot be true on a visit
  where recording was never requested.

The RLS helper functions (`owns_visit`, `is_assigned_verifier`, `is_admin`) are
`SECURITY DEFINER` so that reading `profiles` inside a policy does not recurse
into the policy that is currently evaluating.

## Workflow RPCs

Transitions that must stay consistent run server-side rather than as several
client writes, so a dropped connection mid-visit cannot half-apply one:

- `verifier_check_in(visit_id)` — refuses without confirmed access, stamps the
  time, sets `verifier_arrived`, writes the event.
- `verifier_check_out(visit_id)` — stamps the time, sets `visit_completed`,
  writes the event with a duration, creates the draft report.
- `record_capture_consent(visit_id, photos, recording)` — the only path that may
  set `*_allowed`, and it cannot exceed what was requested.
- `submit_report(report_id)` — re-checks the minimum content (listing match, a
  real summary, at least one observation), stamps `submitted_at`, flips the visit
  to `report_ready`, writes the event, increments the verifier's visit count.

`submit_report` deliberately repeats the client-side validation. The app's submit
button being disabled is a courtesy; this is the actual rule.

## Storage

Two private buckets. Neither is public, and `visit-media` must never become
public.

```
avatars/<user_id>/…
visit-media/<visit_id>/<report_id>/…
```

The first path segment of `visit-media` is the visit id, which is what the
storage policies key off: a customer may read objects for their own visits, an
assigned verifier for theirs, and only an assigned verifier with recorded photo
consent may write. Everything is served through signed URLs with a ten-minute
lifetime.

## Demo data

`mobile/supabase/seed.sql` creates `customer@example.com` and
`verifier@example.com` (throwaway local passwords) plus three visits: one
assigned and upcoming, one awaiting a verifier, one completed with a full report.
Run it against a local stack only — `supabase db reset`.
