-- Editorial curator/syndication partner profiles.
-- curator_slug on cms_blogs links an article to a curator (nullable — most blogs are Culturin-native).

create table if not exists public.cms_curators (
  id            uuid        primary key default gen_random_uuid(),
  slug          text        not null unique,
  name          text        not null default '',
  tagline       text,
  description   text,
  website_url   text,
  instagram_url text,
  shop_url      text,
  avatar_url    text,
  banner_url    text,
  specialties   text[]      not null default '{}'::text[],
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists cms_curators_published_at_idx
  on public.cms_curators (published_at desc nulls last);

drop trigger if exists trg_cms_curators_set_updated_at on public.cms_curators;
create trigger trg_cms_curators_set_updated_at
  before update on public.cms_curators
  for each row execute function public.set_updated_at();

alter table public.cms_blogs
  add column if not exists curator_slug text references public.cms_curators(slug) on delete set null;

create index if not exists cms_blogs_curator_slug_idx
  on public.cms_blogs (curator_slug);

alter table public.cms_curators enable row level security;

drop policy if exists "cms_curators_select_public" on public.cms_curators;
create policy "cms_curators_select_public"
  on public.cms_curators for select
  to anon, authenticated
  using (true);
