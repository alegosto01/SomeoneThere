-- SomeoneThere — private storage buckets (spec §44)
--
-- `visit-media` must never be public. Objects are keyed as
--   <visit_id>/<report_id>/<filename>
-- so the first path segment identifies the visit whose access rules apply.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', false, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('visit-media', 'visit-media', false, 20971520,
   array['image/jpeg', 'image/png', 'image/webp', 'video/mp4'])
on conflict (id) do nothing;

-- ------------------------------------------------------------- avatars ----
create policy avatars_owner_read on storage.objects
  for select to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy avatars_owner_write on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy avatars_owner_update on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- --------------------------------------------------------- visit media ----
-- Customers read media for their own visits; verifiers read media for visits
-- assigned to them. Nobody else can produce a signed URL for these objects.
create policy visit_media_read on storage.objects
  for select to authenticated
  using (
    bucket_id = 'visit-media'
    and can_read_visit(((storage.foldername(name))[1])::uuid)
  );

-- Only the assigned verifier uploads, and only when photo consent was recorded.
create policy visit_media_verifier_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'visit-media'
    and exists (
      select 1 from visits v
      where v.id = ((storage.foldername(name))[1])::uuid
        and v.verifier_id = auth.uid()
        and v.photos_allowed = true
    )
  );

create policy visit_media_verifier_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'visit-media'
    and exists (
      select 1 from visits v
      where v.id = ((storage.foldername(name))[1])::uuid
        and v.verifier_id = auth.uid()
    )
  );
