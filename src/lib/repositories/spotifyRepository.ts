import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAdmin } from "../supabaseServiceRole";

export type SpotifyPlaylistRow = {
  id: string;
  user_id: string;
  spotify_playlist_id: string;
  name: string;
  description: string | null;
  owner_display_name: string | null;
  tracks_total: number;
  image_url: string | null;
  spotify_url: string;
  is_public: boolean;
  imported_at: string;
  created_at: string;
  updated_at: string;
};

type SpotifyConnectionRow = {
  user_id: string;
  spotify_user_id: string;
  spotify_display_name: string | null;
  access_token: string;
  refresh_token: string;
  token_expires_at: string;
  scope: string | null;
};

function db(): SupabaseClient {
  return getSupabaseAdmin();
}

function requireSpotifyEnv() {
  const clientId = process.env.SPOTIFY_CLIENT_ID?.trim();
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    throw new Error("Spotify OAuth is not configured. Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET.");
  }
  return { clientId, clientSecret };
}

function spotifyAuthHeader(clientId: string, clientSecret: string) {
  return `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`;
}

async function exchangeSpotifyToken(input: {
  code?: string;
  refreshToken?: string;
  redirectUri?: string;
}) {
  const { clientId, clientSecret } = requireSpotifyEnv();
  const body = new URLSearchParams();
  if (input.code && input.redirectUri) {
    body.set("grant_type", "authorization_code");
    body.set("code", input.code);
    body.set("redirect_uri", input.redirectUri);
  } else if (input.refreshToken) {
    body.set("grant_type", "refresh_token");
    body.set("refresh_token", input.refreshToken);
  } else {
    throw new Error("Invalid Spotify token request.");
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: spotifyAuthHeader(clientId, clientSecret),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const payload = (await response.json().catch(() => ({}))) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    scope?: string;
    error_description?: string;
  };
  if (!response.ok || !payload.access_token || !payload.expires_in) {
    throw new Error(payload.error_description || "Failed to authenticate with Spotify.");
  }
  return payload;
}

async function fetchSpotifyMe(accessToken: string) {
  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const payload = (await response.json().catch(() => ({}))) as {
    id?: string;
    display_name?: string;
  };
  if (!response.ok || !payload.id) {
    throw new Error("Failed to load Spotify profile.");
  }
  return payload;
}

export async function upsertSpotifyConnectionFromCode(input: {
  userId: string;
  code: string;
  redirectUri: string;
}): Promise<void> {
  const token = await exchangeSpotifyToken({ code: input.code, redirectUri: input.redirectUri });
  const me = await fetchSpotifyMe(token.access_token);
  const expiresAt = new Date(Date.now() + token.expires_in * 1000).toISOString();

  const { error } = await db().from("spotify_connections").upsert(
    {
      user_id: input.userId,
      spotify_user_id: me.id,
      spotify_display_name: me.display_name ?? null,
      access_token: token.access_token,
      refresh_token: token.refresh_token ?? "",
      token_expires_at: expiresAt,
      scope: token.scope ?? null,
    },
    { onConflict: "user_id" },
  );
  if (error) throw error;
}

async function getSpotifyConnection(userId: string): Promise<SpotifyConnectionRow | null> {
  const { data, error } = await db().from("spotify_connections").select("*").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  return (data as SpotifyConnectionRow | null) ?? null;
}

async function refreshSpotifyAccessToken(connection: SpotifyConnectionRow): Promise<SpotifyConnectionRow> {
  const token = await exchangeSpotifyToken({ refreshToken: connection.refresh_token });
  const expiresAt = new Date(Date.now() + token.expires_in * 1000).toISOString();
  const next: SpotifyConnectionRow = {
    ...connection,
    access_token: token.access_token ?? connection.access_token,
    refresh_token: token.refresh_token ?? connection.refresh_token,
    token_expires_at: expiresAt,
    scope: token.scope ?? connection.scope,
  };
  const { error } = await db()
    .from("spotify_connections")
    .update({
      access_token: next.access_token,
      refresh_token: next.refresh_token,
      token_expires_at: next.token_expires_at,
      scope: next.scope,
    })
    .eq("user_id", connection.user_id);
  if (error) throw error;
  return next;
}

