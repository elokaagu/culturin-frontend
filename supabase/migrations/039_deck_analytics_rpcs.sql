-- Fix public deck analytics writes.
-- Insert/update policies previously used EXISTS(select from sales_decks), but anon
-- cannot SELECT sales_decks under RLS, so WITH CHECK always failed and no sessions
-- were recorded. Use security-definer RPCs (same pattern as get_deck_by_token).

create or replace function public.is_live_sales_deck(p_deck_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.sales_decks d
    where d.id = p_deck_id
      and d.status = 'live'
  );
$$;

revoke all on function public.is_live_sales_deck(uuid) from public;
grant execute on function public.is_live_sales_deck(uuid) to anon, authenticated;

drop policy if exists "deck_view_sessions_insert_live" on public.deck_view_sessions;
create policy "deck_view_sessions_insert_live"
  on public.deck_view_sessions for insert
  to anon, authenticated
  with check (public.is_live_sales_deck(deck_id));

drop policy if exists "deck_view_sessions_update_live" on public.deck_view_sessions;
create policy "deck_view_sessions_update_live"
  on public.deck_view_sessions for update
  to anon, authenticated
  using (public.is_live_sales_deck(deck_id))
  with check (public.is_live_sales_deck(deck_id));

drop policy if exists "deck_page_events_insert_live" on public.deck_page_events;
create policy "deck_page_events_insert_live"
  on public.deck_page_events for insert
  to anon, authenticated
  with check (public.is_live_sales_deck(deck_id));

-- Analytics writes go through security-definer RPCs below (no public SELECT on sessions).

create or replace function public.start_deck_view_session(
  p_deck_id uuid,
  p_visitor_id text,
  p_viewer_email text default null,
  p_viewer_name text default null,
  p_partner_link_id uuid default null,
  p_user_agent text default null,
  p_referrer text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
begin
  if p_visitor_id is null or btrim(p_visitor_id) = '' then
    raise exception 'visitor_id required';
  end if;

  if not public.is_live_sales_deck(p_deck_id) then
    raise exception 'Deck is not available';
  end if;

  if p_partner_link_id is not null and not exists (
    select 1
    from public.deck_partner_links pl
    where pl.id = p_partner_link_id
      and pl.deck_id = p_deck_id
  ) then
    p_partner_link_id := null;
  end if;

  insert into public.deck_view_sessions (
    deck_id,
    visitor_id,
    viewer_email,
    viewer_name,
    partner_link_id,
    user_agent,
    referrer
  )
  values (
    p_deck_id,
    left(btrim(p_visitor_id), 128),
    nullif(left(btrim(coalesce(p_viewer_email, '')), 320), ''),
    nullif(left(btrim(coalesce(p_viewer_name, '')), 200), ''),
    p_partner_link_id,
    nullif(left(btrim(coalesce(p_user_agent, '')), 500), ''),
    nullif(left(btrim(coalesce(p_referrer, '')), 500), '')
  )
  returning id into new_id;

  return new_id;
end;
$$;

revoke all on function public.start_deck_view_session(uuid, text, text, text, uuid, text, text) from public;
grant execute on function public.start_deck_view_session(uuid, text, text, text, uuid, text, text) to anon, authenticated;

create or replace function public.track_deck_page_view(
  p_session_id uuid,
  p_deck_id uuid,
  p_page_number integer,
  p_time_spent_ms integer,
  p_max_page_reached integer,
  p_pages_viewed integer,
  p_completed boolean,
  p_duration_seconds integer
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_live_sales_deck(p_deck_id) then
    return;
  end if;

  if p_page_number is null or p_page_number < 1 then
    return;
  end if;

  update public.deck_view_sessions
  set
    last_active_at = now(),
    duration_seconds = greatest(coalesce(p_duration_seconds, 0), 0),
    max_page_reached = greatest(coalesce(p_max_page_reached, 1), 1),
    pages_viewed = greatest(coalesce(p_pages_viewed, 1), 1),
    completed = coalesce(p_completed, false)
  where id = p_session_id
    and deck_id = p_deck_id;

  if not found then
    return;
  end if;

  insert into public.deck_page_events (
    session_id,
    deck_id,
    page_number,
    time_spent_ms
  )
  values (
    p_session_id,
    p_deck_id,
    p_page_number,
    greatest(coalesce(p_time_spent_ms, 0), 0)
  );
end;
$$;

revoke all on function public.track_deck_page_view(uuid, uuid, integer, integer, integer, integer, boolean, integer) from public;
grant execute on function public.track_deck_page_view(uuid, uuid, integer, integer, integer, integer, boolean, integer) to anon, authenticated;
