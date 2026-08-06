-- Remove legacy ghost CMS rows and seed demo content from public tables.
-- Showcase fallbacks in the app cover empty CMS states; Studio should publish real work.

-- Hard-blocked titles/slugs previously filtered in app code (blockedFromSite).
delete from public.cms_blogs
where
  lower(title) like '%drums of tomorrow%'
  or (lower(slug) like '%drum%' and lower(slug) like '%tomorrow%')
  or lower(title) like '%cynthia bailey%'
  or (lower(title) like '%culturin convos%' and lower(title) like '%cynthia%');

delete from public.cms_videos
where
  lower(title) like '%drums of tomorrow%'
  or (lower(slug) like '%drum%' and lower(slug) like '%tomorrow%')
  or (lower(title) like '%cynthia bailey%' and lower(title) like '%convos%');

-- Seeded demo rows from 009 / 013 (and any other demo-* slugs).
delete from public.cms_blogs where slug like 'demo-%';
delete from public.cms_videos where slug like 'demo-%';
delete from public.cms_providers where slug like 'demo-%';
