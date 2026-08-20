-- Stubs for the parts of a Supabase database that the platform provides.
--
-- NOT part of the deployed schema — this file exists so the migrations can be
-- applied to a plain Postgres container and exercised. On a real project these
-- objects are created by GoTrue and Storage.
create extension if not exists "pgcrypto";

create schema if not exists auth;
create schema if not exists storage;

do $$ begin
  create role anon;              exception when duplicate_object then null; end $$;
do $$ begin
  create role authenticated;     exception when duplicate_object then null; end $$;
do $$ begin
  create role service_role bypassrls; exception when duplicate_object then null; end $$;

-- Supabase grants table privileges to these roles by default and relies on RLS
-- (not GRANTs) to gate access. The migrations assume this, so reproduce it here
-- or every policy-protected query fails with "permission denied" instead.
grant usage on schema public to anon, authenticated, service_role;
grant usage on schema auth to anon, authenticated, service_role;
alter default privileges in schema public
  grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public
  grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema public
  grant all on functions to anon, authenticated, service_role;

create table if not exists auth.users (
  id uuid primary key default gen_random_uuid(),
  instance_id uuid,
  aud text,
  role text,
  email text unique,
  encrypted_password text,
  email_confirmed_at timestamptz,
  raw_user_meta_data jsonb default '{}',
  created_at timestamptz default now()
);

-- Mirrors GoTrue: reads the uid out of the request's JWT claims. Tests set the
-- claim with `set local request.jwt.claims`.
-- Tolerates an unset or empty claim, which happens between test blocks and in
-- any direct-SQL session; casting '' to jsonb would otherwise raise.
create or replace function auth.uid()
returns uuid
language sql
stable
as $$
  select nullif(
    nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub', ''
  )::uuid;
$$;

create or replace function auth.role()
returns text
language sql
stable
as $$
  select coalesce(
    nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role', 'anon'
  );
$$;

create table if not exists storage.buckets (
  id text primary key,
  name text not null,
  public boolean default false,
  file_size_limit bigint,
  allowed_mime_types text[],
  created_at timestamptz default now()
);

create table if not exists storage.objects (
  id uuid primary key default gen_random_uuid(),
  bucket_id text references storage.buckets (id),
  name text,
  owner uuid,
  created_at timestamptz default now()
);
alter table storage.objects enable row level security;

-- Splits an object key into path segments, as the Storage extension does.
-- Supabase grants these to the API roles and gates access with RLS, exactly as
-- it does for the public schema.
grant usage on schema storage to anon, authenticated, service_role;
grant all on storage.objects to anon, authenticated, service_role;
grant all on storage.buckets to anon, authenticated, service_role;

create or replace function storage.foldername(name text)
returns text[]
language sql
immutable
as $$
  select string_to_array(name, '/');
$$;


-- ---------------------------------------------------------- vault / net ----
-- Supabase Vault holds the notify secrets; pg_net makes the outbound call.
-- Stubbed here so the notification trigger can be exercised: http_post records
-- the call instead of making it, and the test asserts on what was recorded.
create schema if not exists vault;
create schema if not exists extensions;
create schema if not exists net;

create table if not exists vault.decrypted_secrets (
  name text primary key,
  decrypted_secret text not null
);

create table if not exists net.sent_requests (
  id bigserial primary key,
  url text,
  headers jsonb,
  body jsonb,
  created_at timestamptz default now()
);

create or replace function net.http_post(
  url text,
  body jsonb default '{}',
  params jsonb default '{}',
  headers jsonb default '{}',
  timeout_milliseconds integer default 5000
)
returns bigint
language plpgsql
as $$
declare
  new_id bigint;
begin
  insert into net.sent_requests (url, headers, body)
  values (url, headers, body)
  returning id into new_id;
  return new_id;
end;
$$;

grant usage on schema vault, net, extensions to anon, authenticated, service_role;
