-- User-submitted travel photos for the Community Pinterest-style gallery.

create table if not exists public.community_travel_pins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  image_url text not null,
  title text,
  created_at timestamptz not null default now()
);

create index if not exists community_travel_pins_created_at_idx on public.community_travel_pins (created_at desc);

alter table public.community_travel_pins enable row level security;

drop policy if exists "community_travel_pins_select_public" on public.community_travel_pins;
create policy "community_travel_pins_select_public"
  on public.community_travel_pins for select
  to anon, authenticated
  using (true);

drop policy if exists "community_travel_pins_insert_own" on public.community_travel_pins;
create policy "community_travel_pins_insert_own"
  on public.community_travel_pins for insert
  to authenticated
  with check (user_id = (select auth.uid()));

drop policy if exists "community_travel_pins_delete_own" on public.community_travel_pins;
create policy "community_travel_pins_delete_own"
  on public.community_travel_pins for delete
  to authenticated
  using (user_id = (select auth.uid()));
