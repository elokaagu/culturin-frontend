-- Public bucket for images served via /storage/v1/object/public/media/...
-- Upload is restricted to signed-in users; reads are public.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "media_select_anon" on storage.objects;
create policy "media_select_anon"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'media');

drop policy if exists "media_insert_auth" on storage.objects;
create policy "media_insert_auth"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'media'
    and split_part(name, '/', 1) = (auth.uid())::text
  );

drop policy if exists "media_update_own" on storage.objects;
create policy "media_update_own"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'media' and split_part(name, '/', 1) = (auth.uid())::text);

drop policy if exists "media_delete_own" on storage.objects;
create policy "media_delete_own"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'media' and split_part(name, '/', 1) = (auth.uid())::text);
