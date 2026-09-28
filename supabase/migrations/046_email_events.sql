-- Email analytics for Admin > Emails, fed by Resend webhooks (/api/webhooks/resend).

-- Resend's id for each broadcast email, so webhook events can be matched to a person and broadcast,
-- plus the first time each thing happened to that email.
alter table public.email_broadcast_recipients
  add column if not exists resend_id     text,
  add column if not exists delivered_at  timestamptz,
  add column if not exists opened_at     timestamptz,
  add column if not exists clicked_at    timestamptz,
  add column if not exists bounced_at    timestamptz,
  add column if not exists complained_at timestamptz;

create unique index if not exists email_broadcast_recipients_resend_id_key
  on public.email_broadcast_recipients (resend_id) where resend_id is not null;

-- Raw event log (one row per webhook delivery; svix_id makes retries harmless).
create table if not exists public.email_events (
  id            bigint generated always as identity primary key,
  svix_id       text        not null unique,
  type          text        not null,
  resend_id     text,
  broadcast_id  uuid        references public.email_broadcasts (id) on delete cascade,
  email         text,
  link          text,
  detail        text,
  occurred_at   timestamptz not null default now(),
  received_at   timestamptz not null default now()
);

create index if not exists email_events_broadcast_type_idx on public.email_events (broadcast_id, type);

alter table public.email_events enable row level security;

-- Why someone stopped getting emails: 'unsubscribed', 'bounced' or 'complained'.
alter table public.newsletter_subscribers add column if not exists suppressed_reason text;
