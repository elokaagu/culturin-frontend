-- Sales decks: shareable PDF decks with DocSend-style analytics.
-- Admin access matches Studio: public.users.role = 'ADMIN'.

create extension if not exists pgcrypto;

-- Helper used by RLS policies and set_deck_password.
create or replace function public.is_studio_admin(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users u
    where u.id = p_user_id
      and upper(u.role) = 'ADMIN'
  );
$$;

revoke all on function public.is_studio_admin(uuid) from public;
grant execute on function public.is_studio_admin(uuid) to authenticated;

create table if not exists public.sales_decks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  file_path text not null,
  file_url text not null,
  file_name text not null,
  file_size bigint,
  page_count integer,
  share_token text not null unique default encode(extensions.gen_random_bytes(12), 'hex'),
  custom_slug text unique,
  status text not null default 'live' check (status in ('draft', 'live', 'archived')),
  require_email boolean not null default false,
  allow_download boolean not null default true,
  password_hash text,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sales_decks_custom_slug_format check (
    custom_slug is null or custom_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  )
);

create index if not exists sales_decks_share_token_idx on public.sales_decks (share_token);
create index if not exists sales_decks_custom_slug_idx on public.sales_decks (custom_slug);
create index if not exists sales_decks_status_idx on public.sales_decks (status);

alter table public.sales_decks enable row level security;

drop trigger if exists trg_sales_decks_set_updated_at on public.sales_decks;
create trigger trg_sales_decks_set_updated_at
before update on public.sales_decks
for each row execute function public.set_updated_at();

drop policy if exists "sales_decks_admin_all" on public.sales_decks;
create policy "sales_decks_admin_all"
  on public.sales_decks for all
  to authenticated
  using (public.is_studio_admin(auth.uid()))
  with check (public.is_studio_admin(auth.uid()));

-- Per-partner share links (same deck, attributed analytics)
create table if not exists public.deck_partner_links (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid not null references public.sales_decks(id) on delete cascade,
  label text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  constraint deck_partner_links_slug_format check (
    slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  )
);

create index if not exists deck_partner_links_deck_id_idx on public.deck_partner_links (deck_id);

alter table public.deck_partner_links enable row level security;

drop policy if exists "deck_partner_links_admin_all" on public.deck_partner_links;
create policy "deck_partner_links_admin_all"
  on public.deck_partner_links for all
  to authenticated
  using (public.is_studio_admin(auth.uid()))
  with check (public.is_studio_admin(auth.uid()));

-- View sessions (one per open of a share link)
create table if not exists public.deck_view_sessions (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid not null references public.sales_decks(id) on delete cascade,
  partner_link_id uuid references public.deck_partner_links(id) on delete set null,
  viewer_email text,
  viewer_name text,
  visitor_id text not null,
  started_at timestamptz not null default now(),
  last_active_at timestamptz not null default now(),
  duration_seconds integer not null default 0,
  max_page_reached integer not null default 1,
  pages_viewed integer not null default 1,
  completed boolean not null default false,
  user_agent text,
  referrer text
);

create index if not exists deck_view_sessions_deck_id_idx on public.deck_view_sessions (deck_id);
create index if not exists deck_view_sessions_partner_link_id_idx on public.deck_view_sessions (partner_link_id);
create index if not exists deck_view_sessions_started_at_idx on public.deck_view_sessions (started_at desc);

alter table public.deck_view_sessions enable row level security;

drop policy if exists "deck_view_sessions_admin_select" on public.deck_view_sessions;
create policy "deck_view_sessions_admin_select"
  on public.deck_view_sessions for select
  to authenticated
  using (public.is_studio_admin(auth.uid()));

drop policy if exists "deck_view_sessions_insert_live" on public.deck_view_sessions;
create policy "deck_view_sessions_insert_live"
  on public.deck_view_sessions for insert
  to anon, authenticated
  with check (
    exists (
      select 1 from public.sales_decks d
      where d.id = deck_id and d.status = 'live'
    )
  );

drop policy if exists "deck_view_sessions_update_live" on public.deck_view_sessions;
create policy "deck_view_sessions_update_live"
  on public.deck_view_sessions for update
  to anon, authenticated
  using (true)
  with check (
    exists (
      select 1 from public.sales_decks d
      where d.id = deck_id and d.status = 'live'
    )
  );

-- Page-level engagement events
create table if not exists public.deck_page_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.deck_view_sessions(id) on delete cascade,
  deck_id uuid not null references public.sales_decks(id) on delete cascade,
  page_number integer not null check (page_number >= 1),
  time_spent_ms integer not null default 0 check (time_spent_ms >= 0),
  viewed_at timestamptz not null default now()
);

