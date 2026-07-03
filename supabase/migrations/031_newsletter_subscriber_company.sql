-- Footer subscribe form now optionally collects a company name, so Studio
-- can show the full audience (first/last name, email, company) in one place.
alter table public.newsletter_subscribers
  add column if not exists company text;
