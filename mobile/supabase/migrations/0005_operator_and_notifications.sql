-- SomeoneThere — operator actions and the notification trigger
--
-- Two related gaps closed here.
--
-- 1. Several v1 flows have no app UI and are done by an operator from the
--    Supabase dashboard (spec §4.3): confirming access, assigning a verifier,
--    opening the live call. Doing those as raw UPDATEs is easy to get wrong —
--    the status and the visit_events row must move together, and the events are
--    what the customer's timeline and notifications are built from. These RPCs
--    make each action one call that cannot half-apply.
--
-- 2. Nothing called the `notify` Edge Function, so no push notification could
--    ever fire. A trigger on visit_events now does.

-- ------------------------------------------------------------ operators ----
-- Operators act either as an admin JWT or directly in SQL (dashboard, psql),
-- where auth.uid() is null. Both are trusted; anyone else is not. This mirrors
-- the rule already used by prevent_role_self_change.
create or replace function is_operator()
returns boolean
language sql
stable
as $$
  select auth.uid() is null or is_admin();
$$;

create or replace function require_operator()
returns void
language plpgsql
stable
as $$
begin
  if not is_operator() then
    raise exception 'this action is restricted to operators';
  end if;
end;
$$;

-- Confirm (or fail) third-party access with the property contact.
create or replace function admin_set_access(
  p_visit_id uuid,
  p_confirmed boolean,
  p_note text default null
)
returns visits
language plpgsql
security definer
set search_path = public
as $$
declare
  v visits;
begin
  perform require_operator();

  select * into v from visits where id = p_visit_id for update;
  if not found then
    raise exception 'visit not found';
  end if;

  perform set_config('someonethere.trusted_transition', 'on', true);
  update visits
     set access_confirmed = p_confirmed,
         status = case
                    when p_confirmed then 'access_confirmed'::visit_status
                    else 'access_failed'::visit_status
                  end
   where id = p_visit_id
  returning * into v;
  perform set_config('someonethere.trusted_transition', 'off', true);

  insert into visit_events (visit_id, event_type, actor_id, metadata)
  values (
    p_visit_id,
    case when p_confirmed then 'access_confirmed'::visit_event_type
         else 'access_failed'::visit_event_type end,
    auth.uid(),
    case when p_note is null then '{}'::jsonb else jsonb_build_object('note', p_note) end
  );

  return v;
end;
$$;

-- Assign a verifier. Refuses anyone who is not an active verifier, which is the
-- mistake a dashboard UPDATE makes easiest.
create or replace function admin_assign_verifier(p_visit_id uuid, p_verifier_id uuid)
returns visits
language plpgsql
security definer
set search_path = public
as $$
declare
  v visits;
begin
  perform require_operator();

  if not exists (
    select 1 from profiles p
    join verifier_profiles vp on vp.user_id = p.id
    where p.id = p_verifier_id and p.role = 'verifier' and vp.active
  ) then
    raise exception 'user % is not an active verifier', p_verifier_id;
  end if;

  select * into v from visits where id = p_visit_id for update;
  if not found then
    raise exception 'visit not found';
  end if;
  if not v.access_confirmed then
    raise exception 'confirm access before assigning a verifier';
  end if;

  perform set_config('someonethere.trusted_transition', 'on', true);
  update visits
     set verifier_id = p_verifier_id, status = 'verifier_assigned'
   where id = p_visit_id
  returning * into v;
  perform set_config('someonethere.trusted_transition', 'off', true);

  insert into visit_events (visit_id, event_type, actor_id, metadata)
  values (p_visit_id, 'verifier_assigned', auth.uid(),
          jsonb_build_object('verifier_id', p_verifier_id));

  return v;
end;
$$;

-- Attach the external meeting link, and separately mark it joinable. These are
-- two steps on purpose: the customer's Join button must not light up just
-- because a URL exists (spec §17).
create or replace function admin_set_live_call(
  p_visit_id uuid,
  p_url text,
  p_provider live_call_provider default 'google_meet'
)
returns visits
language plpgsql
security definer
set search_path = public
as $$
declare
  v visits;
begin
  perform require_operator();

  if p_url !~* '^https://' then
    raise exception 'live call url must be https';
  end if;

  update visits
     set live_call_url = p_url, live_call_provider = p_provider
   where id = p_visit_id
  returning * into v;
  if not found then
    raise exception 'visit not found';
  end if;

  return v;
end;
$$;

