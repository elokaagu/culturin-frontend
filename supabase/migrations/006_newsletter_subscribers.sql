-- Subscribers from the site footer; inserted via API using the service role only.
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null default 'footer',
  created_at timestamptz not null default now()
);

create unique index if not exists newsletter_subscribers_lower_email_key on public.newsletter_subscribers (lower(email));

alter table public.newsletter_subscribers enable row level security;
