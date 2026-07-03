-- Admin-managed gallery images shown on /gallery. Each row is one photo.
-- Seeded with the Cannes Lions 2026 set that previously lived as a
-- hardcoded array in src/app/gallery/page.tsx, so nothing is lost when
-- this table takes over. (Notting Hill Carnival 2024 and NYFW 2024 photo
-- files were removed from disk, so those sets aren't seeded here.)

create table if not exists public.gallery_images (
  id           uuid        primary key default gen_random_uuid(),
  event_key    text        not null,
  event_label  text        not null default '',
  caption      text        not null default '',
  location     text        not null default '',
  src          text        not null,
  large_src    text        not null,
  alt          text        not null default '',
  orientation  text        not null default 'landscape' check (orientation in ('portrait', 'landscape')),
  sort_order   integer     not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists gallery_images_event_key_idx on public.gallery_images (event_key);
create index if not exists gallery_images_sort_idx on public.gallery_images (event_key, sort_order, created_at);

alter table public.gallery_images enable row level security;

drop policy if exists "gallery_images_select_public" on public.gallery_images;
create policy "gallery_images_select_public"
  on public.gallery_images for select
  to anon, authenticated
  using (true);

-- Writes happen only through the /api/studio/gallery route using the
-- service-role key, so no insert/update/delete policy is needed here.

insert into public.gallery_images (event_key, event_label, caption, location, src, large_src, alt, orientation, sort_order)
values
  ('cannes-2026', 'Cannes Lions 2026', 'Opening Night', 'Cannes', '/events/cannes-lions-2026/UNIKday1-2.jpg', '/events/cannes-lions-2026/large/UNIKday1-2.jpg', 'Guest in a tailored blazer against a deep red backdrop', 'portrait', 0),
  ('cannes-2026', 'Cannes Lions 2026', 'The Room', 'Cannes', '/events/cannes-lions-2026/UNIKday1-22.jpg', '/events/cannes-lions-2026/large/UNIKday1-22.jpg', 'Guests gathered on a couch with champagne', 'landscape', 1),
  ('cannes-2026', 'Cannes Lions 2026', 'After Dark', 'Cannes', '/events/cannes-lions-2026/UNIKday1-77.jpg', '/events/cannes-lions-2026/large/UNIKday1-77.jpg', 'Guest laughing beneath the disco ball', 'portrait', 2),
  ('cannes-2026', 'Cannes Lions 2026', 'The Room', 'Cannes', '/events/cannes-lions-2026/UNIKday1-38.jpg', '/events/cannes-lions-2026/large/UNIKday1-38.jpg', 'Four guests posing together at a Culturin evening', 'landscape', 3),
  ('cannes-2026', 'Cannes Lions 2026', 'After Dark', 'Cannes', '/events/cannes-lions-2026/UNIKday1-26.jpg', '/events/cannes-lions-2026/large/UNIKday1-26.jpg', 'Disco balls above the crowd', 'portrait', 4),
  ('cannes-2026', 'Cannes Lions 2026', 'After Dark', 'Cannes', '/events/cannes-lions-2026/UNIKday2-14.jpg', '/events/cannes-lions-2026/large/UNIKday2-14.jpg', 'Guests laughing together beneath the disco balls', 'landscape', 5),
  ('cannes-2026', 'Cannes Lions 2026', 'Opening Night', 'Cannes', '/events/cannes-lions-2026/UNIKday1-61.jpg', '/events/cannes-lions-2026/large/UNIKday1-61.jpg', 'Guests laughing together near the entrance', 'portrait', 6),
  ('cannes-2026', 'Cannes Lions 2026', 'After Dark', 'Cannes', '/events/cannes-lions-2026/UNIKday1-54.jpg', '/events/cannes-lions-2026/large/UNIKday1-54.jpg', 'Candid dancing at a Culturin evening', 'landscape', 7),
  ('cannes-2026', 'Cannes Lions 2026', 'Opening Night', 'Cannes', '/events/cannes-lions-2026/UNIKday1-34.jpg', '/events/cannes-lions-2026/large/UNIKday1-34.jpg', 'Two guests portrait at the party', 'portrait', 8),
  ('cannes-2026', 'Cannes Lions 2026', 'The Room', 'Cannes', '/events/cannes-lions-2026/UNIKday1-46.jpg', '/events/cannes-lions-2026/large/UNIKday1-46.jpg', 'Guests mingling in a warm-lit lounge', 'landscape', 9),
  ('cannes-2026', 'Cannes Lions 2026', 'Night Two', 'Cannes', '/events/cannes-lions-2026/UNIKday2-4.jpg', '/events/cannes-lions-2026/large/UNIKday2-4.jpg', 'Guest in a yellow jersey lit by red smoke', 'portrait', 10),
  ('cannes-2026', 'Cannes Lions 2026', 'Night Two', 'Cannes', '/events/cannes-lions-2026/UNIKday2-22.jpg', '/events/cannes-lions-2026/large/UNIKday2-22.jpg', 'Couple posing at the branded wall', 'portrait', 11),
  ('cannes-2026', 'Cannes Lions 2026', 'Night Two', 'Cannes', '/events/cannes-lions-2026/UNIKday2-30.jpg', '/events/cannes-lions-2026/large/UNIKday2-30.jpg', 'Full dancefloor under disco balls late at night', 'landscape', 12),
  ('cannes-2026', 'Cannes Lions 2026', 'Night Two', 'Cannes', '/events/cannes-lions-2026/UNIKday2-12.jpg', '/events/cannes-lions-2026/large/UNIKday2-12.jpg', 'Group of guests at a Culturin gathering', 'landscape', 13),
  ('cannes-2026', 'Cannes Lions 2026', 'Night Two', 'Cannes', '/events/cannes-lions-2026/UNIKday2-34.jpg', '/events/cannes-lions-2026/large/UNIKday2-34.jpg', 'Two guests laughing together late at night', 'portrait', 14),
  ('cannes-2026', 'Cannes Lions 2026', 'The Room', 'Cannes', '/events/cannes-lions-2026/UNIKday2-13.jpg', '/events/cannes-lions-2026/large/UNIKday2-13.jpg', 'Guests smiling together in a red-lit lounge', 'landscape', 15)
on conflict do nothing;
