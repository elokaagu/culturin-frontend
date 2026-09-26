import "server-only";

import { renderBroadcastHtml, renderBroadcastText } from "@/lib/email/broadcastRender";
import { unsubscribeOneClickUrl, unsubscribeUrl } from "@/lib/email/unsubscribe";
import { getSupabaseAdminFreshOrNull } from "@/lib/supabaseServiceRole";

export type BroadcastStatus = "draft" | "sending" | "sent" | "failed";

export type Broadcast = {
  id: string;
  subject: string;
  preheader: string;
  body: unknown;
  status: BroadcastStatus;
  recipientCount: number | null;
  sentCount: number;
  failedCount: number;
  sentAt: string | null;
  sentBy: string | null;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
};

const COLUMNS =
  "id, subject, preheader, body, status, recipient_count, sent_count, failed_count, sent_at, sent_by, last_error, created_at, updated_at";
const FROM_DEFAULT = "Culturin <hello@culturin.com>";
const BATCH_SIZE = 100; // Resend's batch limit
const BATCH_PAUSE_MS = 600; // stay under Resend's default 2 requests/second

function toBroadcast(r: Record<string, unknown>): Broadcast {
  return {
    id: String(r.id),
    subject: String(r.subject ?? ""),
    preheader: String(r.preheader ?? ""),
    body: Array.isArray(r.body) ? r.body : [],
    status: (r.status as BroadcastStatus) ?? "draft",
    recipientCount: typeof r.recipient_count === "number" ? r.recipient_count : null,
    sentCount: Number(r.sent_count ?? 0),
    failedCount: Number(r.failed_count ?? 0),
    sentAt: (r.sent_at as string | null) ?? null,
    sentBy: (r.sent_by as string | null) ?? null,
    lastError: (r.last_error as string | null) ?? null,
    createdAt: String(r.created_at ?? ""),
    updatedAt: String(r.updated_at ?? ""),
  };
}

export async function listBroadcasts(): Promise<{ tableReady: boolean; items: Broadcast[] }> {
  const db = getSupabaseAdminFreshOrNull();
  if (!db) return { tableReady: false, items: [] };
  const { data, error } = await db.from("email_broadcasts").select(COLUMNS).order("created_at", { ascending: false });
  if (error || !data) return { tableReady: false, items: [] };
  return { tableReady: true, items: (data as Record<string, unknown>[]).map(toBroadcast) };
}

export async function getBroadcast(id: string): Promise<Broadcast | null> {
  const db = getSupabaseAdminFreshOrNull();
  if (!db) return null;
  const { data } = await db.from("email_broadcasts").select(COLUMNS).eq("id", id).maybeSingle();
  return data ? toBroadcast(data as Record<string, unknown>) : null;
}

export async function createBroadcast(): Promise<Broadcast | null> {
  const db = getSupabaseAdminFreshOrNull();
  if (!db) return null;
  const { data } = await db.from("email_broadcasts").insert({ subject: "", preheader: "", body: [] }).select(COLUMNS).single();
  return data ? toBroadcast(data as Record<string, unknown>) : null;
}

export async function saveBroadcast(id: string, input: { subject: string; preheader: string; body: unknown }): Promise<string | null> {
  const db = getSupabaseAdminFreshOrNull();
  if (!db) return "The database isn't connected.";
  const { data, error } = await db
    .from("email_broadcasts")
    .update({ subject: input.subject.slice(0, 200), preheader: input.preheader.slice(0, 250), body: Array.isArray(input.body) ? input.body : [] })
    .eq("id", id)
    .eq("status", "draft")
    .select("id");
  if (error) return error.message;
  return data && data.length > 0 ? null : "Only drafts can be edited.";
}

export async function deleteBroadcasts(ids: string[]): Promise<string | null> {
  const db = getSupabaseAdminFreshOrNull();
  if (!db) return "The database isn't connected.";
  // Never delete one mid-send.
  const { error } = await db.from("email_broadcasts").delete().in("id", ids).neq("status", "sending");
  return error ? error.message : null;
}

/** Everyone on the list who hasn't unsubscribed, read page by page (Supabase caps a select at 1,000 rows). */
export async function listRecipients(): Promise<string[]> {
  const db = getSupabaseAdminFreshOrNull();
  if (!db) return [];
  const out = new Set<string>();
  for (let from = 0; from < 200_000; from += 1000) {
    const { data, error } = await db
      .from("newsletter_subscribers")
      .select("email")
      .is("unsubscribed_at", null)
      .order("id")
      .range(from, from + 999);
    if (error || !data) break;
    for (const r of data) {
      const e = String(r.email ?? "").trim().toLowerCase();
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) out.add(e);
    }
    if (data.length < 1000) break;
  }
  return Array.from(out);
}

