-- SomeoneThere — Row Level Security (spec §43)
--
-- Ownership rules in one sentence: a customer sees only rows that hang off a
-- visit they own; a verifier sees only rows that hang off a visit assigned to
-- them, and never payment rows; an admin sees everything.

-- ------------------------------------------------------------- helpers ----
-- SECURITY DEFINER so the helper can read `profiles` without recursing into the
-- policies that call it.
create or replace function current_role_name()
returns user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from profiles where id = auth.uid();
$$;

create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select role from profiles where id = auth.uid()) = 'admin', false);
$$;

create or replace function owns_visit(p_visit_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from visits v where v.id = p_visit_id and v.customer_id = auth.uid()
  );
$$;

create or replace function is_assigned_verifier(p_visit_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from visits v where v.id = p_visit_id and v.verifier_id = auth.uid()
  );
$$;

create or replace function can_read_visit(p_visit_id uuid)
returns boolean
language sql
stable
as $$
  select owns_visit(p_visit_id) or is_assigned_verifier(p_visit_id) or is_admin();
$$;

create or replace function report_visit_id(p_report_id uuid)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select visit_id from reports where id = p_report_id;
$$;

alter table profiles              enable row level security;
alter table verifier_profiles     enable row level security;
alter table properties            enable row level security;
alter table visits                enable row level security;
alter table property_contacts     enable row level security;
alter table visit_priorities      enable row level security;
alter table visit_events          enable row level security;
alter table reports               enable row level security;
alter table report_observations   enable row level security;
alter table report_differences    enable row level security;
alter table report_questions      enable row level security;
alter table report_unchecked_areas enable row level security;
alter table report_media          enable row level security;
alter table payments              enable row level security;
alter table device_tokens         enable row level security;

-- ------------------------------------------------------------- profiles ----
create policy profiles_select_self on profiles
  for select using (id = auth.uid() or is_admin());

create policy profiles_update_self on profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- Role escalation is an operator action, never a client one. The check only
-- applies when an authenticated JWT user is making the change (auth.uid() set);
-- service-role and direct-SQL contexts (dashboard operators, seeds) are trusted.
-- SECURITY DEFINER so the guard does not depend on the caller holding privileges
-- on the auth schema: a guard that errors for the wrong reason is still a guard
-- that blocks a legitimate write.
create or replace function prevent_role_self_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and auth.uid() is not null
     and not is_admin() then
    raise exception 'role may only be changed by an admin';
  end if;
  return new;
end;
$$;

create trigger profiles_role_guard before update on profiles
  for each row execute function prevent_role_self_change();

-- ---------------------------------------------------- verifier profiles ----
create policy verifier_profiles_select_self on verifier_profiles
  for select using (user_id = auth.uid() or is_admin());

create policy verifier_profiles_update_self on verifier_profiles
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Customers read verifier details only through this view, which exposes the
-- card fields from spec §16 and nothing else (no email, phone, or surname).
grant select on verifier_public_cards to authenticated;

-- ----------------------------------------------------------- properties ----
create policy properties_customer_all on properties
  for all using (customer_id = auth.uid() or is_admin())
  with check (customer_id = auth.uid() or is_admin());

-- A verifier needs the address of a property they are attending.
create policy properties_assigned_verifier_select on properties
  for select using (
    exists (
      select 1 from visits v
      where v.property_id = properties.id and v.verifier_id = auth.uid()
    )
  );

-- --------------------------------------------------------------- visits ----
create policy visits_customer_select on visits
  for select using (customer_id = auth.uid() or is_admin());

create policy visits_customer_insert on visits
  for insert with check (customer_id = auth.uid());

-- Customers may edit a visit only while it is still a draft awaiting payment;
-- after that the backend owns the status.
create policy visits_customer_update on visits
  for update using (
    customer_id = auth.uid() and status in ('draft', 'payment_pending')
  )
  with check (customer_id = auth.uid());

create policy visits_verifier_select on visits
  for select using (verifier_id = auth.uid());

create policy visits_verifier_update on visits
  for update using (verifier_id = auth.uid())
  with check (verifier_id = auth.uid());

