-- SomeoneThere — core schema (spec §42)
-- Timestamps are UTC everywhere; rendering in Europe/Madrid happens in the app.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- enums ----
create type user_role as enum ('customer', 'verifier', 'admin');

create type visit_status as enum (
  'draft', 'payment_pending', 'request_received', 'access_pending',
  'access_confirmed', 'verifier_pending', 'verifier_assigned',
  'verifier_en_route', 'verifier_arrived', 'live', 'visit_completed',
  'report_pending', 'report_ready', 'cancelled', 'access_failed', 'refunded'
);

create type property_type as enum ('room', 'studio', 'apartment', 'other');
create type contact_type as enum ('landlord', 'agent', 'tenant', 'other');
create type listing_match as enum (
  'consistent', 'minor_differences', 'major_differences', 'unable_to_determine'
);
create type observation_rating as enum (
  'good', 'acceptable', 'concern', 'not_checked', 'not_applicable'
);
create type answer_source as enum ('landlord', 'agent', 'tenant', 'other');
create type cancellation_reason as enum (
  'customer_cancelled', 'property_contact_cancelled', 'verifier_cancelled',
  'access_denied', 'no_show', 'other'
);
create type payment_status as enum (
  'requires_payment_method', 'processing', 'succeeded', 'failed',
  'refunded', 'partially_refunded'
);
create type media_type as enum ('photo', 'video', 'document');
create type live_call_provider as enum ('google_meet', 'whatsapp', 'zoom', 'other');
create type visit_event_type as enum (
  'booking_received', 'access_confirmed', 'access_failed', 'verifier_assigned',
  'verifier_en_route', 'verifier_arrived', 'live_started', 'live_ended',
  'visit_completed', 'report_ready', 'visit_cancelled', 'refund_issued'
);

-- ------------------------------------------------------------- utility ----
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ------------------------------------------------------------- profiles ----
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role user_role not null default 'customer',
  first_name text,
  last_name text,
  email text,
  phone text,
  avatar_url text,
  preferred_language text default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger profiles_updated_at before update on profiles
  for each row execute function set_updated_at();

-- New auth users get a customer profile automatically; verifier/admin roles are
-- granted by an operator through the Supabase dashboard (spec §4.3).
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

