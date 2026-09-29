import "server-only";

import { createHash } from "node:crypto";

import { renderBroadcastHtml, renderBroadcastText } from "@/lib/email/broadcastRender";
import { unsubscribeOneClickUrl, unsubscribeUrl } from "@/lib/email/unsubscribe";
import { classifyClicks, isUnsubscribeLink } from "@/lib/email/clickClassifier";
import { describeUserAgent } from "@/lib/email/userAgent";
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
  /** Unique opens / clicks so far (null when tracking isn't set up). */
  opened?: number | null;
  clicked?: number | null;
};

const COLUMNS =
  "id, subject, preheader, body, status, recipient_count, sent_count, failed_count, sent_at, sent_by, last_error, created_at, updated_at";
const FROM_DEFAULT = "Culturin <info@culturin.com>";
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
  const items = (data as Record<string, unknown>[]).map(toBroadcast);
  // Opens and clicks (security-scanner activity excluded) for anything that has gone out.
  await Promise.all(
    items
      .filter((b) => b.sentCount > 0)
      .map(async (b) => {
        const stats = await getBroadcastStats(b.id);
        b.opened = stats.tracking ? stats.opened : null;
        b.clicked = stats.tracking ? stats.clicked : null;
      }),
  );
  return { tableReady: true, items };
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

