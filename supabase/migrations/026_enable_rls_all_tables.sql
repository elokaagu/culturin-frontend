-- Enable Row-Level Security on every table that was missing it and add least-privilege policies.
-- Tables already secured before this migration: cms_blogs, cms_videos, cms_providers,
--   community_travel_pins, creator_submissions.
-- newsletter_subscribers already had RLS enabled but zero policies (deny-all), so we add INSERT.

-- ─── public.users ─────────────────────────────────────────────────────────────
-- public.users.id == auth.uid() — enforced by upsertUserFromSupabaseAuth (same PK).

alter table public.users enable row level security;

-- Any authenticated user may read profiles (needed for community / follow features).
-- hashed_password is null for all Supabase-auth accounts; no secrets are exposed.
drop policy if exists "users_select_authenticated" on public.users;
create policy "users_select_authenticated"
  on public.users for select
  to authenticated
  using (true);

-- Users may only update their own row.
drop policy if exists "users_update_own" on public.users;
create policy "users_update_own"
  on public.users for update
  to authenticated
  using  (auth.uid() = id)
  with check (auth.uid() = id);

-- ─── public.articles ──────────────────────────────────────────────────────────
alter table public.articles enable row level security;

drop policy if exists "articles_select_public" on public.articles;
create policy "articles_select_public"
  on public.articles for select
  to anon, authenticated
  using (true);

-- ─── public.user_saved_articles ───────────────────────────────────────────────
alter table public.user_saved_articles enable row level security;

drop policy if exists "user_saved_articles_select_own" on public.user_saved_articles;
create policy "user_saved_articles_select_own"
  on public.user_saved_articles for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "user_saved_articles_insert_own" on public.user_saved_articles;
create policy "user_saved_articles_insert_own"
  on public.user_saved_articles for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "user_saved_articles_delete_own" on public.user_saved_articles;
create policy "user_saved_articles_delete_own"
  on public.user_saved_articles for delete
  to authenticated
  using (user_id = auth.uid());

-- ─── public.newsletter_subscribers ───────────────────────────────────────────
-- RLS was already enabled but had no policies, blocking all inserts.
-- Allow anyone to subscribe; the unique constraint prevents duplicate emails.

drop policy if exists "newsletter_subscribers_insert" on public.newsletter_subscribers;
create policy "newsletter_subscribers_insert"
  on public.newsletter_subscribers for insert
  to anon, authenticated
  with check (true);

-- ─── public.user_spot_lists ───────────────────────────────────────────────────
alter table public.user_spot_lists enable row level security;

-- Own lists and published lists are visible to everyone.
drop policy if exists "user_spot_lists_select" on public.user_spot_lists;
create policy "user_spot_lists_select"
  on public.user_spot_lists for select
  to anon, authenticated
  using (is_published = true or (auth.uid() is not null and user_id = auth.uid()));

drop policy if exists "user_spot_lists_insert_own" on public.user_spot_lists;
create policy "user_spot_lists_insert_own"
  on public.user_spot_lists for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "user_spot_lists_update_own" on public.user_spot_lists;
create policy "user_spot_lists_update_own"
  on public.user_spot_lists for update
  to authenticated
  using  (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "user_spot_lists_delete_own" on public.user_spot_lists;
create policy "user_spot_lists_delete_own"
  on public.user_spot_lists for delete
  to authenticated
  using (user_id = auth.uid());

-- ─── public.user_spot_list_items ──────────────────────────────────────────────
-- Items have no direct user_id; ownership is via the parent list.
alter table public.user_spot_list_items enable row level security;

drop policy if exists "user_spot_list_items_select" on public.user_spot_list_items;
create policy "user_spot_list_items_select"
  on public.user_spot_list_items for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.user_spot_lists l
      where l.id = list_id
        and (l.is_published = true or (auth.uid() is not null and l.user_id = auth.uid()))
    )
  );

drop policy if exists "user_spot_list_items_insert_own" on public.user_spot_list_items;
create policy "user_spot_list_items_insert_own"
  on public.user_spot_list_items for insert
  to authenticated
  with check (
    exists (
      select 1 from public.user_spot_lists l
      where l.id = list_id and l.user_id = auth.uid()
    )
  );

drop policy if exists "user_spot_list_items_update_own" on public.user_spot_list_items;
create policy "user_spot_list_items_update_own"
  on public.user_spot_list_items for update
  to authenticated
  using (
    exists (
      select 1 from public.user_spot_lists l
      where l.id = list_id and l.user_id = auth.uid()
    )
  );

drop policy if exists "user_spot_list_items_delete_own" on public.user_spot_list_items;
create policy "user_spot_list_items_delete_own"
  on public.user_spot_list_items for delete
  to authenticated
  using (
    exists (
      select 1 from public.user_spot_lists l
      where l.id = list_id and l.user_id = auth.uid()
    )
  );

-- ─── public.user_follows ──────────────────────────────────────────────────────
alter table public.user_follows enable row level security;

