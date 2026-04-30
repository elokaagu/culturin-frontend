"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type SpotifyPlaylist = {
  id: string;
  name: string;
  description: string | null;
  owner_display_name: string | null;
  tracks_total: number;
  image_url: string | null;
  spotify_url: string;
  is_public: boolean;
};

type SpotifyPayload = {
  connection: { connected: boolean; displayName: string | null };
  playlists: SpotifyPlaylist[];
};

export default function SpotifyPlaylistsPanel({ onCountChange }: { onCountChange?: (count: number) => void }) {
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [payload, setPayload] = useState<SpotifyPayload | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/me/spotify/playlists", { cache: "no-store" });
      const data = (await res.json()) as SpotifyPayload & { message?: string };
      if (!res.ok) throw new Error(data.message || "Failed to load Spotify playlists.");
      setPayload(data);
      onCountChange?.(data.playlists.length);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load Spotify playlists.");
    } finally {
      setLoading(false);
    }
  }, [onCountChange]);

  useEffect(() => {
    void load();
  }, [load]);

  const connectHref = useMemo(() => "/api/auth/spotify/start", []);

  const syncPlaylists = useCallback(async () => {
    setSyncing(true);
    setMessage(null);
    try {
      const res = await fetch("/api/me/spotify/playlists", { method: "POST" });
      const data = (await res.json()) as { message?: string };
      if (!res.ok) throw new Error(data.message || "Failed to sync playlists.");
      await load();
      setMessage("Spotify playlists synced.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to sync playlists.");
    } finally {
      setSyncing(false);
    }
  }, [load]);

  const toggleVisibility = useCallback(async (playlistId: string, isPublic: boolean) => {
    setMessage(null);
    const res = await fetch("/api/me/spotify/playlists", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ playlistId, isPublic }),
    });
    const data = (await res.json()) as { message?: string };
    if (!res.ok) {
      setMessage(data.message || "Failed to update playlist visibility.");
      return;
    }
    setPayload((current) =>
      current
        ? {
            ...current,
            playlists: current.playlists.map((playlist) =>
              playlist.id === playlistId ? { ...playlist, is_public: isPublic } : playlist,
            ),
          }
        : current,
    );
  }, []);

  if (loading) return <p className="mt-8 text-sm text-neutral-600 dark:text-white/60">Loading Spotify playlists…</p>;

  if (!payload?.connection.connected) {
    return (
      <section className="mt-8 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
        <h3 className="text-base font-semibold text-neutral-900 dark:text-white">Spotify playlists</h3>
        <p className="mt-1 text-sm text-neutral-600 dark:text-white/65">
          Connect Spotify to import your playlists and choose which ones are public.
        </p>
        <a
          href={connectHref}
          className="mt-4 inline-flex rounded-full bg-[#1DB954] px-4 py-2 text-sm font-semibold text-white no-underline"
        >
          Connect Spotify
        </a>
        {message ? <p className="mt-3 text-sm text-amber-800 dark:text-amber-200/90">{message}</p> : null}
      </section>
    );
  }

  return (
    <section className="mt-8 space-y-4 sm:mt-10">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white">Spotify playlists</h3>
            <p className="mt-1 text-sm text-neutral-600 dark:text-white/65">
              Connected as {payload.connection.displayName || "Spotify user"}.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void syncPlaylists()}
            disabled={syncing}
            className="rounded-full border border-neutral-300 px-4 py-1.5 text-sm font-medium disabled:opacity-60 dark:border-white/20"
          >
            {syncing ? "Syncing..." : "Sync playlists"}
          </button>
        </div>
      </div>

      {payload.playlists.length === 0 ? (
        <p className="rounded-xl border border-neutral-200 bg-white px-4 py-4 text-sm text-neutral-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/65">
          No playlists imported yet. Click sync to pull from Spotify.
        </p>
      ) : (
        <ul className="space-y-3">
          {payload.playlists.map((playlist) => (
            <li
              key={playlist.id}
              className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  {playlist.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={playlist.image_url} alt={playlist.name} className="h-14 w-14 rounded-md object-cover" />
                  ) : (
                    <div className="h-14 w-14 rounded-md bg-neutral-200 dark:bg-white/10" />
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-neutral-900 dark:text-white">{playlist.name}</p>
                    <p className="text-xs text-neutral-500 dark:text-white/55">{playlist.tracks_total} tracks</p>
                    <a
                      href={playlist.spotify_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-emerald-700 no-underline hover:underline dark:text-emerald-400"
                    >
                      Open on Spotify
                    </a>
                  </div>
                </div>
                <label className="flex items-center gap-2 text-xs text-neutral-600 dark:text-white/65">
                  <input
                    type="checkbox"
                    checked={playlist.is_public}
                    onChange={(ev) => void toggleVisibility(playlist.id, ev.target.checked)}
                  />
                  Public on profile
                </label>
              </div>
            </li>
          ))}
        </ul>
      )}

      {message ? <p className="text-sm text-amber-800 dark:text-amber-200/90">{message}</p> : null}
    </section>
  );
}
