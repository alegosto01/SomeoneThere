-- RLS test suite. Run against a database that has the migrations, the stubs and
-- seed.sql applied:
--
--   psql -f supabase/tests/00_supabase_stubs.sql \
--        -f supabase/migrations/0001_schema.sql ... \
--        -f supabase/seed.sql -f supabase/tests/01_rls_test.sql
--
-- Each check raises on failure, so a clean run means every assertion held.

-- A second customer, to prove customers are isolated from each other.
insert into auth.users (id, email, raw_user_meta_data)
values ('33333333-3333-3333-3333-333333333333', 'other@example.com',
        '{"first_name":"Other","last_name":"Person"}')
on conflict (id) do nothing;

create or replace function assert(condition boolean, description text)
returns void language plpgsql as $$
begin
  if not condition then
    raise exception 'FAIL: %', description;
  end if;
  raise notice 'ok  %', description;
end $$;

-- Runs a statement as a given user and reports whether it raised.
create or replace function raises(stmt text, uid uuid)
returns boolean language plpgsql as $$
begin
  execute format('set local role authenticated');
  execute format('set local request.jwt.claims = %L', json_build_object('sub', uid)::text);
  begin
    execute stmt;
  exception when others then
    perform set_config('role', 'none', true);
    perform set_config('request.jwt.claims', '', true);
    return true;
  end;
  perform set_config('role', 'none', true);
  perform set_config('request.jwt.claims', '', true);
  return false;
end $$;

do $$
declare
  customer uuid := '11111111-1111-1111-1111-111111111111';
  verifier uuid := '22222222-2222-2222-2222-222222222222';
  other    uuid := '33333333-3333-3333-3333-333333333333';
  n integer;
  submitted_report uuid;
  unassigned_visit uuid;
begin
  select id into submitted_report from reports where submitted_at is not null limit 1;
  select id into unassigned_visit from visits where verifier_id is null limit 1;

  ---------------------------------------------------------------- customer --
  set local role authenticated;
  set local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111"}';

  select count(*) into n from visits;
  perform assert(n = 3, 'customer sees their own 3 visits');

  select count(*) into n from reports;
  perform assert(n = 1, 'customer sees the 1 submitted report');

  select count(*) into n from payments;
  perform assert(n = 3, 'customer sees their own payments');

  select count(*) into n from report_media;
  perform assert(n = 0, 'customer sees no media (none uploaded in seed)');

  ------------------------------------------------------- customer isolation --
  reset role;
  set local request.jwt.claims = '';
  set local role authenticated;
  set local request.jwt.claims = '{"sub":"33333333-3333-3333-3333-333333333333"}';

  select count(*) into n from visits;
  perform assert(n = 0, 'a different customer sees none of the first customer''s visits');

  select count(*) into n from properties;
  perform assert(n = 0, 'a different customer sees no properties');

  select count(*) into n from reports;
  perform assert(n = 0, 'a different customer sees no reports');

  select count(*) into n from payments;
  perform assert(n = 0, 'a different customer sees no payments');

  ---------------------------------------------------------------- verifier --
  reset role;
  set local request.jwt.claims = '';
  set local role authenticated;
  set local request.jwt.claims = '{"sub":"22222222-2222-2222-2222-222222222222"}';

  select count(*) into n from visits;
  perform assert(n = 2, 'verifier sees only the 2 visits assigned to them');

  select count(*) into n from payments;
  perform assert(n = 0, 'verifier sees NO payment rows');

  select count(*) into n from properties;
  perform assert(n = 2, 'verifier sees the properties for their assigned visits');

  reset role;

  set local request.jwt.claims = '';
end $$;

-- Write guards. Each of these must be refused.
do $$
declare
  customer uuid := '11111111-1111-1111-1111-111111111111';
  verifier uuid := '22222222-2222-2222-2222-222222222222';
  other    uuid := '33333333-3333-3333-3333-333333333333';
  submitted_report uuid;
  assigned_visit uuid;
