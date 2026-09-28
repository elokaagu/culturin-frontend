import "server-only";

import { createHash } from "node:crypto";

import { renderBroadcastHtml, renderBroadcastText } from "@/lib/email/broadcastRender";
import { unsubscribeOneClickUrl, unsubscribeUrl } from "@/lib/email/unsubscribe";
import { getSupabaseAdminFreshOrNull } from "@/lib/supabaseServiceRole";

export type BroadcastStatus = "draft" | "partial" | "sending" | "sent" | "failed";

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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase query builders are typed per table; this helper works across tables.
async function selectAllRows(table: string, columns: string, filter?: (q: any) => any): Promise<Record<string, unknown>[]> {
  const db = getSupabaseAdminFreshOrNull();
  if (!db) return [];
  const out: Record<string, unknown>[] = [];
  for (let from = 0; from < 200_000; from += 1000) {
    let q = db.from(table).select(columns);
    if (filter) q = filter(q);
    const { data, error } = await q.range(from, from + 999);
    if (error || !data) break;
    out.push(...(data as unknown as Record<string, unknown>[]));
    if (data.length < 1000) break;
  }
  return out;
}

/**
 * Everyone who should get broadcasts (not unsubscribed), most likely to engage first, so a
 * warm-up starts with people who'll open it: the Culturin team, then event guests and partner
 * contacts, then people who signed up on the site, then imported contacts (newest opt-ins first).
 */
export async function rankedRecipients(): Promise<string[]> {
  const [subs, rsvps, inquiries] = await Promise.all([
    selectAllRows("newsletter_subscribers", "id, email, source, created_at, optin:raw_data->>OPTIN_TIME", (q) => q.is("unsubscribed_at", null).order("id")),
    selectAllRows("event_rsvps", "email"),
    selectAllRows("partner_inquiries", "email"),
  ]);
  const engaged = new Set([...rsvps, ...inquiries].map((r) => String(r.email ?? "").trim().toLowerCase()));
  const ranked = new Map<string, { tier: number; joined: number }>();
  for (const r of subs) {
    const email = String(r.email ?? "").trim().toLowerCase();
    if (!EMAIL_RE.test(email) || ranked.has(email)) continue;
    const source = String(r.source ?? "");
    const tier = email.endsWith("@culturin.com") ? 0 : engaged.has(email) ? 1 : source === "mailchimp" || source === "csv_import" ? 3 : 2;
    const optin = typeof r.optin === "string" ? Date.parse(r.optin.replace(" ", "T") + "Z") : NaN;
    const joined = Number.isFinite(optin) ? optin : Date.parse(String(r.created_at ?? "")) || 0;
    ranked.set(email, { tier, joined });
  }
  return Array.from(ranked.entries())
    .sort((a, b) => a[1].tier - b[1].tier || b[1].joined - a[1].joined)
    .map(([email]) => email);
}

async function alreadySent(id: string): Promise<Set<string>> {
  const rows = await selectAllRows("email_broadcast_recipients", "email", (q) => q.eq("broadcast_id", id).order("email"));
  return new Set(rows.map((r) => String(r.email)));
}

export type SendProgress = { sent: number; remaining: number; total: number };

export async function getSendProgress(id: string): Promise<SendProgress> {
  const [everyone, sent] = await Promise.all([rankedRecipients(), alreadySent(id)]);
  const remaining = everyone.filter((e) => !sent.has(e)).length;
  return { sent: sent.size, remaining, total: sent.size + remaining };
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
 * Send the next `limit` people who haven't had this email yet (or everyone left when `limit` is null).
 * The broadcast is claimed (→ sending) atomically first so two clicks or two admins can't overlap;
 * a send that died mid-way (still "sending" after 10 minutes) can be picked up again.
 */
export async function sendBatch(id: string, limit: number | null, sentBy: string): Promise<{ ok: boolean; message: string }> {
  const db = getSupabaseAdminFreshOrNull();
  if (!db) return { ok: false, message: "The database isn't connected." };
  const current = await getBroadcast(id);
  if (!current) return { ok: false, message: "Email not found." };
  const invalid = validate(current);
  if (invalid) return { ok: false, message: invalid };

  // Without the recipients table we can't record who got it, and a later batch would repeat people.
  const { error: tableError } = await db.from("email_broadcast_recipients").select("email", { head: true, count: "exact" }).limit(1);
  if (tableError) return { ok: false, message: "Run supabase/migrations/045_email_broadcast_recipients.sql in Supabase first, then try again." };

  const [everyone, sentBefore] = await Promise.all([rankedRecipients(), alreadySent(id)]);
  const pending = everyone.filter((e) => !sentBefore.has(e));
  if (pending.length === 0) {
    await db.from("email_broadcasts").update({ status: "sent" }).eq("id", id).neq("status", "sending");
    return { ok: false, message: "Everyone has already been sent this email." };
  }
  const batch = limit === null ? pending : pending.slice(0, Math.max(1, Math.floor(limit)));

  const staleBefore = new Date(Date.now() - 10 * 60_000).toISOString();
  const { data: claimed } = await db
    .from("email_broadcasts")
    .update({ status: "sending", recipient_count: everyone.length, sent_by: sentBy, last_error: null })
    .eq("id", id)
    .or(`status.in.(draft,partial),and(status.eq.sending,updated_at.lt.${staleBefore})`)
    .select("status");
  if (!claimed || claimed.length === 0) return { ok: false, message: "This email is already sending. Wait for it to finish." };

  let sent = 0;
  let failed = 0;
  let lastError: string | null = null;
  for (let i = 0; i < batch.length; i += BATCH_SIZE) {
    const chunk = batch.slice(i, i + BATCH_SIZE);
    // Same people → same key, so a retried chunk is never delivered twice (Resend keeps keys for 24h).
    const key = `broadcast-${id}-${createHash("sha256").update(chunk.join(",")).digest("hex").slice(0, 32)}`;
    const err = await resendBatch(chunk.map((email) => messageFor(current, email)), key);
    if (err) {
      failed += chunk.length;
      lastError = err;
    } else {
      sent += chunk.length;
      await db
        .from("email_broadcast_recipients")
        .upsert(chunk.map((email) => ({ broadcast_id: id, email })), { onConflict: "broadcast_id,email", ignoreDuplicates: true });
    }
    if (i + BATCH_SIZE < batch.length) await new Promise((r) => setTimeout(r, BATCH_PAUSE_MS));
  }

  const totalSent = sentBefore.size + sent;
  const remaining = everyone.length - totalSent;
  await db
    .from("email_broadcasts")
    .update({
      status: remaining > 0 ? (totalSent > 0 ? "partial" : "draft") : "sent",
      sent_at: sent > 0 ? new Date().toISOString() : current.sentAt,
      sent_count: totalSent,
      failed_count: current.failedCount + failed,
      last_error: lastError,
    })
    .eq("id", id);

  if (sent === 0) return { ok: false, message: `Nothing was sent: ${lastError}` };
  return {
    ok: true,
    message: `Sent to ${sent.toLocaleString()} ${sent === 1 ? "person" : "people"}${failed ? `; ${failed} failed (${lastError})` : ""}. ${
      remaining > 0 ? `${remaining.toLocaleString()} still to go.` : "Everyone has now been sent this email."
    }`,
  };
}
