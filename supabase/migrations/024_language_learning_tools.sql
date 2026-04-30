-- Language learning tools tied to logged-in user profiles.

create table if not exists public.user_language_profiles (
  user_id uuid primary key references public.users(id) on delete cascade,
  target_language text not null default 'Spanish',
  proficiency_level text not null default 'beginner',
  daily_goal int not null default 5 check (daily_goal > 0),
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vocab_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  term text not null,
  translation text,
  example_text text,
  source_label text,
  mastery smallint not null default 0 check (mastery between 0 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.flashcards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  vocab_item_id uuid references public.vocab_items(id) on delete set null,
  front_text text not null,
  back_text text not null,
  interval_days int not null default 1 check (interval_days > 0),
  next_review_at timestamptz not null default now(),
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.learning_stats (
  user_id uuid primary key references public.users(id) on delete cascade,
  total_words int not null default 0 check (total_words >= 0),
  flashcards_due int not null default 0 check (flashcards_due >= 0),
  current_streak int not null default 0 check (current_streak >= 0),
  last_activity_date date,
  updated_at timestamptz not null default now()
);

create index if not exists user_language_profiles_public_idx
  on public.user_language_profiles (is_public);
create index if not exists vocab_items_user_id_created_at_idx
  on public.vocab_items (user_id, created_at desc);
create index if not exists flashcards_user_id_next_review_idx
  on public.flashcards (user_id, next_review_at asc);

drop trigger if exists trg_user_language_profiles_set_updated_at on public.user_language_profiles;
create trigger trg_user_language_profiles_set_updated_at
before update on public.user_language_profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_vocab_items_set_updated_at on public.vocab_items;
create trigger trg_vocab_items_set_updated_at
before update on public.vocab_items
for each row execute function public.set_updated_at();

drop trigger if exists trg_flashcards_set_updated_at on public.flashcards;
create trigger trg_flashcards_set_updated_at
before update on public.flashcards
for each row execute function public.set_updated_at();
