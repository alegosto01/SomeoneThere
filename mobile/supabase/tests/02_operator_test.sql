-- Operator RPCs and the notification trigger.

create or replace function assert(condition boolean, description text)
returns void language plpgsql as $$
begin
  if not condition then
    raise exception 'FAIL: %', description;
  end if;
  raise notice 'ok  %', description;
end $$;

create or replace function raises(stmt text, uid uuid)
returns boolean language plpgsql as $$
begin
  perform set_config('role', 'authenticated', true);
  perform set_config('request.jwt.claims', json_build_object('sub', uid)::text, true);
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

-- Operator-only access.
do $$
declare
  customer uuid := '11111111-1111-1111-1111-111111111111';
  verifier uuid := '22222222-2222-2222-2222-222222222222';
  target uuid;
begin
  select id into target from visits limit 1;

  perform assert(
    raises(format('select admin_set_access(%L, true)', target), customer),
    'a customer CANNOT confirm access');
  perform assert(
    raises(format('select admin_assign_verifier(%L, %L)', target, verifier), verifier),
    'a verifier CANNOT assign themselves to a visit');
  perform assert(
    raises(format('select admin_cancel_visit(%L, ''other'')', target), customer),
    'a customer CANNOT cancel through the operator RPC');
  perform assert(
    raises(format('select admin_make_verifier(%L)', customer), customer),
    'a customer CANNOT promote themselves through the operator RPC');
end $$;

-- The happy path an operator actually walks, in order.
do $$
declare
  verifier uuid := '22222222-2222-2222-2222-222222222222';
  target uuid;
  v visits;
  before_count integer;
begin
  select id into target from visits where status = 'verifier_pending' limit 1;
  update visits set access_confirmed = false, verifier_id = null,
                    live_call_url = null, live_call_ready = false
   where id = target;

  -- Assigning before access is confirmed is the ordering mistake this is meant
  -- to prevent.
  begin
    perform admin_assign_verifier(target, verifier);
    raise exception 'FAIL: assigned a verifier before access was confirmed';
  exception when others then
    if sqlerrm like 'FAIL%' then raise; end if;
    perform assert(sqlerrm like '%confirm access before%',
      'assigning a verifier is refused until access is confirmed');
  end;

  select * into v from admin_set_access(target, true);
  perform assert(v.access_confirmed, 'admin_set_access confirms access');
  perform assert(v.status = 'access_confirmed', 'admin_set_access moves the status');
  perform assert(
    exists (select 1 from visit_events
             where visit_id = target and event_type = 'access_confirmed'),
    'admin_set_access records an access_confirmed event');

  select * into v from admin_assign_verifier(target, verifier);
  perform assert(v.verifier_id = verifier, 'admin_assign_verifier assigns');
  perform assert(v.status = 'verifier_assigned', 'admin_assign_verifier moves the status');

  -- Marking the call ready before there is a URL would light up the customer's
  -- Join button with nothing behind it.
  begin
    perform admin_set_live_call_ready(target, true);
    raise exception 'FAIL: marked a call ready with no url';
  exception when others then
    if sqlerrm like 'FAIL%' then raise; end if;
    perform assert(sqlerrm like '%set a live call url%',
      'the call cannot be marked ready before a url exists');
  end;

  begin
    perform admin_set_live_call(target, 'http://meet.example.com/x');
    raise exception 'FAIL: accepted a non-https live call url';
  exception when others then
    if sqlerrm like 'FAIL%' then raise; end if;
    perform assert(sqlerrm like '%https%', 'the live call url must be https');
  end;

  select * into v from admin_set_live_call(target, 'https://meet.google.com/abc-defg-hij');
  perform assert(v.live_call_url is not null, 'admin_set_live_call stores the url');
  perform assert(v.live_call_ready = false,
    'storing a url does NOT by itself make the call joinable');

  select * into v from admin_set_live_call_ready(target, true);
  perform assert(v.live_call_ready, 'admin_set_live_call_ready opens the call');
end $$;

-- Assigning someone who is not a verifier.
do $$
declare
  customer uuid := '11111111-1111-1111-1111-111111111111';
  target uuid;
begin
  select id into target from visits where access_confirmed limit 1;
  begin
    perform admin_assign_verifier(target, customer);
    raise exception 'FAIL: assigned a customer as the verifier';
  exception when others then
    if sqlerrm like 'FAIL%' then raise; end if;
    perform assert(sqlerrm like '%not an active verifier%',
      'only an active verifier can be assigned to a visit');
  end;
end $$;

-- The notification trigger.
do $$
declare
  target uuid;
  n integer;
  last_body jsonb;
begin
  select id into target from visits limit 1;

  -- With no secrets configured the trigger must be inert, so local development
  -- and this harness are not trying to call a real endpoint.
  delete from net.sent_requests;
  insert into visit_events (visit_id, event_type) values (target, 'verifier_en_route');
  select count(*) into n from net.sent_requests;
  perform assert(n = 0, 'no notification is attempted when Vault has no secrets');

  insert into vault.decrypted_secrets (name, decrypted_secret)
  values ('notify_function_url', 'https://example.supabase.co/functions/v1/notify'),
         ('notify_service_key', 'service-role-key')
  on conflict (name) do update set decrypted_secret = excluded.decrypted_secret;

  delete from net.sent_requests;
  insert into visit_events (visit_id, event_type) values (target, 'verifier_arrived');

  select count(*) into n from net.sent_requests;
  perform assert(n = 1, 'recording a visit event calls the notify function');

  select body into last_body from net.sent_requests order by id desc limit 1;
  perform assert(last_body -> 'record' ->> 'event_type' = 'verifier_arrived',
    'the notify payload carries the event type');
  perform assert((last_body -> 'record' ->> 'visit_id')::uuid = target,
    'the notify payload carries the visit id');
  perform assert(last_body ->> 'type' = 'INSERT',
    'the notify payload uses the database-webhook shape the function expects');
  perform assert(
    (select headers ->> 'Authorization' from net.sent_requests order by id desc limit 1)
      = 'Bearer service-role-key',
    'the notify call is authenticated with the service key');
end $$;

-- A failing notification must not roll back the event that triggered it.
do $$
declare
  target uuid;
  before_events integer;
begin
  select id into target from visits limit 1;
  select count(*) into before_events from visit_events where visit_id = target;

  -- Make the outbound call blow up.
  create or replace function net.http_post(
    url text, body jsonb default '{}', params jsonb default '{}',
    headers jsonb default '{}', timeout_milliseconds integer default 5000
  ) returns bigint language plpgsql as $f$
  begin
    raise exception 'network unreachable';
  end $f$;

  insert into visit_events (visit_id, event_type) values (target, 'visit_completed');

  perform assert(
    (select count(*) from visit_events where visit_id = target) = before_events + 1,
    'the visit event survives a failed notification');
end $$;

drop function assert(boolean, text);
drop function raises(text, uuid);
