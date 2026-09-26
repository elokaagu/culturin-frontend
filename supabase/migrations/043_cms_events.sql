-- Events managed from the admin (Admin > Events).
-- Each event is stored as a JSON document (the CulturinEvent shape used by the public
-- /events pages). Until this table has rows, the site falls back to the built-in events
-- in src/lib/eventsData.ts, so running this migration changes nothing on its own.
-- Use "Import built-in events" in Admin > Events to copy them in and start editing.

create table if not exists public.cms_events (
  slug        text        primary key,
  data        jsonb       not null,
  -- Used only to order events (earliest first); the display date is data->>'date'.
  starts_on   date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists cms_events_starts_on_idx
  on public.cms_events (starts_on asc nulls last, created_at asc);

drop trigger if exists trg_cms_events_set_updated_at on public.cms_events;
create trigger trg_cms_events_set_updated_at
  before update on public.cms_events
  for each row execute function public.set_updated_at();

alter table public.cms_events enable row level security;

-- Public event pages read this table; writes only happen server-side with the service role.
drop policy if exists "cms_events_select_public" on public.cms_events;
create policy "cms_events_select_public"
  on public.cms_events for select
  to anon, authenticated
  using (true);
