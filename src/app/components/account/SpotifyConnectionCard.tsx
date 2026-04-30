"use client";

import { useCallback, useEffect, useState } from "react";

type ConnectionPayload = {
  connection: {
    connected: boolean;
    displayName: string | null;
  };
};

export function SpotifyConnectionCard() {
  const [loading, setLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState(false);
  const [payload, setPayload] = useState<ConnectionPayload | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/me/spotify/connection", { cache: "no-store" });
      const data = (await res.json()) as ConnectionPayload & { message?: string };
      if (!res.ok) throw new Error(data.message || "Failed to load Spotify connection.");
      setPayload(data);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load Spotify connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const disconnect = useCallback(async () => {
    setDisconnecting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/me/spotify/connection", { method: "DELETE" });
      const data = (await res.json()) as { message?: string };
      if (!res.ok) throw new Error(data.message || "Failed to disconnect Spotify.");
      setPayload({ connection: { connected: false, displayName: null } });
      setMessage("Spotify disconnected.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to disconnect Spotify.");
    } finally {
      setDisconnecting(false);
    }
  }, []);

  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-white/10 dark:bg-white/5">
      <h3 className="text-base font-semibold">Spotify</h3>
      {loading ? (
        <p className="mt-2 text-sm text-neutral-600 dark:text-white/65">Checking connection...</p>
      ) : payload?.connection.connected ? (
        <>
          <p className="mt-2 text-sm text-neutral-600 dark:text-white/65">
            Connected as {payload.connection.displayName || "Spotify user"}.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300">
              Connected
            </span>
            <button
              type="button"
              onClick={() => void disconnect()}
              disabled={disconnecting}
              className="rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-50 disabled:opacity-60 dark:border-rose-400/40 dark:text-rose-300 dark:hover:bg-rose-500/10"
            >
              {disconnecting ? "Disconnecting..." : "Disconnect Spotify"}
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="mt-2 text-sm text-neutral-600 dark:text-white/65">No Spotify account connected.</p>
          <a
            href="/api/auth/spotify/start"
            className="mt-3 inline-flex rounded-lg bg-[#1DB954] px-3 py-1.5 text-xs font-semibold text-white no-underline"
          >
            Connect Spotify
          </a>
        </>
      )}
      {message ? <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">{message}</p> : null}
    </div>
  );
}
