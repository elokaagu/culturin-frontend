create table if not exists public.user_follows (
  follower_user_id uuid not null references public.users(id) on delete cascade,
  following_user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_user_id, following_user_id),
  constraint user_follows_no_self_follow check (follower_user_id <> following_user_id)
);

create index if not exists idx_user_follows_following_user_id on public.user_follows (following_user_id);