async function getValidSpotifyConnection(userId: string): Promise<SpotifyConnectionRow | null> {
  const existing = await getSpotifyConnection(userId);
  if (!existing) return null;
  const expiresSoon = new Date(existing.token_expires_at).getTime() - Date.now() < 60_000;
  if (!expiresSoon) return existing;
  return refreshSpotifyAccessToken(existing);
}

export async function syncSpotifyPlaylists(userId: string): Promise<SpotifyPlaylistRow[]> {
  const connection = await getValidSpotifyConnection(userId);
  if (!connection) throw new Error("Connect Spotify first.");

  const collected: Array<{
    spotify_playlist_id: string;
    name: string;
    description: string | null;
    owner_display_name: string | null;
    tracks_total: number;
    image_url: string | null;
    spotify_url: string;
  }> = [];

  let nextUrl: string | null = "https://api.spotify.com/v1/me/playlists?limit=50";
  while (nextUrl) {
    const response = await fetch(nextUrl, {
      headers: { Authorization: `Bearer ${connection.access_token}` },
    });
    const payload = (await response.json().catch(() => ({}))) as {
      items?: Array<{
        id: string;
        name: string;
        description?: string;
        owner?: { display_name?: string };
        tracks?: { total?: number };
        images?: Array<{ url?: string }>;
        external_urls?: { spotify?: string };
      }>;
      next?: string | null;
      error?: { message?: string };
    };
    if (!response.ok) {
      throw new Error(payload.error?.message || "Failed to load Spotify playlists.");
    }
    for (const playlist of payload.items ?? []) {
      if (!playlist.id || !playlist.name || !playlist.external_urls?.spotify) continue;
      collected.push({
        spotify_playlist_id: playlist.id,
        name: playlist.name,
        description: playlist.description ?? null,
        owner_display_name: playlist.owner?.display_name ?? null,
        tracks_total: playlist.tracks?.total ?? 0,
        image_url: playlist.images?.[0]?.url ?? null,
        spotify_url: playlist.external_urls.spotify,
      });
    }
    nextUrl = payload.next ?? null;
  }

  if (collected.length > 0) {
    const { error } = await db().from("spotify_playlists").upsert(
      collected.map((playlist) => ({
        user_id: userId,
        ...playlist,
        imported_at: new Date().toISOString(),
      })),
      { onConflict: "user_id,spotify_playlist_id" },
    );
    if (error) throw error;
  }

  return listMySpotifyPlaylists(userId);
}

export async function listMySpotifyPlaylists(userId: string): Promise<SpotifyPlaylistRow[]> {
  const { data, error } = await db()
    .from("spotify_playlists")
    .select("*")
    .eq("user_id", userId)
    .order("imported_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as SpotifyPlaylistRow[];
}

export async function listPublicSpotifyPlaylistsForProfile(input: {
  userId: string;
  viewerUserId?: string | null;
}): Promise<SpotifyPlaylistRow[]> {
  let query = db().from("spotify_playlists").select("*").eq("user_id", input.userId);
  if (input.viewerUserId !== input.userId) {
    query = query.eq("is_public", true);
  }
  const { data, error } = await query.order("imported_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as SpotifyPlaylistRow[];
}

export async function setSpotifyPlaylistVisibility(input: {
  userId: string;
  playlistId: string;
  isPublic: boolean;
}): Promise<void> {
  const { error } = await db()
    .from("spotify_playlists")
    .update({ is_public: input.isPublic })
    .eq("user_id", input.userId)
    .eq("id", input.playlistId);
  if (error) throw error;
}

export async function getSpotifyConnectionStatus(userId: string): Promise<{ connected: boolean; displayName: string | null }> {
  const connection = await getSpotifyConnection(userId);
  if (!connection) return { connected: false, displayName: null };
  return { connected: true, displayName: connection.spotify_display_name };
}

export async function deleteSpotifyConnection(userId: string): Promise<void> {
  const { error } = await db().from("spotify_connections").delete().eq("user_id", userId);
  if (error) throw error;
}
