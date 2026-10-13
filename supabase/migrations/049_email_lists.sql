-- Event guest lists for Admin > Emails: send a broadcast to one list (e.g. a Luma guest export)
-- instead of the whole mailing list. Guests on a list are not added to the newsletter.

create table if not exists public.email_lists (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.email_list_members (
  list_id     uuid        not null references public.email_lists (id) on delete cascade,
  email       text        not null, -- always lower case
  first_name  text,
  last_name   text,
  company     text,
  raw_data    jsonb,
  added_at    timestamptz not null default now(),
  primary key (list_id, email)
);

-- Anyone who unsubscribed, bounced or complained, whether or not they're a newsletter subscriber,
-- so event guests who unsubscribe are never emailed again.
create table if not exists public.email_suppressions (
  email       text        primary key, -- always lower case
  reason      text        not null,
  created_at  timestamptz not null default now()
);

insert into public.email_suppressions (email, reason)
select lower(email), coalesce(suppressed_reason, 'unsubscribed')
from public.newsletter_subscribers
where unsubscribed_at is not null
on conflict (email) do nothing;

-- Null = everyone on the mailing list. A list can't be deleted while an email points at it,
-- so a list email can never silently fall back to the whole mailing list.
alter table public.email_broadcasts
  add column if not exists list_id uuid references public.email_lists (id) on delete restrict;

alter table public.email_lists enable row level security;
alter table public.email_list_members enable row level security;
alter table public.email_suppressions enable row level security;
