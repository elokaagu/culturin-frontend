-- AI-written audience briefings for the studio Intelligence page.
create table if not exists public.audience_briefings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  created_by text,
  model text not null,
  content jsonb not null,
  stats jsonb not null default '{}'::jsonb
);

create index if not exists audience_briefings_created_at_idx on public.audience_briefings (created_at desc);

alter table public.audience_briefings enable row level security;
