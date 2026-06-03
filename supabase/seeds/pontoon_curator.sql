-- Seed: Pontoon curator profile
-- Run this in the Supabase SQL editor after applying migration 027_cms_curators.sql

insert into public.cms_curators (
  slug,
  name,
  tagline,
  description,
  website_url,
  instagram_url,
  shop_url,
  avatar_url,
  banner_url,
  specialties,
  published_at
)
values (
  'pontoon',
  'Pontoon',
  'Stories for women in motion',
  'Pontoon is an editorial community built around women who move through the world on their own terms — photographers, writers, explorers, and makers who find meaning in motion. Through long-form interviews, travel stories, and cultural dispatches, Pontoon documents the lives of women whose sense of home is always evolving. Culturin is proud to feature Pontoon''s work as part of our curated editorial programme.',
  'https://pontooncommunity.com',
  'https://www.instagram.com/pontoon_co/',
  'https://pontooncommunity.com/shop',
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1200&q=80',
  array['Travel', 'Women''s voices', 'Culture', 'Identity', 'Photography'],
  now()
)
on conflict (slug) do update set
  name         = excluded.name,
  tagline      = excluded.tagline,
  description  = excluded.description,
  website_url  = excluded.website_url,
  instagram_url = excluded.instagram_url,
  shop_url     = excluded.shop_url,
  avatar_url   = excluded.avatar_url,
  banner_url   = excluded.banner_url,
  specialties  = excluded.specialties,
  published_at = coalesce(cms_curators.published_at, excluded.published_at),
  updated_at   = now();
