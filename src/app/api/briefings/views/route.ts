import { NextResponse } from "next/server";

import { briefingsDb } from "@/lib/briefings/store";

export const dynamic = "force-dynamic";

const TOKEN_RE = /^[a-f0-9]{16,64}$/;
const VISITOR_RE = /^[a-zA-Z0-9-]{8,64}$/;

/**
 * Share-link analytics, like the sales decks: `{ token, visitorId }` starts a session and returns
 * its id; `{ token, sessionId, seconds, scroll, pdf }` updates it. Only approved briefings count.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const token = typeof body.token === "string" ? body.token : "";
  if (!TOKEN_RE.test(token)) return NextResponse.json({ message: "Bad token." }, { status: 400 });
  const db = briefingsDb();
  const { data: briefing } = await db.from("briefings").select("id, reviewed_at").eq("share_token", token).maybeSingle();
  if (!briefing?.reviewed_at) return NextResponse.json({ message: "Not found." }, { status: 404 });

  if (typeof body.sessionId === "string") {
    const seconds = Math.max(0, Math.min(6 * 3600, Math.round(Number(body.seconds) || 0)));
    const scroll = Math.max(0, Math.min(100, Math.round(Number(body.scroll) || 0)));
    const { data: s } = await db
      .from("briefing_view_sessions")
      .select("max_scroll_percent, downloaded_pdf")
      .eq("id", body.sessionId)
      .eq("briefing_id", briefing.id)
      .maybeSingle();
    if (!s) return NextResponse.json({ message: "Session not found." }, { status: 404 });
    await db
      .from("briefing_view_sessions")
      .update({
        duration_seconds: seconds,
        max_scroll_percent: Math.max(Number(s.max_scroll_percent ?? 0), scroll),
        downloaded_pdf: Boolean(s.downloaded_pdf) || body.pdf === true,
        last_active_at: new Date().toISOString(),
      })
      .eq("id", body.sessionId);
    return NextResponse.json({ ok: true });
  }

  const visitorId = typeof body.visitorId === "string" && VISITOR_RE.test(body.visitorId) ? body.visitorId : null;
  if (!visitorId) return NextResponse.json({ message: "Bad visitor." }, { status: 400 });
  const { data: created, error } = await db
    .from("briefing_view_sessions")
    .insert({
      briefing_id: briefing.id,
      visitor_id: visitorId,
      user_agent: request.headers.get("user-agent")?.slice(0, 300) ?? null,
      referrer: typeof body.referrer === "string" ? body.referrer.slice(0, 300) : null,
    })
    .select("id")
    .single();
  if (error || !created) return NextResponse.json({ message: "Couldn't start the session." }, { status: 500 });
  return NextResponse.json({ sessionId: created.id });
}