function messageFor(b: Broadcast, email: string, test = false) {
  const unsub = unsubscribeUrl(email);
  return {
    // Lets webhook events be matched back to this broadcast (tests are kept out of the stats).
    tags: [{ name: "broadcast_id", value: test ? "test" : b.id }],
    from: process.env.EMAIL_FROM?.trim() || FROM_DEFAULT,
    to: [email],
    subject: b.subject,
    html: renderBroadcastHtml(b, unsub),
    text: renderBroadcastText(b, unsub),
    headers: { "List-Unsubscribe": `<${unsubscribeOneClickUrl(email)}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
  };
}

type BatchResult = { error: string | null; ids: string[] };

async function resendBatch(messages: ReturnType<typeof messageFor>[], idempotencyKey: string): Promise<BatchResult> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return { error: "RESEND_API_KEY isn't set.", ids: [] };
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
      body: JSON.stringify(messages),
      cache: "no-store",
    }).catch(() => null);
    if (res?.ok) {
      // Resend returns one id per message, in the order sent.
      const data = (await res.json().catch(() => ({}))) as { data?: { id?: string }[] };
      return { error: null, ids: (data.data ?? []).map((d) => String(d.id ?? "")) };
    }
    // Back off on rate limits and server errors, give up on anything else.
    if (res && res.status !== 429 && res.status < 500) {
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      return { error: data.message ?? `Resend returned ${res.status}.`, ids: [] };
    }
    await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
  }
  return { error: "Resend didn't accept this batch after 3 tries.", ids: [] };
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
  const { error } = await resendBatch(
    to.map((email) => ({ ...messageFor(b, email, true), subject: `[Test] ${b.subject}` })),
    `test-${id}-${Date.now()}`,
  );
  return error;
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
    const { error: err, ids } = await resendBatch(chunk.map((email) => messageFor(current, email)), key);
    if (err) {
      failed += chunk.length;
      lastError = err;
    } else {
      sent += chunk.length;
      const rows = chunk.map((email, j) => ({ broadcast_id: id, email, resend_id: ids[j] || null }));
      const { error: recordError } = await db
        .from("email_broadcast_recipients")
        .upsert(rows, { onConflict: "broadcast_id,email", ignoreDuplicates: true });
      // Before migration 046 there's no resend_id column; still record who got it so nobody is sent twice.
      if (recordError) {
        await db
          .from("email_broadcast_recipients")
          .upsert(chunk.map((email) => ({ broadcast_id: id, email })), { onConflict: "broadcast_id,email", ignoreDuplicates: true });
      }
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

export type EngagedPerson = {
  email: string;
  name: string;
  company: string;
  openedAt: string | null;
  clickedAt: string | null;
  bouncedAt: string | null;
  complainedAt: string | null;
  /** Clicks by the person themselves (backfilled first-batch clickers with no click detail count as 1). */
  clickCount: number;
  /** Clicks made by their company's email security scanner, not by them. */
  automatedClicks: number;
  /** True when every tracked click was a security scanner's: they didn't actually click. */
  automated: boolean;
  /** Distinct links they clicked themselves. */
  links: string[];
  /** Devices/apps seen on their own clicks (or opens, if they never clicked). */
  devices: string[];
  /** Approximate places they clicked from ("London, United Kingdom"). */
  locations: string[];
};

export type Breakdown = { label: string; people: number }[];

export type BroadcastStats = {
  /** False until migration 046 is run and Resend's webhook is sending events. */
  tracking: boolean;
  sent: number;
  delivered: number;
  /** Opens, excluding scanners that opened the email seconds after delivery and never came back. */
  opened: number;
  /** People who clicked themselves (security-scanner clicks excluded). */
  clicked: number;
  /** People whose only clicks were their email security scanner's. */
  automatedClickers: number;
  bounced: number;
  complained: number;
  /** Real clicks only. */
  topLinks: { link: string; people: number; clicks: number }[];
  /** Where people clicked from (device · browser), real clicks only. */
  clickDevices: Breakdown;
  /** Approximate click locations, real clicks only. Empty until migration 047 and new clicks. */
  clickLocations: Breakdown;
  people: EngagedPerson[];
  lastEventAt: string | null;
};

const SCANNER_OPEN_MS = 120_000;

function tally(map: Map<string, Set<string>>): Breakdown {
  return Array.from(map.entries())
    .map(([label, set]) => ({ label, people: set.size }))
    .sort((a, b) => b.people - a.people || a.label.localeCompare(b.label));
}

export async function getBroadcastStats(id: string): Promise<BroadcastStats> {
  const empty: BroadcastStats = {
    tracking: false, sent: 0, delivered: 0, opened: 0, clicked: 0, automatedClickers: 0, bounced: 0, complained: 0,
    topLinks: [], clickDevices: [], clickLocations: [], people: [], lastEventAt: null,
  };
  const db = getSupabaseAdminFreshOrNull();
  if (!db) return empty;

  const rows = await selectAllRows(
    "email_broadcast_recipients",
    "email, sent_at, delivered_at, opened_at, clicked_at, bounced_at, complained_at",
    (q) => q.eq("broadcast_id", id).order("email"),
  );
  if (rows.length === 0) {
    // Either nothing sent yet, or migration 046 isn't in (the select fails); fall back to a plain count.
    const sent = await alreadySent(id);
    return { ...empty, sent: sent.size };
  }

  const has = (r: Record<string, unknown>, k: string) => typeof r[k] === "string" && r[k] !== "";
  const deliveredAt = new Map<string, number>();
  for (const r of rows) {
    const t = Date.parse(String(r.delivered_at ?? r.sent_at ?? ""));
    if (Number.isFinite(t)) deliveredAt.set(String(r.email), t);
  }

  // Location columns only exist after migration 047.
  const geo = !(await db.from("email_events").select("city").limit(1)).error;
  const clicks = await selectAllRows(
    "email_events",
    `email, link, detail, occurred_at${geo ? ", city, country" : ""}`,
    (q) => q.eq("broadcast_id", id).eq("type", "email.clicked").order("id"),
  );
  const opens = await selectAllRows("email_events", "email, detail", (q) => q.eq("broadcast_id", id).eq("type", "email.opened").order("id"));
  const { data: last } = await db.from("email_events").select("received_at").eq("broadcast_id", id).order("received_at", { ascending: false }).limit(1);

  const automated = classifyClicks(
    clicks.map((c) => ({
      email: String(c.email ?? ""),
      link: (c.link as string | null) ?? null,
      userAgent: (c.detail as string | null) ?? null,
      at: Date.parse(String(c.occurred_at)),
    })),
    deliveredAt,
  );

  type Acc = { human: number; bot: number; links: Set<string>; devices: Set<string>; openDevices: Set<string>; places: Set<string> };
  const perPerson = new Map<string, Acc>();
  const acc = (email: string) => {
    const e = perPerson.get(email) ?? { human: 0, bot: 0, links: new Set<string>(), devices: new Set<string>(), openDevices: new Set<string>(), places: new Set<string>() };
    perPerson.set(email, e);
    return e;
  };
  const links = new Map<string, { people: Set<string>; clicks: number }>();
  const deviceMap = new Map<string, Set<string>>();
  const placeMap = new Map<string, Set<string>>();
  clicks.forEach((c, i) => {
    const email = String(c.email ?? "");
    const a = acc(email);
    if (automated[i]) {
      a.bot += 1;
      return;
    }
    const link = String(c.link ?? "");
    if (isUnsubscribeLink(link)) return; // not engagement
    a.human += 1;
    if (link) {
      a.links.add(link);
      const l = links.get(link) ?? { people: new Set<string>(), clicks: 0 };
      l.people.add(email);
      l.clicks += 1;
      links.set(link, l);
    }
    if (c.detail) {
      const d = describeUserAgent(String(c.detail));
      a.devices.add(d);
      deviceMap.set(d, (deviceMap.get(d) ?? new Set<string>()).add(email));
    }
    const place = c.city ? `${c.city}${c.country ? `, ${c.country}` : ""}` : c.country ? String(c.country) : "";
    if (place) {
      a.places.add(place);
      placeMap.set(place, (placeMap.get(place) ?? new Set<string>()).add(email));
    }
  });
  for (const o of opens) if (o.detail) acc(String(o.email ?? "")).openDevices.add(describeUserAgent(String(o.detail)));

  // Per person verdicts.
  const isScannerOnly = (email: string) => {
    const a = perPerson.get(email);
    return Boolean(a && a.bot > 0 && a.human === 0);
  };
  const clickedForReal = (r: Record<string, unknown>) => {
    const a = perPerson.get(String(r.email));
    // Tracked clicks: judge by them. No tracked clicks but a click time (backfilled): count it, unverified.
    return a && a.human + a.bot > 0 ? a.human > 0 : has(r, "clicked_at");
  };
  const openedForReal = (r: Record<string, unknown>) => {
    if (clickedForReal(r)) return true; // a real click implies they opened it
    if (!has(r, "opened_at")) return false;
    if (!isScannerOnly(String(r.email))) return true;
    // Scanner-only: an open within two minutes of delivery was the scanner too.
    const delivered = deliveredAt.get(String(r.email));
    return delivered === undefined || Date.parse(String(r.opened_at)) - delivered > SCANNER_OPEN_MS;
  };

  // Names and companies for everyone who did something notable.
  const notable = rows.filter((r) => has(r, "opened_at") || has(r, "clicked_at") || has(r, "bounced_at") || has(r, "complained_at"));
  const profiles = new Map<string, { name: string; company: string }>();
  const emails = notable.map((r) => String(r.email));
  for (let i = 0; i < emails.length; i += 200) {
    const { data } = await db.from("newsletter_subscribers").select("email, first_name, last_name, company").in("email", emails.slice(i, i + 200));
    for (const p of data ?? []) {
      profiles.set(String(p.email).toLowerCase(), {
        name: [p.first_name, p.last_name].filter(Boolean).join(" "),
        company: String(p.company ?? ""),
      });
    }
  }

  const people: EngagedPerson[] = notable
    .map((r) => {
      const email = String(r.email);
      const a = perPerson.get(email);
      const real = clickedForReal(r);
      return {
        email,
        ...(profiles.get(email) ?? { name: "", company: "" }),
        openedAt: openedForReal(r) ? ((r.opened_at as string | null) ?? (r.clicked_at as string | null) ?? null) : null,
        clickedAt: real ? ((r.clicked_at as string | null) ?? null) : null,
        bouncedAt: (r.bounced_at as string | null) ?? null,
        complainedAt: (r.complained_at as string | null) ?? null,
        clickCount: real ? Math.max(a?.human ?? 0, 1) : 0,
        automatedClicks: a?.bot ?? 0,
        automated: isScannerOnly(email),
        links: Array.from(a?.links ?? []),
        devices: Array.from((a?.devices.size ? a.devices : a?.openDevices) ?? []),
        locations: Array.from(a?.places ?? []),
      };
    })
    .sort(
      (x, y) =>
        Number(Boolean(y.clickedAt)) - Number(Boolean(x.clickedAt)) ||
        y.clickCount - x.clickCount ||
        String(y.openedAt ?? "").localeCompare(String(x.openedAt ?? "")),
    );

  return {
    tracking: rows.some((r) => has(r, "delivered_at")) || clicks.length > 0 || Boolean(last?.length),
    sent: rows.length,
    delivered: rows.filter((r) => has(r, "delivered_at")).length,
    opened: rows.filter(openedForReal).length,
    clicked: rows.filter(clickedForReal).length,
    automatedClickers: rows.filter((r) => isScannerOnly(String(r.email))).length,
    bounced: rows.filter((r) => has(r, "bounced_at")).length,
    complained: rows.filter((r) => has(r, "complained_at")).length,
    topLinks: Array.from(links.entries())
      .map(([link, v]) => ({ link, people: v.people.size, clicks: v.clicks }))
      .sort((a, b) => b.people - a.people)
      .slice(0, 10),
    clickDevices: tally(deviceMap),
    clickLocations: tally(placeMap),
    people,
    lastEventAt: (last?.[0]?.received_at as string | undefined) ?? null,
  };
}

type ResendListedEmail = { id: string; to: string[] | string; subject: string; created_at: string; last_event: string };

/** Every email Resend has on record, newest first, up to `max`. */
async function listResendEmails(max = 5000): Promise<ResendListedEmail[]> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return [];
  const out: ResendListedEmail[] = [];
  let after: string | undefined;
  while (out.length < max) {
    const url = new URL("https://api.resend.com/emails");
    url.searchParams.set("limit", "100");
    if (after) url.searchParams.set("after", after);
    const res = await fetch(url, { headers: { Authorization: `Bearer ${key}` }, cache: "no-store" }).catch(() => null);
    if (!res?.ok) break;
    const data = (await res.json().catch(() => ({}))) as { data?: ResendListedEmail[]; has_more?: boolean };
    const page = data.data ?? [];
    out.push(...page);
    if (!data.has_more || page.length === 0) break;
    after = page[page.length - 1].id;
    await new Promise((r) => setTimeout(r, 550)); // Resend allows ~2 requests/second
  }
  return out;
}

/** Resend's list returns "2026-09-28 21:56:18.711000+00", which Date.parse can't read (bare "+00"). */
function parseResendDate(v: string): number {
  const iso = v.trim().replace(" ", "T").replace(/([+-]\d{2})$/, "$1:00");
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : NaN;
}

/** Status progression; a later state implies the earlier ones (clicked ⇒ opened ⇒ delivered). */
const EVENT_RANK: Record<string, number> = { sent: 0, delivery_delayed: 0, delivered: 1, opened: 2, clicked: 3 };

/**
 * Fill in delivery/open/click/bounce data for a broadcast from Resend's own records. Covers
 * anything the webhook missed (e.g. events sent before tracking was switched on). Only fills
 * gaps; never overwrites data the webhook already recorded. Resend's list only gives each
 * email's latest status, so filled-in times are the send time, not the exact moment.
 */
export async function syncBroadcastFromResend(id: string): Promise<{ ok: boolean; message: string }> {
  const db = getSupabaseAdminFreshOrNull();
  if (!db) return { ok: false, message: "The database isn't connected." };
  const b = await getBroadcast(id);
  if (!b) return { ok: false, message: "Email not found." };

  const recipients = await selectAllRows(
    "email_broadcast_recipients",
    "email, sent_at, resend_id, delivered_at, opened_at, clicked_at, bounced_at, complained_at",
    (q) => q.eq("broadcast_id", id).order("email"),
  );
  if (recipients.length === 0) return { ok: true, message: "Nothing has been sent yet." };
  const firstSent = Math.min(...recipients.map((r) => Date.parse(String(r.sent_at)) || Date.now()));
  const byEmail = new Map(recipients.map((r) => [String(r.email).toLowerCase(), r]));

  const listed = (await listResendEmails()).filter(
    (e) => e.subject === b.subject && parseResendDate(e.created_at) >= firstSent - 10 * 60_000,
  );

  let updated = 0;
  let suppressed = 0;
  for (const e of listed) {
    const to = String(Array.isArray(e.to) ? e.to[0] : e.to).trim().toLowerCase();
    const row = byEmail.get(to);
    if (!row) continue;
    const sentMs = parseResendDate(e.created_at);
    const at = new Date(Number.isFinite(sentMs) ? sentMs : Date.now()).toISOString();
    const patch: Record<string, string> = {};
    if (!row.resend_id) patch.resend_id = e.id;
    const rank = EVENT_RANK[e.last_event] ?? -1;
    if (rank >= 1 && !row.delivered_at) patch.delivered_at = at;
    if (rank >= 2 && !row.opened_at) patch.opened_at = at;
    if (rank >= 3 && !row.clicked_at) patch.clicked_at = at;
    if (e.last_event === "bounced" && !row.bounced_at) patch.bounced_at = at;
    if (e.last_event === "complained" && !row.complained_at) patch.complained_at = at;
    if (Object.keys(patch).length === 0) continue;
    const { error } = await db.from("email_broadcast_recipients").update(patch).eq("broadcast_id", id).eq("email", row.email as string);
    if (error) return { ok: false, message: `Couldn't save: ${error.message}. Has migration 046 been run?` };
    updated++;
    // Same protection as the webhook: never email bounces or spam complaints again.
    if (patch.bounced_at || patch.complained_at) {
      await db.from("newsletter_subscribers").update({ unsubscribed_at: new Date().toISOString() }).eq("email", to).is("unsubscribed_at", null);
      await db.from("newsletter_subscribers").update({ suppressed_reason: patch.bounced_at ? "bounced" : "complained" }).eq("email", to);
      suppressed++;
    }
  }
  return {
    ok: true,
    message:
      updated === 0
        ? "Already up to date with Resend."
        : `Updated ${updated} ${updated === 1 ? "person" : "people"} from Resend${suppressed ? `; ${suppressed} bounced and won't be emailed again` : ""}.`,
  };
}