begin
  select id into submitted_report from reports where submitted_at is not null limit 1;
  select v.id into assigned_visit from visits v
    where v.verifier_id = verifier and v.status = 'verifier_assigned' limit 1;

  perform assert(
    raises(format('update visits set access_confirmed = false where id = %L', assigned_visit), verifier),
    'verifier CANNOT change access_confirmed');

  perform assert(
    raises(format('update visits set verifier_id = %L where id = %L', other, assigned_visit), verifier),
    'verifier CANNOT reassign the visit to someone else');

  perform assert(
    raises(format('update visits set photos_requested = false where id = %L', assigned_visit), verifier),
    'verifier CANNOT alter what the customer requested');

  perform assert(
    raises(format('update visits set status = ''refunded'' where id = %L', assigned_visit), verifier),
    'verifier CANNOT set a status they do not own');

  perform assert(
    raises(format('update reports set verifier_summary = ''tampered'' where id = %L', submitted_report), verifier),
    'a submitted report CANNOT be modified');

  perform assert(
    raises(format('update profiles set role = ''admin'' where id = %L', customer), customer),
    'a user CANNOT promote themselves to admin');

  perform assert(
    not raises(format('update profiles set first_name = ''Marco'' where id = %L', customer), customer),
    'a user CAN still edit their own name');
end $$;

-- Consent invariant: allowed can never exceed requested.
do $$
declare
  verifier uuid := '22222222-2222-2222-2222-222222222222';
  v visits;
  target uuid;
begin
  -- A visit assigned to the verifier, where photos were requested but
  -- recording was not.
  select id into target from visits
   where verifier_id = verifier and recording_requested = false
     and photos_requested = true limit 1;

  begin
    update visits set recording_allowed = true where id = target;
    raise exception 'FAIL: recording_allowed was set without a request';
  exception when check_violation then
    raise notice 'ok  CHECK refuses recording_allowed without recording_requested';
  end;

  -- The RPC clamps rather than raising: consent cannot widen past the request,
  -- even when the verifier reports that the contact agreed to everything.
  set local role authenticated;
  set local request.jwt.claims = '{"sub":"22222222-2222-2222-2222-222222222222"}';

  select * into v from record_capture_consent(target, true, true);
  perform assert(v.recording_allowed = false,
    'record_capture_consent CANNOT grant recording that was never requested');
  perform assert(v.photos_allowed = true,
    'record_capture_consent DOES grant photos that were requested');

  reset role;

  set local request.jwt.claims = '';
end $$;

-- submit_report refuses an incomplete report.
--
-- Runs as the ASSIGNED verifier throughout: if it ran as anyone else the RPC
-- would refuse on authorisation and the test would pass without ever exercising
-- the content rules it claims to check.
do $$
declare
  verifier uuid := '22222222-2222-2222-2222-222222222222';
  target_visit uuid;
  r reports;
begin
  select id into target_visit from visits
   where verifier_id = verifier and status = 'verifier_assigned' limit 1;
  insert into reports (visit_id) values (target_visit) returning * into r;

  set local role authenticated;
  set local request.jwt.claims = '{"sub":"22222222-2222-2222-2222-222222222222"}';

  begin
    perform submit_report(r.id);
    raise exception 'FAIL: an empty report was accepted';
  exception when others then
    if sqlerrm like 'FAIL%' then raise; end if;
    perform assert(sqlerrm like '%listing match%',
      format('submit_report refuses a report with no listing_match (got: %s)', sqlerrm));
  end;

  reset role;

  set local request.jwt.claims = '';
  update reports set listing_match = 'consistent', verifier_summary = 'too short'
   where id = r.id;
  set local role authenticated;
  set local request.jwt.claims = '{"sub":"22222222-2222-2222-2222-222222222222"}';

  begin
    perform submit_report(r.id);
    raise exception 'FAIL: a report with a 9-character summary was accepted';
  exception when others then
    if sqlerrm like 'FAIL%' then raise; end if;
    perform assert(sqlerrm like '%summary%',
      format('submit_report refuses a summary under 20 characters (got: %s)', sqlerrm));
  end;

  -- And a complete one is accepted, so the checks above are not just refusing
  -- everything.
  reset role;
  set local request.jwt.claims = '';
  update reports
     set verifier_summary = 'The flat matched the listing in layout and size; no damp observed.'
   where id = r.id;
  insert into report_observations (report_id, category, rating)
  values (r.id, 'natural_light', 'good');
  set local role authenticated;
  set local request.jwt.claims = '{"sub":"22222222-2222-2222-2222-222222222222"}';

  select * into r from submit_report(r.id);
  perform assert(r.submitted_at is not null, 'submit_report ACCEPTS a complete report');

  reset role;

  set local request.jwt.claims = '';
  perform assert(
    (select status from visits where id = target_visit) = 'report_ready',
    'submitting a report moves the visit to report_ready');
  perform assert(
    exists (select 1 from visit_events
             where visit_id = target_visit and event_type = 'report_ready'),
    'submitting a report records a report_ready event');

  delete from reports where id = r.id;
end $$;

