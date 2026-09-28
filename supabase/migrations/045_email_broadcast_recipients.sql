-- Staged (warm-up) sending for Admin > Emails: send a broadcast in batches, most engaged people first.
-- Each person who has been sent a broadcast gets a row here, so later batches never repeat anyone.

create table if not exists public.email_broadcast_recipients (
  broadcast_id  uuid        not null references public.email_broadcasts (id) on delete cascade,
  email         text        not null,
  sent_at       timestamptz not null default now(),
  primary key (broadcast_id, email)
);

alter table public.email_broadcast_recipients enable row level security;

-- 'partial' = some batches sent, more to go. Content is locked from the first batch on.
alter table public.email_broadcasts drop constraint if exists email_broadcasts_status_check;
alter table public.email_broadcasts
  add constraint email_broadcasts_status_check check (status in ('draft', 'partial', 'sending', 'sent', 'failed'));
