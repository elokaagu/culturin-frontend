"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { AudienceKind } from "@/lib/studio/audience";

type RemoveResult = { ok: boolean; message?: string };

type Options<T> = {
  initial: T[];
  getId: (item: T) => string;
  /** Fetch the live list. Return null when the request fails so we keep what's on screen. */
  load: () => Promise<T[] | null>;
  /** Permanently delete the given ids. */
  remove: (ids: string[]) => Promise<RemoveResult>;
};

/**
 * State for an admin list: shows the server-rendered rows immediately, then swaps in the
 * live list, and handles single/bulk delete with selection. Deleted rows are dropped
 * optimistically and confirmed by a fresh re-fetch, so nothing "comes back" on reload.
 */
export function useAdminCollection<T>({ initial, getId, load, remove }: Options<T>) {
  const [items, setItems] = useState<T[]>(initial);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const loadRef = useRef(load);
  loadRef.current = load;
  const getIdRef = useRef(getId);
  getIdRef.current = getId;

  const reload = useCallback(async () => {
    const fresh = await loadRef.current();
    if (fresh) {
      setItems(fresh);
      setSelectedIds((prev) => {
        const live = new Set(fresh.map((i) => getIdRef.current(i)));
        return new Set(Array.from(prev).filter((id) => live.has(id)));
      });
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const setAll = useCallback((ids: string[], on: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const id of ids) {
        if (on) next.add(id);
        else next.delete(id);
      }
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const deleteIds = useCallback(
    async (ids: string[]): Promise<boolean> => {
      if (ids.length === 0) return false;
      setDeleting(true);
      setError(null);
      const result = await remove(ids);
      setDeleting(false);
      if (!result.ok) {
        setError(result.message ?? "Could not delete. Please try again.");
        return false;
      }
      const gone = new Set(ids);
      setItems((prev) => prev.filter((i) => !gone.has(getIdRef.current(i))));
      setSelectedIds((prev) => new Set(Array.from(prev).filter((id) => !gone.has(id))));
      void reload();
      return true;
    },
    [remove, reload],
  );

  return useMemo(
    () => ({ items, loaded, selectedIds, toggle, setAll, clearSelection, deleteIds, deleting, error, setError, reload }),
    [items, loaded, selectedIds, toggle, setAll, clearSelection, deleteIds, deleting, error, reload],
  );
}

export async function loadAudience<T>(kind: AudienceKind): Promise<T[] | null> {
  try {
    const res = await fetch(`/api/admin/audience?kind=${kind}`, { cache: "no-store" });
    if (!res.ok) return null;
    const body = (await res.json()) as { items?: T[] };
    return Array.isArray(body.items) ? body.items : null;
  } catch {
    return null;
  }
}

export async function removeAudience(kind: AudienceKind, ids: string[]): Promise<RemoveResult> {
  try {
    const res = await fetch("/api/admin/audience", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, ids }),
    });
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    return res.ok ? { ok: true } : { ok: false, message: body.message };
  } catch {
    return { ok: false, message: "Network error. Please try again." };
  }
}
