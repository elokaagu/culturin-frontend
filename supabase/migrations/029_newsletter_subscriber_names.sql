-- Footer subscribe form now collects first/last name alongside email.
alter table public.newsletter_subscribers
  add column if not exists first_name text,
  add column if not exists last_name text;