-- Check-in / check-out, run as the assigned verifier.
do $$
declare
  verifier uuid := '22222222-2222-2222-2222-222222222222';
  target uuid;
  v visits;
begin
  -- Access not yet confirmed: check-in must be refused. There is no legitimate
  -- reason to attend a viewing nobody agreed to.
  select id into target from visits where verifier_id = verifier limit 1;
  update visits set access_confirmed = false, status = 'verifier_assigned',
                    checked_in_at = null, checked_out_at = null
   where id = target;

  set local role authenticated;
  set local request.jwt.claims = '{"sub":"22222222-2222-2222-2222-222222222222"}';
  begin
    perform verifier_check_in(target);
    raise exception 'FAIL: checked in to a visit with unconfirmed access';
  exception when others then
    if sqlerrm like 'FAIL%' then raise; end if;
    perform assert(sqlerrm like '%access has not been confirmed%',
      format('check-in refused while access is unconfirmed (got: %s)', sqlerrm));
  end;

  reset role;

  set local request.jwt.claims = '';
  update visits set access_confirmed = true where id = target;

  set local role authenticated;
  set local request.jwt.claims = '{"sub":"22222222-2222-2222-2222-222222222222"}';

  select * into v from verifier_check_in(target);
  perform assert(v.status = 'verifier_arrived', 'check-in moves the visit to verifier_arrived');
  perform assert(v.checked_in_at is not null, 'check-in records a timestamp');

  begin
    perform verifier_check_in(target);
    raise exception 'FAIL: checked in twice';
  exception when others then
    if sqlerrm like 'FAIL%' then raise; end if;
    perform assert(sqlerrm like '%already checked in%', 'check-in is not repeatable');
  end;

  select * into v from verifier_check_out(target);
  perform assert(v.status = 'visit_completed', 'check-out moves the visit to visit_completed');
  perform assert(v.live_call_ready = false, 'check-out closes the live call');
  perform assert(
    exists (select 1 from reports where visit_id = target),
    'check-out opens a draft report for the verifier to fill in');

  reset role;

  set local request.jwt.claims = '';
end $$;

-- An unassigned user must not be able to drive someone else's visit.
do $$
declare
  other uuid := '33333333-3333-3333-3333-333333333333';
  target uuid;
begin
  select id into target from visits
   where verifier_id = '22222222-2222-2222-2222-222222222222' limit 1;

  perform assert(
    raises(format('select verifier_check_in(%L)', target), other),
    'an unassigned user CANNOT check in to a visit');
  perform assert(
    raises(format('select verifier_check_out(%L)', target), other),
    'an unassigned user CANNOT check out of a visit');
  perform assert(
    raises(format('select record_capture_consent(%L, true, true)', target), other),
    'an unassigned user CANNOT record consent');
end $$;

-- Storage: visit media is reachable only through the visit it belongs to.
do $$
declare
  target uuid;
  n integer;
begin
  select id into target from visits
   where customer_id = '11111111-1111-1111-1111-111111111111' limit 1;

  insert into storage.objects (bucket_id, name)
  values ('visit-media', target || '/report/photo.jpg');

  set local role authenticated;
  set local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111"}';
  select count(*) into n from storage.objects;
  perform assert(n = 1, 'customer CAN see media for their own visit');

  reset role;

  set local request.jwt.claims = '';
  set local role authenticated;
  set local request.jwt.claims = '{"sub":"33333333-3333-3333-3333-333333333333"}';
  select count(*) into n from storage.objects;
  perform assert(n = 0, 'an unrelated user CANNOT see visit media');

  reset role;

  set local request.jwt.claims = '';
  perform assert(
    (select public from storage.buckets where id = 'visit-media') = false,
    'the visit-media bucket is NOT public');
  perform assert(
    (select public from storage.buckets where id = 'avatars') = false,
    'the avatars bucket is NOT public');
end $$;

-- The verifier card view must not leak identity beyond spec §16.
do $$
declare
  cols text[];
begin
  select array_agg(column_name::text order by column_name) into cols
    from information_schema.columns
   where table_name = 'verifier_public_cards';

  perform assert(not ('email' = any(cols)), 'verifier card exposes no email');
  perform assert(not ('phone' = any(cols)), 'verifier card exposes no phone');
  perform assert(not ('last_name' = any(cols)), 'verifier card exposes no surname');
  perform assert('last_initial' = any(cols), 'verifier card exposes only a last initial');

  perform assert(
    (select last_initial from verifier_public_cards limit 1) = 'M',
    'last initial is derived correctly from the surname');
end $$;

drop function assert(boolean, text);
drop function raises(text, uuid);
