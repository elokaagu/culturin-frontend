-- Approximate location for email clicks (Admin > Emails > Analytics > "Clicked from").
-- Looked up from the clicker's IP when Resend's webhook arrives. Only the place is stored;
-- the IP address itself is never saved.

alter table public.email_events
  add column if not exists city    text,
  add column if not exists region  text,
  add column if not exists country text;
