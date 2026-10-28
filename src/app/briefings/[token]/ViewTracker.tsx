"use client";

import { useEffect } from "react";

const VISITOR_KEY = "culturin_briefing_visitor";

function visitorId(): string {
  try {
    const existing = window.localStorage.getItem(VISITOR_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    window.localStorage.setItem(VISITOR_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

/**
 * Share-link analytics, like the sales decks: one session per open, with time on page, how far
 * down the reader got, and whether they took the PDF. Counts only while the tab is visible.
 */
export function ViewTracker({ token }: { token: string }) {
  useEffect(() => {
    let sessionId: string | null = null;
    let seconds = 0;
    let scroll = 0;
    let pdf = false;
    const post = (body: Record<string, unknown>, beacon = false) => {
      const payload = JSON.stringify({ token, ...body });
      if (beacon && navigator.sendBeacon) return navigator.sendBeacon("/api/briefings/views", new Blob([payload], { type: "application/json" }));
      return fetch("/api/briefings/views", { method: "POST", headers: { "Content-Type": "application/json" }, body: payload, keepalive: true }).then((r) => r.json());
    };
    const beat = (beacon = false) => {
      if (sessionId) void post({ sessionId, seconds, scroll, pdf }, beacon);
    };
    void (post({ visitorId: visitorId(), referrer: document.referrer || null }) as Promise<{ sessionId?: string }>)
      .then((d) => {
        sessionId = d.sessionId ?? null;
      })
      .catch(() => undefined);

    const clock = setInterval(() => {
      if (document.visibilityState === "visible") seconds++;
    }, 1000);
    const heartbeat = setInterval(() => beat(), 15_000);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll = Math.max(scroll, max > 0 ? Math.round((window.scrollY / max) * 100) : 100);
    };
    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("[data-briefing-pdf]")) {
        pdf = true;
        beat();
      }
    };
    const onHide = () => {
      if (document.visibilityState === "hidden") beat(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      clearInterval(clock);
      clearInterval(heartbeat);
      beat(true);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [token]);
  return null;
}