create table verifier_profiles (
  user_id uuid primary key references profiles (id) on delete cascade,
  bio text,
  identity_verified boolean not null default false,
  languages text[] not null default '{}',
  completed_visits integer not null default 0,
  average_rating numeric(2, 1),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger verifier_profiles_updated_at before update on verifier_profiles
  for each row execute function set_updated_at();

-- ----------------------------------------------------------- properties ----
create table properties (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references profiles (id) on delete cascade,
  listing_url text,
  address_line text not null,
  city text not null default 'Madrid',
  postal_code text,
  neighborhood text,
  property_type property_type not null default 'apartment',
  advertised_rent numeric(10, 2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index properties_customer_id_idx on properties (customer_id);
create trigger properties_updated_at before update on properties
  for each row execute function set_updated_at();

-- --------------------------------------------------------------- visits ----
create table visits (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references profiles (id) on delete cascade,
  property_id uuid not null references properties (id) on delete cascade,
  verifier_id uuid references profiles (id) on delete set null,
  scheduled_at timestamptz not null,
  expected_duration_minutes integer not null default 30,
  status visit_status not null default 'draft',
  live_call_url text,
  live_call_provider live_call_provider,
  -- Set by verifier/operator when the call is actually ready to join (spec §17).
  live_call_ready boolean not null default false,
  -- `*_requested` is what the customer asked for. `*_allowed` is what the
  -- property contact consented to on site. A request is never consent (spec §63).
  recording_requested boolean not null default false,
  recording_allowed boolean not null default false,
  photos_requested boolean not null default true,
  photos_allowed boolean not null default false,
  access_confirmed boolean not null default false,
  customer_notes text,
  cancellation_reason cancellation_reason,
  checked_in_at timestamptz,
  checked_out_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint recording_requires_consent
    check (recording_allowed = false or recording_requested = true)
);
create index visits_customer_id_idx on visits (customer_id);
create index visits_verifier_id_idx on visits (verifier_id);
create index visits_scheduled_at_idx on visits (scheduled_at);
create trigger visits_updated_at before update on visits
  for each row execute function set_updated_at();

create table property_contacts (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid not null references visits (id) on delete cascade,
  name text,
  contact_type contact_type not null default 'landlord',
  phone text,
  email text,
  created_at timestamptz not null default now()
);
create index property_contacts_visit_id_idx on property_contacts (visit_id);

create table visit_priorities (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid not null references visits (id) on delete cascade,
  priority_key text not null,
  selected boolean not null default true,
  customer_note text,
  unique (visit_id, priority_key)
);
create index visit_priorities_visit_id_idx on visit_priorities (visit_id);

create table visit_events (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid not null references visits (id) on delete cascade,
  event_type visit_event_type not null,
  actor_id uuid references profiles (id) on delete set null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index visit_events_visit_id_idx on visit_events (visit_id, created_at);

-- -------------------------------------------------------------- reports ----
create table reports (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid not null unique references visits (id) on delete cascade,
  listing_match listing_match,
  verifier_summary text,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger reports_updated_at before update on reports
  for each row execute function set_updated_at();

create table report_observations (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references reports (id) on delete cascade,
  category text not null,
  rating observation_rating not null default 'not_checked',
  note text,
  sort_order integer not null default 0,
  unique (report_id, category)
);
create index report_observations_report_id_idx on report_observations (report_id);

create table report_differences (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references reports (id) on delete cascade,
  description text not null,
  severity text
);
create index report_differences_report_id_idx on report_differences (report_id);

create table report_questions (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references reports (id) on delete cascade,
  question text not null,
  answer text,
  answer_source answer_source
);
create index report_questions_report_id_idx on report_questions (report_id);

create table report_unchecked_areas (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references reports (id) on delete cascade,
  description text not null
);
create index report_unchecked_areas_report_id_idx on report_unchecked_areas (report_id);

create table report_media (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references reports (id) on delete cascade,
  storage_path text not null,
  media_type media_type not null default 'photo',
  caption text,
  created_at timestamptz not null default now()
);
create index report_media_report_id_idx on report_media (report_id);

-- ------------------------------------------------------------- payments ----
create table payments (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid not null references visits (id) on delete cascade,
  customer_id uuid not null references profiles (id) on delete cascade,
  stripe_payment_intent_id text unique,
  amount numeric(10, 2) not null,
  currency text not null default 'EUR',
  status payment_status not null default 'requires_payment_method',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index payments_visit_id_idx on payments (visit_id);
create trigger payments_updated_at before update on payments
  for each row execute function set_updated_at();

-- -------------------------------------------------------- device tokens ----
create table device_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  platform text not null,
  token text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index device_tokens_user_id_idx on device_tokens (user_id);
create trigger device_tokens_updated_at before update on device_tokens
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------- views ----
-- Exactly the verifier fields a customer may see (spec §16). Customers never
-- select from `profiles` or `verifier_profiles` directly.
create view verifier_public_cards
with (security_invoker = off) as
select
  p.id as user_id,
  coalesce(p.first_name, '') as first_name,
  upper(left(coalesce(p.last_name, ''), 1)) as last_initial,
  p.avatar_url,
  vp.identity_verified,
  vp.languages,
  vp.bio,
  vp.completed_visits,
  vp.average_rating
from profiles p
join verifier_profiles vp on vp.user_id = p.id
where p.role = 'verifier';

-- --------------------------------------------------------------- grants ----
-- PostgREST connects as `authenticated` (or `anon`), and a role with no table
-- privileges gets "permission denied" before RLS is ever consulted. Supabase
-- sets similar defaults for new projects, but relying on that is fragile: it
-- did not cover these tables, and the whole API returned 42501 until this was
-- made explicit.
--
-- These are deliberately narrower than the Supabase default, which also grants
-- to `anon`. Nothing here is readable without a session — sign-up and sign-in
-- go through GoTrue, not PostgREST — so `anon` needs no table access at all.
-- RLS, not GRANTs, is what decides which rows a signed-in user may see.
grant usage on schema public to authenticated, service_role;
grant all on all tables in schema public to authenticated, service_role;
grant all on all sequences in schema public to authenticated, service_role;
grant all on all functions in schema public to authenticated, service_role;
