"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type ListKind = "blog" | "video" | "provider" | "curator";

/**
 * Soft navigations can show a stale RSC list (e.g. old seed videos) while the
 * sidebar count is already correct. Re-fetch the live DB list on every visit.
 */
export function useStudioLiveList<T>(kind: ListKind, initial: T[]): T[] {
  const pathname = usePathname();
  const [items, setItems] = useState<T[]>(initial);
  // Length + kind is enough to pick up SSR flips without looping on array identity.
  const initialLen = initial.length;

  useEffect(() => {
    setItems(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync SSR payload by length/kind
  }, [kind, initialLen]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`/api/studio/list?type=${kind}`, { cache: "no-store" });
        if (!res.ok) return;
        const body = (await res.json()) as { items?: T[] };
        if (!cancelled && Array.isArray(body.items)) {
          setItems(body.items);
        }
      } catch (err) {
        console.error(`Studio live list (${kind}) failed`, err);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [kind, pathname]);

  return items;
}
