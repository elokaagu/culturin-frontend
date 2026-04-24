-- Remove legacy source identifiers from CMS tables.

alter table if exists public.cms_blogs
  drop column if exists sanity_id;

alter table if exists public.cms_videos
  drop column if exists sanity_id;

alter table if exists public.cms_providers
  drop column if exists sanity_id;
