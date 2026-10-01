-- Focal point for each site image slot: where the subject is, as percentages from the top-left.
-- Every crop on the site (wide hero, tall cards, square tiles) keeps this point in frame.
-- Null means "centre" (the old behaviour).
alter table public.site_images
  add column if not exists focal_x real check (focal_x between 0 and 100),
  add column if not exists focal_y real check (focal_y between 0 and 100);
