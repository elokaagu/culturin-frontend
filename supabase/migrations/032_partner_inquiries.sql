-- Partner inquiry form submissions from /partner.
create table if not exists public.partner_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  interest text not null default 'other',
  message text,
  created_at timestamptz not null default now()
);

create index if not exists partner_inquiries_created_at_idx on public.partner_inquiries (created_at desc);

alter table public.partner_inquiries enable row level security;

drop policy if exists "partner_inquiries_insert" on public.partner_inquiries;
create policy "partner_inquiries_insert"
  on public.partner_inquiries for insert
  to anon, authenticated
  with check (true);