-- Follow relationships are public (follower counts, community suggestions).
drop policy if exists "user_follows_select_public" on public.user_follows;
create policy "user_follows_select_public"
  on public.user_follows for select
  to anon, authenticated
  using (true);

drop policy if exists "user_follows_insert_own" on public.user_follows;
create policy "user_follows_insert_own"
  on public.user_follows for insert
  to authenticated
  with check (follower_user_id = auth.uid());

drop policy if exists "user_follows_delete_own" on public.user_follows;
create policy "user_follows_delete_own"
  on public.user_follows for delete
  to authenticated
  using (follower_user_id = auth.uid());

-- ─── public.user_language_profiles ───────────────────────────────────────────
alter table public.user_language_profiles enable row level security;

drop policy if exists "user_language_profiles_select" on public.user_language_profiles;
create policy "user_language_profiles_select"
  on public.user_language_profiles for select
  to anon, authenticated
  using (is_public = true or (auth.uid() is not null and user_id = auth.uid()));

drop policy if exists "user_language_profiles_insert_own" on public.user_language_profiles;
create policy "user_language_profiles_insert_own"
  on public.user_language_profiles for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "user_language_profiles_update_own" on public.user_language_profiles;
create policy "user_language_profiles_update_own"
  on public.user_language_profiles for update
  to authenticated
  using  (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "user_language_profiles_delete_own" on public.user_language_profiles;
create policy "user_language_profiles_delete_own"
  on public.user_language_profiles for delete
  to authenticated
  using (user_id = auth.uid());

-- ─── public.vocab_items ───────────────────────────────────────────────────────
alter table public.vocab_items enable row level security;

drop policy if exists "vocab_items_select_own" on public.vocab_items;
create policy "vocab_items_select_own"
  on public.vocab_items for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "vocab_items_insert_own" on public.vocab_items;
create policy "vocab_items_insert_own"
  on public.vocab_items for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "vocab_items_update_own" on public.vocab_items;
create policy "vocab_items_update_own"
  on public.vocab_items for update
  to authenticated
  using  (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "vocab_items_delete_own" on public.vocab_items;
create policy "vocab_items_delete_own"
  on public.vocab_items for delete
  to authenticated
  using (user_id = auth.uid());

-- ─── public.flashcards ────────────────────────────────────────────────────────
alter table public.flashcards enable row level security;

drop policy if exists "flashcards_select_own" on public.flashcards;
create policy "flashcards_select_own"
  on public.flashcards for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "flashcards_insert_own" on public.flashcards;
create policy "flashcards_insert_own"
  on public.flashcards for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "flashcards_update_own" on public.flashcards;
create policy "flashcards_update_own"
  on public.flashcards for update
  to authenticated
  using  (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "flashcards_delete_own" on public.flashcards;
create policy "flashcards_delete_own"
  on public.flashcards for delete
  to authenticated
  using (user_id = auth.uid());

-- ─── public.learning_stats ────────────────────────────────────────────────────
alter table public.learning_stats enable row level security;

drop policy if exists "learning_stats_select_own" on public.learning_stats;
create policy "learning_stats_select_own"
  on public.learning_stats for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "learning_stats_insert_own" on public.learning_stats;
create policy "learning_stats_insert_own"
  on public.learning_stats for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "learning_stats_update_own" on public.learning_stats;
create policy "learning_stats_update_own"
  on public.learning_stats for update
  to authenticated
  using  (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ─── public.spotify_connections ───────────────────────────────────────────────
-- Stores OAuth access + refresh tokens — strictly own-only.
alter table public.spotify_connections enable row level security;

drop policy if exists "spotify_connections_select_own" on public.spotify_connections;
create policy "spotify_connections_select_own"
  on public.spotify_connections for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "spotify_connections_insert_own" on public.spotify_connections;
create policy "spotify_connections_insert_own"
  on public.spotify_connections for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "spotify_connections_update_own" on public.spotify_connections;
create policy "spotify_connections_update_own"
  on public.spotify_connections for update
  to authenticated
  using  (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "spotify_connections_delete_own" on public.spotify_connections;
create policy "spotify_connections_delete_own"
  on public.spotify_connections for delete
  to authenticated
  using (user_id = auth.uid());

-- ─── public.spotify_playlists ─────────────────────────────────────────────────
alter table public.spotify_playlists enable row level security;

-- Own playlists + playlists the user has marked public are readable by anyone.
drop policy if exists "spotify_playlists_select" on public.spotify_playlists;
create policy "spotify_playlists_select"
  on public.spotify_playlists for select
  to anon, authenticated
  using (is_public = true or (auth.uid() is not null and user_id = auth.uid()));

drop policy if exists "spotify_playlists_insert_own" on public.spotify_playlists;
create policy "spotify_playlists_insert_own"
  on public.spotify_playlists for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "spotify_playlists_update_own" on public.spotify_playlists;
create policy "spotify_playlists_update_own"
  on public.spotify_playlists for update
  to authenticated
  using  (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "spotify_playlists_delete_own" on public.spotify_playlists;
create policy "spotify_playlists_delete_own"
  on public.spotify_playlists for delete
  to authenticated
  using (user_id = auth.uid());
