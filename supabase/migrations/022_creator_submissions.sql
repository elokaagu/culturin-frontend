-- Drafts / submissions from signed-in creators (non-admin CMS). Reviewed by admins separately.

create table if not exists public.creator_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  content_type text not null check (content_type in ('blog', 'video', 'provider')),
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'published', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists creator_submissions_user_id_created_idx
  on public.creator_submissions (user_id, created_at desc);

drop trigger if exists trg_creator_submissions_set_updated_at on public.creator_submissions;
create trigger trg_creator_submissions_set_updated_at
before update on public.creator_submissions
for each row execute function public.set_updated_at();

alter table public.creator_submissions enable row level security;

drop policy if exists "creator_submissions_insert_own" on public.creator_submissions;
create policy "creator_submissions_insert_own"
on public.creator_submissions for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "creator_submissions_select_own" on public.creator_submissions;
create policy "creator_submissions_select_own"
on public.creator_submissions for select
to authenticated
using (auth.uid() = user_id);