create index if not exists deck_page_events_deck_id_idx on public.deck_page_events (deck_id);
create index if not exists deck_page_events_session_id_idx on public.deck_page_events (session_id);
create index if not exists deck_page_events_page_idx on public.deck_page_events (deck_id, page_number);

alter table public.deck_page_events enable row level security;

drop policy if exists "deck_page_events_admin_select" on public.deck_page_events;
create policy "deck_page_events_admin_select"
  on public.deck_page_events for select
  to authenticated
  using (public.is_studio_admin(auth.uid()));

drop policy if exists "deck_page_events_insert_live" on public.deck_page_events;
create policy "deck_page_events_insert_live"
  on public.deck_page_events for insert
  to anon, authenticated
  with check (
    exists (
      select 1 from public.sales_decks d
      where d.id = deck_id and d.status = 'live'
    )
  );

-- Resolve share token, custom slug, or partner link slug
create or replace function public.get_deck_by_token(p_token text)
returns table (
  id uuid,
  title text,
  description text,
  file_url text,
  page_count integer,
  require_email boolean,
  allow_download boolean,
  has_password boolean,
  partner_link_id uuid,
  partner_label text,
  status text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    d.id,
    d.title,
    d.description,
    case when d.password_hash is null then d.file_url else null end as file_url,
    d.page_count,
    d.require_email,
    d.allow_download,
    (d.password_hash is not null) as has_password,
    pl.id as partner_link_id,
    pl.label as partner_label,
    d.status
  from public.sales_decks d
  left join public.deck_partner_links pl
    on pl.deck_id = d.id and pl.slug = lower(p_token)
  where d.status = 'live'
    and (
      d.share_token = p_token
      or d.custom_slug = lower(p_token)
      or pl.id is not null
    )
  limit 1;
$$;

grant execute on function public.get_deck_by_token(text) to anon, authenticated;

-- Unlock a password-protected deck
create or replace function public.unlock_deck(p_token text, p_password text)
returns table (
  file_url text
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  deck_row public.sales_decks%rowtype;
begin
  select d.* into deck_row
  from public.sales_decks d
  left join public.deck_partner_links pl
    on pl.deck_id = d.id and pl.slug = lower(p_token)
  where d.status = 'live'
    and (
      d.share_token = p_token
      or d.custom_slug = lower(p_token)
      or pl.id is not null
    )
  limit 1;

  if not found then
    return;
  end if;

  if deck_row.password_hash is null then
    return query select deck_row.file_url;
    return;
  end if;

  if deck_row.password_hash = extensions.crypt(p_password, deck_row.password_hash) then
    return query select deck_row.file_url;
  end if;
end;
$$;

grant execute on function public.unlock_deck(text, text) to anon, authenticated;

-- Admin helper to set / clear password (never expose hash via client updates)
create or replace function public.set_deck_password(p_deck_id uuid, p_password text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_studio_admin(auth.uid()) then
    raise exception 'Admin access required';
  end if;

  update public.sales_decks
  set password_hash = case
    when p_password is null or btrim(p_password) = '' then null
    else extensions.crypt(p_password, extensions.gen_salt('bf'))
  end
  where id = p_deck_id;
end;
$$;

grant execute on function public.set_deck_password(uuid, text) to authenticated;

-- Allow viewers to report page count once the PDF renders (no other fields)
create or replace function public.report_deck_page_count(p_deck_id uuid, p_page_count integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_page_count is null or p_page_count < 1 then
    return;
  end if;

  update public.sales_decks
  set page_count = p_page_count
  where id = p_deck_id
    and status = 'live'
    and (page_count is null or page_count <> p_page_count);
end;
$$;

grant execute on function public.report_deck_page_count(uuid, integer) to anon, authenticated;

-- Storage bucket for deck PDFs (public URLs; paths are unguessable UUIDs)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'sales-decks',
  'sales-decks',
  true,
  52428800,
  array['application/pdf']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "sales_decks_storage_select" on storage.objects;
create policy "sales_decks_storage_select"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'sales-decks');

drop policy if exists "sales_decks_storage_insert" on storage.objects;
create policy "sales_decks_storage_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'sales-decks'
    and public.is_studio_admin(auth.uid())
  );

drop policy if exists "sales_decks_storage_update" on storage.objects;
create policy "sales_decks_storage_update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'sales-decks'
    and public.is_studio_admin(auth.uid())
  );

drop policy if exists "sales_decks_storage_delete" on storage.objects;
create policy "sales_decks_storage_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'sales-decks'
    and public.is_studio_admin(auth.uid())
  );
