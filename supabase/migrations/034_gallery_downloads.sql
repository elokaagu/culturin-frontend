-- Tracks who downloaded which gallery photo, gated by the download form on /gallery.
create table if not exists public.gallery_downloads (
  id uuid primary key default gen_random_uuid(),
  image_src text not null,
  image_alt text,
  first_name text not null,
  last_name text not null,
  email text not null,
  created_at timestamptz not null default now()
);

create index if not exists gallery_downloads_created_at_idx on public.gallery_downloads (created_at desc);
create index if not exists gallery_downloads_image_src_idx on public.gallery_downloads (image_src);

alter table public.gallery_downloads enable row level security;

-- Anyone can log a download (the public gallery has no auth), but only the
-- service role (Studio) can read the list back — no public select policy.
drop policy if exists "gallery_downloads_insert" on public.gallery_downloads;
create policy "gallery_downloads_insert"
  on public.gallery_downloads for insert
  to anon, authenticated
  with check (true);
