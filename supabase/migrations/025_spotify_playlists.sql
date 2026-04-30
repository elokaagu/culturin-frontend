-- Spotify account connections and imported playlists per user.

create table if not exists public.spotify_connections (
  user_id uuid primary key references public.users(id) on delete cascade,
  spotify_user_id text not null,
  spotify_display_name text,
  access_token text not null,
  refresh_token text not null,
  token_expires_at timestamptz not null,
  scope text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.spotify_playlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  spotify_playlist_id text not null,
  name text not null,
  description text,
  owner_display_name text,
  tracks_total int not null default 0 check (tracks_total >= 0),
  image_url text,
  spotify_url text not null,
  is_public boolean not null default false,
  imported_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, spotify_playlist_id)
);

create index if not exists spotify_playlists_user_id_imported_at_idx
  on public.spotify_playlists (user_id, imported_at desc);
create index if not exists spotify_playlists_user_id_public_idx
  on public.spotify_playlists (user_id, is_public);

drop trigger if exists trg_spotify_connections_set_updated_at on public.spotify_connections;
create trigger trg_spotify_connections_set_updated_at
before update on public.spotify_connections
for each row execute function public.set_updated_at();

drop trigger if exists trg_spotify_playlists_set_updated_at on public.spotify_playlists;
create trigger trg_spotify_playlists_set_updated_at
before update on public.spotify_playlists
for each row execute function public.set_updated_at();
