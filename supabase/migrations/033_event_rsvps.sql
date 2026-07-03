-- RSVP submissions from event detail pages (src/app/events/[slug]/RSVPForm.tsx).
-- Each row is tied to an event_slug so it can be exported into a Luma invite
-- list once that event is actually created there.
create table if not exists public.event_rsvps (
  id           uuid        primary key default gen_random_uuid(),
  event_slug   text        not null,
  first_name   text        not null,
  last_name    text        not null,
  email        text        not null,
  company      text,
  title        text,
  linkedin_url text,
  created_at   timestamptz not null default now()
);

create index if not exists event_rsvps_event_slug_idx on public.event_rsvps (event_slug, created_at desc);

alter table public.event_rsvps enable row level security;

drop policy if exists "event_rsvps_insert" on public.event_rsvps;
create policy "event_rsvps_insert"
  on public.event_rsvps for insert
  to anon, authenticated
  with check (true);