create policy visits_admin_all on visits
  for all using (is_admin()) with check (is_admin());

-- A verifier must not be able to grant themselves consent, reassign a visit,
-- or move it to a status they do not own.
create or replace function guard_visit_verifier_update()
returns trigger
language plpgsql
as $$
begin
  if is_admin() then
    return new;
  end if;

  -- Transitions made by the workflow RPCs in 0003 are already validated there
  -- (assignment, consent, report completeness), so they set this transaction
  -- local flag to pass through. A verifier writing to `visits` directly has no
  -- way to set it, so the guard below still applies to them.
  if current_setting('someonethere.trusted_transition', true) = 'on' then
    return new;
  end if;

  if old.verifier_id = auth.uid() then
    if new.verifier_id is distinct from old.verifier_id
       or new.customer_id is distinct from old.customer_id
       or new.property_id is distinct from old.property_id
       or new.access_confirmed is distinct from old.access_confirmed
       or new.recording_requested is distinct from old.recording_requested
       or new.photos_requested is distinct from old.photos_requested then
      raise exception 'verifier may not modify assignment or customer requests';
    end if;

    if new.status not in (
      'verifier_assigned', 'verifier_en_route', 'verifier_arrived',
      'live', 'visit_completed', 'report_pending'
    ) then
      raise exception 'verifier may not set status %', new.status;
    end if;
  end if;

  return new;
end;
$$;

create trigger visits_verifier_guard before update on visits
  for each row execute function guard_visit_verifier_update();

-- ---------------------------------------------- visit child collections ----
create policy property_contacts_rw on property_contacts
  for all using (can_read_visit(visit_id))
  with check (owns_visit(visit_id) or is_admin());

create policy visit_priorities_rw on visit_priorities
  for all using (can_read_visit(visit_id))
  with check (owns_visit(visit_id) or is_admin());

create policy visit_events_select on visit_events
  for select using (can_read_visit(visit_id));

create policy visit_events_insert on visit_events
  for insert with check (is_assigned_verifier(visit_id) or is_admin());

-- -------------------------------------------------------------- reports ----
-- Customers may read a report only once it has been submitted; a half-finished
-- report is not something to show anyone.
create policy reports_customer_select on reports
  for select using (owns_visit(visit_id) and submitted_at is not null);

create policy reports_verifier_all on reports
  for all using (is_assigned_verifier(visit_id))
  with check (is_assigned_verifier(visit_id));

create policy reports_admin_all on reports
  for all using (is_admin()) with check (is_admin());

-- A submitted report is immutable to the verifier; corrections are an admin job.
create or replace function guard_report_immutable()
returns trigger
language plpgsql
as $$
begin
  if old.submitted_at is not null and not is_admin() then
    raise exception 'a submitted report cannot be modified';
  end if;
  return new;
end;
$$;

create trigger reports_immutable before update on reports
  for each row execute function guard_report_immutable();

-- Report child tables all follow the parent report's visibility.
do $$
declare
  child text;
begin
  foreach child in array array[
    'report_observations', 'report_differences', 'report_questions',
    'report_unchecked_areas', 'report_media'
  ]
  loop
    execute format($f$
      create policy %1$s_customer_select on %1$I
        for select using (
          exists (
            select 1 from reports r
            where r.id = %1$I.report_id
              and r.submitted_at is not null
              and owns_visit(r.visit_id)
          )
        );

      create policy %1$s_verifier_all on %1$I
        for all using (is_assigned_verifier(report_visit_id(report_id)))
        with check (is_assigned_verifier(report_visit_id(report_id)));

      create policy %1$s_admin_all on %1$I
        for all using (is_admin()) with check (is_admin());
    $f$, child);
  end loop;
end;
$$;

-- ------------------------------------------------------------- payments ----
-- Read-only for the customer; only the Stripe webhook (service role) writes.
-- Verifiers have no policy here at all, so they cannot see payment data.
create policy payments_customer_select on payments
  for select using (customer_id = auth.uid());

create policy payments_admin_all on payments
  for all using (is_admin()) with check (is_admin());

-- -------------------------------------------------------- device tokens ----
create policy device_tokens_owner_all on device_tokens
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
