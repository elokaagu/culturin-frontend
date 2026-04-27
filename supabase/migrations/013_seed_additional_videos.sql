-- Add six more demo videos for fuller rails.
-- Safe to re-run: rows are keyed by slug.

insert into public.cms_videos (slug, title, uploader, description, thumbnail_url, playback_id, published_at)
values
  (
    'demo-film-jordan-desert-road',
    '10 Days in Jordan: desert road edit',
    'Culturin Field Notes',
    'Sandstone valleys, roadside tea, and wide-open highway light.',
    'https://i.ytimg.com/vi/8wR7M4s6Q4M/hqdefault.jpg',
    null,
    '2025-03-01T12:00:00Z'::timestamptz
  ),
  (
    'demo-film-bourdain-market-bite',
    'Munchies market cuts',
    'Culturin Field Notes',
    'Kitchen energy, sizzling grills, and market-side storytelling.',
    'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    null,
    '2025-03-02T12:00:00Z'::timestamptz
  ),
  (
    'demo-film-cape-town-scenic-drive',
    'Cape Town scenic drive in 4K style',
    'Culturin Field Notes',
    'Ocean turns, mountain edges, and long-window road moments.',
    'https://i.ytimg.com/vi/aqz-KE-bpKQ/hqdefault.jpg',
    null,
    '2025-03-03T12:00:00Z'::timestamptz
  ),
  (
    'demo-film-sicily-first-trip',
    'My first Sicily trip: old streets, new angles',
    'Culturin Field Notes',
    'Stone alleys, balconies, and evening piazza rhythm.',
    'https://i.ytimg.com/vi/ScMzIvxBSi4/hqdefault.jpg',
    null,
    '2025-03-04T12:00:00Z'::timestamptz
  ),
  (
    'demo-film-lagos-coastline-night',
    'Lagos coastline to nightlife',
    'Culturin Field Notes',
    'Atlantic haze at sunset and a city that switches tempo at night.',
    'https://i.ytimg.com/vi/ysz5S6PUM-U/hqdefault.jpg',
    null,
    '2025-03-05T12:00:00Z'::timestamptz
  ),
  (
    'demo-film-barcelona-golden-alleys',
    'Barcelona golden alleys',
    'Culturin Field Notes',
    'Late-afternoon facades, neighborhood bars, and city texture.',
    'https://i.ytimg.com/vi/jNQXAC9IVRw/hqdefault.jpg',
    null,
    '2025-03-06T12:00:00Z'::timestamptz
  )
on conflict (slug) do nothing;
