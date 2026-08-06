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
  const { data, error } = await db
    .from("deck_view_sessions")
    .insert({
      deck_id: params.deckId,
      visitor_id: visitorId,
      viewer_email: params.viewerEmail || null,
      viewer_name: params.viewerName || null,
      partner_link_id: params.partnerLinkId || null,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
      referrer: typeof document !== "undefined" ? document.referrer || null : null,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id as string;
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
  await Promise.all([
    db.from("deck_page_events").insert({
      session_id: params.sessionId,
      deck_id: params.deckId,
      page_number: params.pageNumber,
      time_spent_ms: Math.max(0, Math.round(params.timeSpentMs)),
    }),
    db
      .from("deck_view_sessions")
      .update({
        last_active_at: new Date().toISOString(),
        duration_seconds: params.durationSeconds,
        max_page_reached: params.maxPageReached,
        pages_viewed: params.pagesViewed,
        completed: params.completed,
      })
      .eq("id", params.sessionId),
  ]);
}
