import "server-only";

import { ctaButton, emailShell, escapeHtml, sendEmail, siteOrigin } from "@/lib/email/culturinEmail";

import { pendingItems } from "./output";
import { briefingsDb, getRequest, latestBriefing, type Briefing } from "./store";
import { EMPTY_SECTIONS, LIST_SECTIONS, type BriefingSections, type ItemReview } from "./types";

type Result = { ok: true } | { ok: false; message: string };

export function shareUrl(b: Briefing): string {
  return `${siteOrigin()}/briefings/${b.shareToken}`;
}

/** Saves the reviewer's edits. Only the latest version is editable, and only before delivery. */
export async function saveReview(
  requestId: string,
  patch: { sections?: BriefingSections; summary?: string; localNotes?: string; curatorId?: string | null },
): Promise<Result> {
  const b = await latestBriefing(requestId);
  if (!b) return { ok: false, message: "There's no briefing to edit yet." };
  if (b.deliveredAt) return { ok: false, message: "This briefing has been delivered, so it can't be edited." };
  const update: Record<string, unknown> = {};
  if (patch.sections) update.sections = { ...EMPTY_SECTIONS, ...patch.sections };
  if (typeof patch.summary === "string") update.summary = patch.summary.slice(0, 2000);
  if (typeof patch.localNotes === "string") update.local_notes = patch.localNotes.slice(0, 8000);
  if (patch.curatorId !== undefined) update.curator_id = patch.curatorId || null;
  const { error } = await briefingsDb().from("briefings").update(update).eq("id", b.id);
  return error ? { ok: false, message: error.message } : { ok: true };
}

/** Signs the briefing off. Every flagged item must have been accepted or rejected first. */
export async function approve(requestId: string, reviewerEmail: string | null): Promise<Result> {
  const [r, b] = await Promise.all([getRequest(requestId), latestBriefing(requestId)]);
  if (!r || !b) return { ok: false, message: "There's no briefing to approve yet." };
  const pending = pendingItems(b.sections);
  if (pending.length) return { ok: false, message: `${pending.length} flagged item${pending.length === 1 ? " still needs" : "s still need"} a decision.` };
  const decisions: Record<string, string> = {};
  const all: ItemReview[] = [...b.sections.snapshot.numbers];
  for (const key of LIST_SECTIONS) all.push(...(b.sections[key] as ItemReview[]));
  for (const i of all) if (i.decision) decisions[i.id] = i.decision;
  const now = new Date().toISOString();
  const db = briefingsDb();
  const [{ error }, { error: reviewError }] = await Promise.all([
    db.from("briefings").update({ reviewed_by: reviewerEmail, reviewed_at: now }).eq("id", b.id),
    db.from("briefing_reviews").insert({ briefing_id: b.id, curator_id: b.curatorId, reviewer_email: reviewerEmail, notes: b.localNotes, decisions }),
  ]);
  if (error || reviewError) return { ok: false, message: (error ?? reviewError)?.message ?? "Couldn't approve." };
  await db.from("briefing_requests").update({ status: "approved" }).eq("id", requestId);
  return { ok: true };
}

/** Emails the buyer their share link. */
export async function deliver(requestId: string): Promise<Result> {
  const [r, b] = await Promise.all([getRequest(requestId), latestBriefing(requestId)]);
  if (!r || !b) return { ok: false, message: "There's no briefing to send." };
  if (!b.reviewedAt) return { ok: false, message: "Approve the briefing before sending it." };
  if (!r.buyerEmail) return { ok: false, message: "Add the buyer's email to the request first." };
  const url = shareUrl(b);
  const first = r.buyerName?.split(/\s+/)[0];
  const intro = `${first ? `Hello ${first}, h` : "H"}ere is your Culturin briefing on ${r.place}: the food, history, music, art and people of the city, the next twelve months of moments, and ideas for your objective. Every claim links to its source.`;
  const html = emailShell({
    title: `Your Culturin briefing: ${r.place}`,
    preheader: `The culture of ${r.place}, researched and checked by Culturin.`,
    content: `<p style="margin:0 0 12px;font:600 11px/1.4 Helvetica,Arial,sans-serif;letter-spacing:0.24em;text-transform:uppercase;color:#cd6b3f;">Culturin briefing</p>
<h1 style="margin:0;font:500 30px/1.15 Georgia,serif;">${escapeHtml(r.place)}, ${escapeHtml(r.country)}</h1>
<p style="margin:16px 0 0;font:400 16px/1.6 Helvetica,Arial,sans-serif;">${escapeHtml(intro)}</p>
${ctaButton({ label: "Read the briefing", href: url })}`,
    footer: `<a href="${siteOrigin()}" style="color:inherit;">Culturin</a><br>You're getting this because you asked Culturin for a briefing.`,
  });
  const sent = await sendEmail({
    to: [r.buyerEmail],
    subject: `Your Culturin briefing: ${r.place}`,
    html,
    text: `${intro}\n\nRead the briefing: ${url}\n\nCulturin`,
  });
  if (!sent.ok) return { ok: false, message: sent.error };
  const now = new Date().toISOString();
  await Promise.all([
    briefingsDb().from("briefings").update({ delivered_at: now }).eq("id", b.id),
    briefingsDb().from("briefing_requests").update({ status: "delivered" }).eq("id", requestId),
  ]);
  return { ok: true };
}

/** Publishes (or withdraws) the public guide made from an approved briefing. */
export async function setPublished(requestId: string, publish: boolean): Promise<Result & { slug?: string }> {
  const [r, b] = await Promise.all([getRequest(requestId), latestBriefing(requestId)]);
  if (!r || !b) return { ok: false, message: "There's no guide to publish." };
  if (publish && !b.reviewedAt) return { ok: false, message: "Approve the guide before publishing it." };
  const { error } = await briefingsDb()
    .from("briefings")
    .update({ published_at: publish ? new Date().toISOString() : null })
    .eq("id", b.id);
  return error ? { ok: false, message: error.message } : { ok: true, slug: r.slug };
}

export type ViewStats = { sessions: number; visitors: number; totalSeconds: number; avgSeconds: number; avgScroll: number; pdfDownloads: number; lastViewedAt: string | null };

export async function viewStats(briefingId: string): Promise<ViewStats> {
  const { data } = await briefingsDb()
    .from("briefing_view_sessions")
    .select("visitor_id, duration_seconds, max_scroll_percent, downloaded_pdf, last_active_at")
    .eq("briefing_id", briefingId)
    .order("last_active_at", { ascending: false })
    .limit(2000);
  const rows = data ?? [];
  const total = rows.reduce((n, r) => n + Number(r.duration_seconds ?? 0), 0);
  return {
    sessions: rows.length,
    visitors: new Set(rows.map((r) => r.visitor_id)).size,
    totalSeconds: total,
    avgSeconds: rows.length ? Math.round(total / rows.length) : 0,
    avgScroll: rows.length ? Math.round(rows.reduce((n, r) => n + Number(r.max_scroll_percent ?? 0), 0) / rows.length) : 0,
    pdfDownloads: rows.filter((r) => r.downloaded_pdf).length,
    lastViewedAt: (rows[0]?.last_active_at as string | undefined) ?? null,
  };
}
