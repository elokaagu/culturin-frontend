-- Patch: add shop_url to cms_curators (column was added to 027 after initial deployment)
alter table public.cms_curators
  add column if not exists shop_url text;
