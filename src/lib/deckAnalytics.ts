import type { SupabaseClient } from "@supabase/supabase-js";

const VISITOR_KEY = "culturin_deck_visitor";

export function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "server";
  try {
    const existing = localStorage.getItem(VISITOR_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export async function startDeckSession(
  db: SupabaseClient,
  params: {
    deckId: string;
    viewerEmail?: string;
    viewerName?: string;
    partnerLinkId?: string | null;
  },
) {
  const visitorId = getOrCreateVisitorId();
  const { data, error } = await db.rpc("start_deck_view_session", {
    p_deck_id: params.deckId,
    p_visitor_id: visitorId,
    p_viewer_email: params.viewerEmail || null,
    p_viewer_name: params.viewerName || null,
    p_partner_link_id: params.partnerLinkId || null,
    p_user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    p_referrer: typeof document !== "undefined" ? document.referrer || null : null,
  });

  if (error) throw error;
  if (!data) throw new Error("Failed to start deck session");
  return data as string;
}

export async function trackPageView(
  db: SupabaseClient,
  params: {
    sessionId: string;
    deckId: string;
    pageNumber: number;
    timeSpentMs: number;
    maxPageReached: number;
    pagesViewed: number;
    completed: boolean;
    durationSeconds: number;
  },
) {
  const { error } = await db.rpc("track_deck_page_view", {
    p_session_id: params.sessionId,
    p_deck_id: params.deckId,
    p_page_number: params.pageNumber,
    p_time_spent_ms: Math.max(0, Math.round(params.timeSpentMs)),
    p_max_page_reached: params.maxPageReached,
    p_pages_viewed: params.pagesViewed,
    p_completed: params.completed,
    p_duration_seconds: params.durationSeconds,
  });

  if (error) throw error;
}
