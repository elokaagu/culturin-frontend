-- CMS tables for app content. Public read for app UI.

create table if not exists public.cms_blogs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null default '',
  summary text,
  title_image_url text,
  title_image jsonb,
  body jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cms_videos (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null default '',
  uploader text,
  description text,
  thumbnail_url text,
  thumbnail jsonb,
  playback_id text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cms_providers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text,
  event_name text,
  description text,
  location text,
  contact_email text,
  contact_phone text,
  contact_website text,
  banner_image_url text,
  banner_image_alt text,
  banner_image jsonb,
  images jsonb not null default '[]'::jsonb,
  prices jsonb not null default '[]'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cms_blogs_published_at_idx on public.cms_blogs (published_at desc nulls last);
create index if not exists cms_blogs_created_at_idx on public.cms_blogs (created_at desc);
create index if not exists cms_videos_published_at_idx on public.cms_videos (published_at desc nulls last);
create index if not exists cms_videos_created_at_idx on public.cms_videos (created_at desc);
create index if not exists cms_providers_created_at_idx on public.cms_providers (created_at desc);

drop trigger if exists trg_cms_blogs_set_updated_at on public.cms_blogs;
create trigger trg_cms_blogs_set_updated_at
before update on public.cms_blogs
for each row execute function public.set_updated_at();

drop trigger if exists trg_cms_videos_set_updated_at on public.cms_videos;
create trigger trg_cms_videos_set_updated_at
before update on public.cms_videos
for each row execute function public.set_updated_at();

drop trigger if exists trg_cms_providers_set_updated_at on public.cms_providers;
create trigger trg_cms_providers_set_updated_at
before update on public.cms_providers
for each row execute function public.set_updated_at();

alter table public.cms_blogs enable row level security;
alter table public.cms_videos enable row level security;
alter table public.cms_providers enable row level security;

drop policy if exists "cms_blogs_select_public" on public.cms_blogs;
create policy "cms_blogs_select_public"
on public.cms_blogs for select
to anon, authenticated
using (true);

drop policy if exists "cms_videos_select_public" on public.cms_videos;
create policy "cms_videos_select_public"
on public.cms_videos for select
to anon, authenticated
using (true);

drop policy if exists "cms_providers_select_public" on public.cms_providers;
create policy "cms_providers_select_public"
on public.cms_providers for select
to anon, authenticated
using (true);

-- Service role bypasses RLS for imports / server admin.
