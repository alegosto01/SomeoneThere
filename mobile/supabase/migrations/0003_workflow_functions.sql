-- SomeoneThere — workflow RPCs
--
-- Status transitions that must stay consistent (visit status + event row +
-- report state) run here rather than as several client-side writes, so a
-- dropped connection mid-visit cannot leave a half-applied transition.

-- Verifier check-in (spec §33).
create or replace function verifier_check_in(p_visit_id uuid)
returns visits
language plpgsql
security definer
set search_path = public
as $$
declare
  v visits;
begin
  select * into v from visits where id = p_visit_id for update;
  if not found then
    raise exception 'visit not found';
  end if;
  if v.verifier_id is distinct from auth.uid() and not is_admin() then
    raise exception 'not assigned to this visit';
  end if;
  if not v.access_confirmed then
    raise exception 'access has not been confirmed for this visit';
  end if;
  if v.checked_in_at is not null then
    raise exception 'already checked in';
  end if;

  update visits
     set checked_in_at = now(), status = 'verifier_arrived'
   where id = p_visit_id
  returning * into v;

  insert into visit_events (visit_id, event_type, actor_id)
  values (p_visit_id, 'verifier_arrived', auth.uid());

  return v;
end;
$$;

-- Verifier check-out (spec §36).
create or replace function verifier_check_out(p_visit_id uuid)
returns visits
language plpgsql
security definer
set search_path = public
as $$
declare
  v visits;
  r_id uuid;
begin
  select * into v from visits where id = p_visit_id for update;
  if not found then
    raise exception 'visit not found';
  end if;
  if v.verifier_id is distinct from auth.uid() and not is_admin() then
    raise exception 'not assigned to this visit';
  end if;
  if v.checked_in_at is null then
    raise exception 'cannot check out before checking in';
  end if;

  update visits
     set checked_out_at = now(), status = 'visit_completed', live_call_ready = false
   where id = p_visit_id
  returning * into v;

  insert into visit_events (visit_id, event_type, actor_id, metadata)
  values (
    p_visit_id, 'visit_completed', auth.uid(),
    jsonb_build_object(
      'duration_minutes',
      extract(epoch from (v.checked_out_at - v.checked_in_at)) / 60
    )
  );

  -- Draft report the verifier fills in next.
  insert into reports (visit_id) values (p_visit_id)
  on conflict (visit_id) do nothing
  returning id into r_id;

  return v;
end;
$$;

-- Report submission (spec §37). Enforces the minimum content server-side so a
-- client bug cannot produce an empty report.
create or replace function submit_report(p_report_id uuid)
returns reports
language plpgsql
security definer
set search_path = public
as $$
declare
  r reports;
  observation_count integer;
begin
  select * into r from reports where id = p_report_id for update;
  if not found then
    raise exception 'report not found';
  end if;
  if not (is_assigned_verifier(r.visit_id) or is_admin()) then
    raise exception 'not assigned to this visit';
  end if;
  if r.submitted_at is not null then
    raise exception 'report already submitted';
  end if;
  if r.listing_match is null then
    raise exception 'listing match status is required';
  end if;
  if coalesce(length(trim(r.verifier_summary)), 0) < 20 then
    raise exception 'verifier summary is required';
  end if;

  select count(*) into observation_count
    from report_observations where report_id = p_report_id;
  if observation_count = 0 then
    raise exception 'at least one observation is required';
  end if;

  update reports set submitted_at = now() where id = p_report_id returning * into r;

  -- `report_ready` is deliberately not a status a verifier may set by hand, so
  -- mark this as a trusted transition for the guard in 0002. Transaction-local,
  -- so it cannot leak into any later statement.
  perform set_config('someonethere.trusted_transition', 'on', true);
  update visits set status = 'report_ready' where id = r.visit_id;
  perform set_config('someonethere.trusted_transition', 'off', true);

  insert into visit_events (visit_id, event_type, actor_id)
  values (r.visit_id, 'report_ready', auth.uid());

  update verifier_profiles
     set completed_visits = completed_visits + 1
   where user_id = (select verifier_id from visits where id = r.visit_id);

  return r;
end;
$$;

-- Consent recorded on site by the verifier (spec §32, §63). This is the only
-- path that may set `*_allowed`, and it can never widen beyond what the
-- customer requested.
create or replace function record_capture_consent(
  p_visit_id uuid,
  p_photos_allowed boolean,
  p_recording_allowed boolean
)
returns visits
language plpgsql
security definer
set search_path = public
as $$
declare
  v visits;
begin
  select * into v from visits where id = p_visit_id for update;
  if not found then
    raise exception 'visit not found';
  end if;
  if v.verifier_id is distinct from auth.uid() and not is_admin() then
    raise exception 'not assigned to this visit';
  end if;

  update visits
     set photos_allowed    = (p_photos_allowed    and v.photos_requested),
         recording_allowed = (p_recording_allowed and v.recording_requested)
   where id = p_visit_id
  returning * into v;

  return v;
end;
$$;

grant execute on function verifier_check_in(uuid) to authenticated;
grant execute on function verifier_check_out(uuid) to authenticated;
grant execute on function submit_report(uuid) to authenticated;
grant execute on function record_capture_consent(uuid, boolean, boolean) to authenticated;
