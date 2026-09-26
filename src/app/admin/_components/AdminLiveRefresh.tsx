"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const POLL_MS = 15_000;

/**
 * Keeps a server-rendered admin page live: polls the cheap counts endpoint and, when a new
 * subscriber, RSVP, inquiry or download lands, re-renders the page with fresh data.
 * Pauses while the tab is hidden and checks again as soon as it's visible.
 */
export function AdminLiveRefresh({ label = "Live" }: { label?: string }) {
  const router = useRouter();
  const last = useRef<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function check() {
      if (document.visibilityState !== "visible") return;
      try {
        const res = await fetch("/api/admin/counts", { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const c = (await res.json()) as Record<string, number>;
        const sig = [c.subscribers, c.eventRsvps, c.partnerInquiries, c.galleryDownloads, c.salesDecks].join("|");
        if (cancelled) return;
        if (last.current !== null && last.current !== sig) {
          router.refresh();
          setUpdatedAt(new Date());
        }
        if (last.current === null) setUpdatedAt(new Date());
        last.current = sig;
        setOnline(true);
      } catch {
        if (!cancelled) setOnline(false);
      }
    }

    const loop = async () => {
      await check();
      if (!cancelled) timer = setTimeout(loop, POLL_MS);
    };
    void loop();

    const onVisible = () => {
      if (document.visibilityState === "visible") void check();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [router]);

  return (
    <span className="inline-flex items-center gap-2 text-xs text-[color:var(--c-muted)]" aria-live="polite">
      <span className="relative flex h-2 w-2" aria-hidden>
        {online ? <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60 motion-reduce:animate-none" /> : null}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${online ? "bg-emerald-500" : "bg-[color:var(--c-muted)]"}`} />
      </span>
      {online ? label : "Reconnecting…"}
      {updatedAt ? <span className="tabular-nums">· updated {updatedAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span> : null}
    </span>
  );
}
