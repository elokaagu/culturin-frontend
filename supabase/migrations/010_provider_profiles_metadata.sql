-- Guide profile metadata for marketplace cards (real person view).

alter table public.cms_providers
  add column if not exists avatar_image_url text,
  add column if not exists languages text[] not null default '{}'::text[],
  add column if not exists specialties text[] not null default '{}'::text[];
