-- Culturin Guides & Briefings: AI-researched, curator-reviewed culture guides (public) and
-- professional briefings (shared by link with view analytics, plus a PDF).
-- Admins (public.users.role = 'ADMIN') manage everything; the pipeline and public pages use the
-- service role. Public readers never query these tables directly.

create table if not exists public.briefing_requests (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'briefing' check (kind in ('guide', 'briefing')),
  place text not null,
  country text not null,
  country_code text,
  slug text not null,
  audience text not null default '',
  objective text not null default '',
  category text not null default '',
  timeframe_start date not null,
  timeframe_end date not null,
  buyer_name text,
  buyer_email text,
  buyer_company text,
  status text not null default 'queued' check (
    status in ('queued', 'researching', 'writing', 'checking', 'in_review', 'approved', 'delivered', 'failed')
  ),
  -- Per-step outputs and timings; each finished step is recorded here so a retry never redoes it.
  progress jsonb not null default '{}'::jsonb,
  -- Spend per provider in US dollars: { exa, apify, llm, total, llmTokens }.
  cost jsonb not null default '{}'::jsonb,
  error text,
  -- A runner holds the lease while it works on a step; expired leases can be picked up again.
  lease_until timestamptz,
  attempts integer not null default 0,
  -- Payment hook for Stripe Checkout (not wired up in the MVP).
  payment_status text not null default 'not_required' check (payment_status in ('not_required', 'pending', 'paid', 'refunded')),
  stripe_checkout_session_id text,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint briefing_requests_timeframe check (timeframe_end >= timeframe_start)
);

create index if not exists briefing_requests_status_idx on public.briefing_requests (status, lease_until);
create index if not exists briefing_requests_created_at_idx on public.briefing_requests (created_at desc);

create table if not exists public.briefings (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.briefing_requests(id) on delete cascade,
  version integer not null default 1,
  sections jsonb not null default '{}'::jsonb,
  summary text not null default '',
  confidence text check (confidence in ('high', 'medium', 'low')),
  curator_id uuid references public.cms_curators(id) on delete set null,
  local_notes text not null default '',
  reviewed_by text,
  reviewed_at timestamptz,
  published_at timestamptz,
  delivered_at timestamptz,
  share_token text not null unique default encode(extensions.gen_random_bytes(12), 'hex'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (request_id, version)
);

create index if not exists briefings_request_id_idx on public.briefings (request_id, version desc);
create index if not exists briefings_published_idx on public.briefings (published_at desc) where published_at is not null;

create table if not exists public.briefing_sources (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.briefing_requests(id) on delete cascade,
  briefing_id uuid references public.briefings(id) on delete set null,
  source_key text not null,
  url text,
  title text,
  publisher text,
  published_date date,
  excerpt text,
  kind text not null check (kind in ('web', 'news', 'social', 'calendar', 'first_party')),
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (request_id, source_key)
);

create index if not exists briefing_sources_request_idx on public.briefing_sources (request_id);

create table if not exists public.briefing_reviews (
  id uuid primary key default gen_random_uuid(),
  briefing_id uuid not null references public.briefings(id) on delete cascade,
  curator_id uuid references public.cms_curators(id) on delete set null,
  reviewer_email text,
  notes text not null default '',
  decisions jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists briefing_reviews_briefing_idx on public.briefing_reviews (briefing_id, created_at desc);

-- Saved places for the monthly refresh (subscriptions, after the MVP).
create table if not exists public.briefing_markets (
  id uuid primary key default gen_random_uuid(),
  place text not null,
  country text not null,
  owner_email text not null,
  request_id uuid references public.briefing_requests(id) on delete set null,
  cadence text not null default 'monthly' check (cadence in ('monthly', 'quarterly')),
  last_refreshed_at timestamptz,
  created_at timestamptz not null default now()
);

-- One row per open of a briefing share link; heartbeats extend duration and scroll depth.
create table if not exists public.briefing_view_sessions (
  id uuid primary key default gen_random_uuid(),
  briefing_id uuid not null references public.briefings(id) on delete cascade,
  visitor_id text not null,
  started_at timestamptz not null default now(),
  last_active_at timestamptz not null default now(),
  duration_seconds integer not null default 0,
  max_scroll_percent integer not null default 0,
  downloaded_pdf boolean not null default false,
  user_agent text,
  referrer text
);

create index if not exists briefing_view_sessions_briefing_idx on public.briefing_view_sessions (briefing_id, started_at desc);

drop trigger if exists trg_briefing_requests_set_updated_at on public.briefing_requests;
create trigger trg_briefing_requests_set_updated_at
before update on public.briefing_requests
for each row execute function public.set_updated_at();

drop trigger if exists trg_briefings_set_updated_at on public.briefings;
create trigger trg_briefings_set_updated_at
before update on public.briefings
for each row execute function public.set_updated_at();

alter table public.briefing_requests enable row level security;
alter table public.briefings enable row level security;
alter table public.briefing_sources enable row level security;
alter table public.briefing_reviews enable row level security;
alter table public.briefing_markets enable row level security;
alter table public.briefing_view_sessions enable row level security;

drop policy if exists "briefing_requests_admin_all" on public.briefing_requests;
create policy "briefing_requests_admin_all" on public.briefing_requests for all to authenticated
  using (public.is_studio_admin(auth.uid())) with check (public.is_studio_admin(auth.uid()));

drop policy if exists "briefings_admin_all" on public.briefings;
create policy "briefings_admin_all" on public.briefings for all to authenticated
  using (public.is_studio_admin(auth.uid())) with check (public.is_studio_admin(auth.uid()));

drop policy if exists "briefing_sources_admin_all" on public.briefing_sources;
create policy "briefing_sources_admin_all" on public.briefing_sources for all to authenticated
  using (public.is_studio_admin(auth.uid())) with check (public.is_studio_admin(auth.uid()));

drop policy if exists "briefing_reviews_admin_all" on public.briefing_reviews;
create policy "briefing_reviews_admin_all" on public.briefing_reviews for all to authenticated
  using (public.is_studio_admin(auth.uid())) with check (public.is_studio_admin(auth.uid()));

drop policy if exists "briefing_markets_admin_all" on public.briefing_markets;
create policy "briefing_markets_admin_all" on public.briefing_markets for all to authenticated
  using (public.is_studio_admin(auth.uid())) with check (public.is_studio_admin(auth.uid()));

drop policy if exists "briefing_view_sessions_admin_select" on public.briefing_view_sessions;
create policy "briefing_view_sessions_admin_select" on public.briefing_view_sessions for select to authenticated
  using (public.is_studio_admin(auth.uid()));
