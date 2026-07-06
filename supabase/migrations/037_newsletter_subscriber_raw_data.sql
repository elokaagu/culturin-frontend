-- CSV imports often carry extra columns beyond name/email/company (phone,
-- tags, signup source, etc.). Keep the full original row so Studio can show
-- everything that was on the file for a given subscriber.
alter table public.newsletter_subscribers
  add column if not exists raw_data jsonb;
