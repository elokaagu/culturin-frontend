-- Named image "slots" for hardcoded site imagery (homepage hero, gallery
-- preview grid, event hero photos) so they can be replaced from Studio
-- instead of requiring a code edit.
create table if not exists public.site_images (
  id uuid primary key default gen_random_uuid(),
  slot_key text unique not null,
  label text not null,
  src text not null,
  alt text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.site_images enable row level security;

-- Public pages (homepage, event pages) read these at render time.
drop policy if exists "site_images_select" on public.site_images;
create policy "site_images_select"
  on public.site_images for select
  to anon, authenticated
  using (true);
