-- Admin-managed gallery images shown on /gallery. Each row is one photo.
-- Seeded with the existing Cannes Lions 2026, Notting Hill Carnival 2024,
-- and NYFW 2024 sets that previously lived as hardcoded arrays in
-- src/app/gallery/page.tsx, so nothing is lost when this table takes over.

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
  ('cannes-2026', 'Cannes Lions 2026', 'After Dark', 'Cannes', '/events/cannes-lions-2026/UNIKday1-58.jpg', '/events/cannes-lions-2026/large/UNIKday1-58.jpg', 'DJ performing under a disco ball in red light', 'portrait', 2),
  ('cannes-2026', 'Cannes Lions 2026', 'The Room', 'Cannes', '/events/cannes-lions-2026/UNIKday1-38.jpg', '/events/cannes-lions-2026/large/UNIKday1-38.jpg', 'Four guests posing together at a Culturin evening', 'landscape', 3),
  ('cannes-2026', 'Cannes Lions 2026', 'After Dark', 'Cannes', '/events/cannes-lions-2026/UNIKday1-26.jpg', '/events/cannes-lions-2026/large/UNIKday1-26.jpg', 'Disco balls above the crowd', 'portrait', 4),
  ('cannes-2026', 'Cannes Lions 2026', 'After Dark', 'Cannes', '/events/cannes-lions-2026/UNIKday1-62.jpg', '/events/cannes-lions-2026/large/UNIKday1-62.jpg', 'Red-lit crowd on the dancefloor', 'landscape', 5),
  ('cannes-2026', 'Cannes Lions 2026', 'Opening Night', 'Cannes', '/events/cannes-lions-2026/UNIKday1-14.jpg', '/events/cannes-lions-2026/large/UNIKday1-14.jpg', 'Couple portrait against a red-lit backdrop', 'portrait', 6),
  ('cannes-2026', 'Cannes Lions 2026', 'After Dark', 'Cannes', '/events/cannes-lions-2026/UNIKday1-54.jpg', '/events/cannes-lions-2026/large/UNIKday1-54.jpg', 'Candid dancing at a Culturin evening', 'landscape', 7),
  ('cannes-2026', 'Cannes Lions 2026', 'Opening Night', 'Cannes', '/events/cannes-lions-2026/UNIKday1-34.jpg', '/events/cannes-lions-2026/large/UNIKday1-34.jpg', 'Two guests portrait at the party', 'portrait', 8),
  ('cannes-2026', 'Cannes Lions 2026', 'The Room', 'Cannes', '/events/cannes-lions-2026/UNIKday1-46.jpg', '/events/cannes-lions-2026/large/UNIKday1-46.jpg', 'Guests mingling in a warm-lit lounge', 'landscape', 9),
  ('cannes-2026', 'Cannes Lions 2026', 'Night Two', 'Cannes', '/events/cannes-lions-2026/UNIKday2-4.jpg', '/events/cannes-lions-2026/large/UNIKday2-4.jpg', 'Guest in a yellow jersey lit by red smoke', 'portrait', 10),
  ('cannes-2026', 'Cannes Lions 2026', 'Night Two', 'Cannes', '/events/cannes-lions-2026/UNIKday2-22.jpg', '/events/cannes-lions-2026/large/UNIKday2-22.jpg', 'Couple posing at the branded wall', 'portrait', 11),
  ('cannes-2026', 'Cannes Lions 2026', 'Night Two', 'Cannes', '/events/cannes-lions-2026/UNIKday2-30.jpg', '/events/cannes-lions-2026/large/UNIKday2-30.jpg', 'Full dancefloor under disco balls late at night', 'landscape', 12),
  ('cannes-2026', 'Cannes Lions 2026', 'Night Two', 'Cannes', '/events/cannes-lions-2026/UNIKday2-12.jpg', '/events/cannes-lions-2026/large/UNIKday2-12.jpg', 'Group of guests at a Culturin gathering', 'landscape', 13),
  ('cannes-2026', 'Cannes Lions 2026', 'Night Two', 'Cannes', '/events/cannes-lions-2026/UNIKday2-34.jpg', '/events/cannes-lions-2026/large/UNIKday2-34.jpg', 'Two guests laughing together late at night', 'portrait', 14),
  ('cannes-2026', 'Cannes Lions 2026', 'After Dark', 'Cannes', '/events/cannes-lions-2026/UNIKday1-70.jpg', '/events/cannes-lions-2026/large/UNIKday1-70.jpg', 'Guests dancing under disco balls with phones raised', 'landscape', 15),
  ('notting-hill-2024', 'Notting Hill Carnival', 'Carnival Weekend', 'London', '/events/notting-hill-carnival-2024/nhc-1.jpg', '/events/notting-hill-carnival-2024/large/nhc-1.jpg', 'DJ Tim Adé performing at the Carnival weekend after-party', 'landscape', 0),
  ('notting-hill-2024', 'Notting Hill Carnival', 'Carnival Weekend', 'London', '/events/notting-hill-carnival-2024/nhc-2.jpg', '/events/notting-hill-carnival-2024/large/nhc-2.jpg', 'Guests gathered in a warm-lit lounge', 'landscape', 1),
  ('notting-hill-2024', 'Notting Hill Carnival', 'Carnival Weekend', 'London', '/events/notting-hill-carnival-2024/nhc-3.jpg', '/events/notting-hill-carnival-2024/large/nhc-3.jpg', 'Guests dancing together at the after-party', 'portrait', 2),
  ('notting-hill-2024', 'Notting Hill Carnival', 'Carnival Weekend', 'London', '/events/notting-hill-carnival-2024/nhc-4.jpg', '/events/notting-hill-carnival-2024/large/nhc-4.jpg', 'Storefront signage for the venue at night', 'landscape', 3),
  ('notting-hill-2024', 'Notting Hill Carnival', 'Carnival Weekend', 'London', '/events/notting-hill-carnival-2024/nhc-5.jpg', '/events/notting-hill-carnival-2024/large/nhc-5.jpg', 'Guest in a colourful printed outfit', 'portrait', 4),
  ('notting-hill-2024', 'Notting Hill Carnival', 'Carnival Weekend', 'London', '/events/notting-hill-carnival-2024/nhc-6.jpg', '/events/notting-hill-carnival-2024/large/nhc-6.jpg', 'Group of four guests in colourful attire', 'landscape', 5),
  ('notting-hill-2024', 'Notting Hill Carnival', 'Carnival Weekend', 'London', '/events/notting-hill-carnival-2024/nhc-7.jpg', '/events/notting-hill-carnival-2024/large/nhc-7.jpg', 'A second DJ set at the after-party', 'landscape', 6),
  ('notting-hill-2024', 'Notting Hill Carnival', 'Carnival Weekend', 'London', '/events/notting-hill-carnival-2024/nhc-8.jpg', '/events/notting-hill-carnival-2024/large/nhc-8.jpg', 'Guests in elaborate carnival-inspired outfits', 'portrait', 7),
  ('nyfw-2024', 'NY Fashion Week', 'NY Fashion Week', 'New York', '/events/nyfw-2024/nyfw-1.jpg', '/events/nyfw-2024/large/nyfw-1.jpg', 'Models walking in a red-lit venue during Fashion Week', 'landscape', 0),
  ('nyfw-2024', 'NY Fashion Week', 'NY Fashion Week', 'New York', '/events/nyfw-2024/nyfw-2.jpg', '/events/nyfw-2024/large/nyfw-2.jpg', 'A performer on the mic during the night', 'landscape', 1),
  ('nyfw-2024', 'NY Fashion Week', 'NY Fashion Week', 'New York', '/events/nyfw-2024/nyfw-3.jpg', '/events/nyfw-2024/large/nyfw-3.jpg', 'DJ booth at a red-lit Fashion Week night', 'landscape', 2),
  ('nyfw-2024', 'NY Fashion Week', 'NY Fashion Week', 'New York', '/events/nyfw-2024/nyfw-4.jpg', '/events/nyfw-2024/large/nyfw-4.jpg', 'DJ mixing with hand raised', 'landscape', 3),
  ('nyfw-2024', 'NY Fashion Week', 'NY Fashion Week', 'New York', '/events/nyfw-2024/nyfw-5.jpg', '/events/nyfw-2024/large/nyfw-5.jpg', 'Group of guests at the bar', 'landscape', 4),
  ('nyfw-2024', 'NY Fashion Week', 'NY Fashion Week', 'New York', '/events/nyfw-2024/nyfw-6.jpg', '/events/nyfw-2024/large/nyfw-6.jpg', 'Guests by a red curtain', 'landscape', 5),
  ('nyfw-2024', 'NY Fashion Week', 'NY Fashion Week', 'New York', '/events/nyfw-2024/nyfw-7.jpg', '/events/nyfw-2024/large/nyfw-7.jpg', 'Group portrait of guests at the venue', 'landscape', 6),
  ('nyfw-2024', 'NY Fashion Week', 'NY Fashion Week', 'New York', '/events/nyfw-2024/nyfw-8.jpg', '/events/nyfw-2024/large/nyfw-8.jpg', 'Guests toasting with drinks', 'landscape', 7)
on conflict do nothing;
