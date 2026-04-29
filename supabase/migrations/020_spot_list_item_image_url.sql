-- Optional cover image per spot (itinerary / collection item).
alter table public.user_spot_list_items
  add column if not exists image_url text;

comment on column public.user_spot_list_items.image_url is 'Public image URL (e.g. Supabase Storage or HTTPS) for this spot.';
