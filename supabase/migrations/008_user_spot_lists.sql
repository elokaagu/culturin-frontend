-- Per-user trip / place lists (favorite spots), editable after login.

create table if not exists public.user_spot_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  place_label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_spot_list_items (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references public.user_spot_lists(id) on delete cascade,
  title text not null,
  notes text,
  url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists user_spot_lists_user_id_idx on public.user_spot_lists (user_id);
create index if not exists user_spot_list_items_list_id_idx on public.user_spot_list_items (list_id);

drop trigger if exists trg_user_spot_lists_set_updated_at on public.user_spot_lists;
create trigger trg_user_spot_lists_set_updated_at
before update on public.user_spot_lists
for each row execute function public.set_updated_at();