export async function countRecipients(): Promise<number | null> {
  const db = getSupabaseAdminFreshOrNull();
  if (!db) return null;
  const { count, error } = await db.from("newsletter_subscribers").select("id", { count: "exact", head: true }).is("unsubscribed_at", null);
  return error ? null : count ?? 0;
}

function messageFor(b: Broadcast, email: string) {
  const unsub = unsubscribeUrl(email);
  return {
    from: process.env.EMAIL_FROM?.trim() || FROM_DEFAULT,
    to: [email],
    subject: b.subject,
    html: renderBroadcastHtml(b, unsub),
    text: renderBroadcastText(b, unsub),
    headers: { "List-Unsubscribe": `<${unsubscribeOneClickUrl(email)}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
  };
}

async function resendBatch(messages: ReturnType<typeof messageFor>[], idempotencyKey: string): Promise<string | null> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return "RESEND_API_KEY isn't set.";
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
      body: JSON.stringify(messages),
      cache: "no-store",
    }).catch(() => null);
    if (res?.ok) return null;
    // Back off on rate limits and server errors, give up on anything else.
    if (res && res.status !== 429 && res.status < 500) {
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      return data.message ?? `Resend returned ${res.status}.`;
    }
    await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
  }
  return "Resend didn't accept this batch after 3 tries.";
}

function validate(b: Broadcast): string | null {
  if (!b.subject.trim()) return "Add a subject line first.";
  if (!Array.isArray(b.body) || b.body.length === 0) return "The email is empty.";
  return null;
}

export async function sendTest(id: string, to: string[]): Promise<string | null> {
  const b = await getBroadcast(id);
  if (!b) return "Email not found.";
  const invalid = validate(b);
  if (invalid) return invalid;
  const err = await resendBatch(
    to.map((email) => ({ ...messageFor(b, email), subject: `[Test] ${b.subject}` })),
    `test-${id}-${Date.now()}`,
  );
  return err;
}

/**
 * Send a draft to every subscriber. The draft is claimed (draft → sending) atomically first,
 * so a double click or a second admin can't send it twice.
 */
export async function sendToAll(id: string, sentBy: string): Promise<{ ok: boolean; message: string }> {
  const db = getSupabaseAdminFreshOrNull();
  if (!db) return { ok: false, message: "The database isn't connected." };
  const current = await getBroadcast(id);
  if (!current) return { ok: false, message: "Email not found." };
  const invalid = validate(current);
  if (invalid) return { ok: false, message: invalid };

  const recipients = await listRecipients();
  if (recipients.length === 0) return { ok: false, message: "There's no one to send to." };

  const { data: claimed } = await db
    .from("email_broadcasts")
    .update({ status: "sending", recipient_count: recipients.length, sent_by: sentBy, last_error: null })
    .eq("id", id)
    .eq("status", "draft")
    .select("id");
  if (!claimed || claimed.length === 0) return { ok: false, message: "This email has already been sent or is sending." };

  let sent = 0;
  let failed = 0;
  let lastError: string | null = null;
  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const chunk = recipients.slice(i, i + BATCH_SIZE);
    const err = await resendBatch(chunk.map((email) => messageFor(current, email)), `broadcast-${id}-${i / BATCH_SIZE}`);
    if (err) {
      failed += chunk.length;
      lastError = err;
    } else {
      sent += chunk.length;
    }
    await db.from("email_broadcasts").update({ sent_count: sent, failed_count: failed }).eq("id", id);
    if (i + BATCH_SIZE < recipients.length) await new Promise((r) => setTimeout(r, BATCH_PAUSE_MS));
  }

  await db
    .from("email_broadcasts")
    .update({ status: sent > 0 ? "sent" : "failed", sent_at: new Date().toISOString(), sent_count: sent, failed_count: failed, last_error: lastError })
    .eq("id", id);

  return sent > 0
    ? { ok: true, message: `Sent to ${sent.toLocaleString()} ${sent === 1 ? "person" : "people"}${failed ? `; ${failed} failed (${lastError})` : ""}.` }
    : { ok: false, message: `Nothing was sent: ${lastError}` };
}