create or replace function admin_set_live_call_ready(p_visit_id uuid, p_ready boolean)
returns visits
language plpgsql
security definer
set search_path = public
as $$
declare
  v visits;
begin
  perform require_operator();

  select * into v from visits where id = p_visit_id for update;
  if not found then
    raise exception 'visit not found';
  end if;
  if p_ready and v.live_call_url is null then
    raise exception 'set a live call url before marking the call ready';
  end if;

  perform set_config('someonethere.trusted_transition', 'on', true);
  update visits
     set live_call_ready = p_ready,
         status = case when p_ready then 'live'::visit_status else v.status end
   where id = p_visit_id
  returning * into v;
  perform set_config('someonethere.trusted_transition', 'off', true);

  if p_ready then
    insert into visit_events (visit_id, event_type, actor_id)
    values (p_visit_id, 'live_started', auth.uid());
  else
    insert into visit_events (visit_id, event_type, actor_id)
    values (p_visit_id, 'live_ended', auth.uid());
  end if;

  return v;
end;
$$;

create or replace function admin_cancel_visit(
  p_visit_id uuid,
  p_reason cancellation_reason
)
returns visits
language plpgsql
security definer
set search_path = public
as $$
declare
  v visits;
begin
  perform require_operator();

  perform set_config('someonethere.trusted_transition', 'on', true);
  update visits
     set status = 'cancelled', cancellation_reason = p_reason, live_call_ready = false
   where id = p_visit_id
  returning * into v;
  perform set_config('someonethere.trusted_transition', 'off', true);

  if not found then
    raise exception 'visit not found';
  end if;

  insert into visit_events (visit_id, event_type, actor_id, metadata)
  values (p_visit_id, 'visit_cancelled', auth.uid(),
          jsonb_build_object('reason', p_reason));

  return v;
end;
$$;

-- Promote a user to verifier and open their verifier profile in one step.
create or replace function admin_make_verifier(
  p_user_id uuid,
  p_languages text[] default array['es', 'en']
)
returns verifier_profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  vp verifier_profiles;
begin
  perform require_operator();

  update profiles set role = 'verifier' where id = p_user_id;
  if not found then
    raise exception 'user not found';
  end if;

  insert into verifier_profiles (user_id, languages)
  values (p_user_id, p_languages)
  on conflict (user_id) do update set languages = excluded.languages
  returning * into vp;

  return vp;
end;
$$;

revoke execute on function admin_set_access(uuid, boolean, text) from anon, authenticated;
revoke execute on function admin_assign_verifier(uuid, uuid) from anon, authenticated;
revoke execute on function admin_set_live_call(uuid, text, live_call_provider) from anon, authenticated;
revoke execute on function admin_set_live_call_ready(uuid, boolean) from anon, authenticated;
revoke execute on function admin_cancel_visit(uuid, cancellation_reason) from anon, authenticated;
revoke execute on function admin_make_verifier(uuid, text[]) from anon, authenticated;

-- -------------------------------------------------------- notifications ----
-- Calls the `notify` Edge Function whenever a visit event is recorded, so the
-- customer hears about it even with the app closed (spec §38, §64).
--
-- The function URL and service key come from Vault rather than being written
-- into this migration — they are secrets, and migrations are in git. Set them
-- once per project:
--
--   select vault.create_secret('https://<ref>.supabase.co/functions/v1/notify',
--                              'notify_function_url');
--   select vault.create_secret('<service_role_key>', 'notify_service_key');
--
-- Until both exist the trigger does nothing, which is what keeps local
-- development and the SQL test harness working.
create or replace function notify_visit_event()
returns trigger
language plpgsql
security definer
set search_path = public, extensions, vault
as $$
declare
  fn_url text;
  service_key text;
begin
  select decrypted_secret into fn_url
    from vault.decrypted_secrets where name = 'notify_function_url';
  select decrypted_secret into service_key
    from vault.decrypted_secrets where name = 'notify_service_key';

  if fn_url is null or service_key is null then
    return new;
  end if;

  perform net.http_post(
    url := fn_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_key
    ),
    body := jsonb_build_object('type', 'INSERT', 'record', to_jsonb(new)),
    timeout_milliseconds := 5000
  );

  return new;
exception when others then
  -- A notification is not worth losing the event that caused it: if the call
  -- fails the visit_events row must still be committed, and the customer can
  -- still see the change in the app.
  raise warning 'notify_visit_event failed: %', sqlerrm;
  return new;
end;
$$;

create trigger visit_events_notify
  after insert on visit_events
  for each row execute function notify_visit_event();
