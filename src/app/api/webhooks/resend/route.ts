import { createHmac, timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";

import { lookupPlace } from "@/lib/email/geo";
import { getSupabaseAdminOrNull } from "@/lib/supabaseServiceRole";

export const dynamic = "force-dynamic";

const MAX_AGE_SECONDS = 5 * 60;

/** Resend signs webhooks with Svix: HMAC-SHA256 of "id.timestamp.body" using the base64 secret after "whsec_". */
function verify(req: Request, body: string): { ok: true; id: string } | { ok: false; reason: string } {
  const secret = process.env.RESEND_WEBHOOK_SECRET?.trim();
  if (!secret) return { ok: false, reason: "RESEND_WEBHOOK_SECRET isn't set" };
  const id = req.headers.get("svix-id");
  const timestamp = req.headers.get("svix-timestamp");
  const signatures = req.headers.get("svix-signature");
  if (!id || !timestamp || !signatures) return { ok: false, reason: "missing signature headers" };
  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > MAX_AGE_SECONDS) return { ok: false, reason: "stale timestamp" };

  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const expected = createHmac("sha256", key).update(`${id}.${timestamp}.${body}`).digest();
  const valid = signatures.split(" ").some((part) => {
    const [version, sig] = part.split(",");
    if (version !== "v1" || !sig) return false;
    const given = Buffer.from(sig, "base64");
    return given.length === expected.length && timingSafeEqual(given, expected);
  });
  return valid ? { ok: true, id } : { ok: false, reason: "bad signature" };
}

type ResendEvent = {
  type?: string;
  created_at?: string;
  data?: {
    email_id?: string;
    to?: string[] | string;
    tags?: Record<string, string> | { name: string; value: string }[];
    click?: { link?: string; userAgent?: string; user_agent?: string; ipAddress?: string; ip_address?: string };
    open?: { userAgent?: string; user_agent?: string };
    bounce?: { type?: string; subType?: string; message?: string };
  };
};

type Tags = NonNullable<NonNullable<ResendEvent["data"]>["tags"]>;

function tagValue(tags: Tags | undefined, name: string): string | null {
  if (!tags) return null;
  if (Array.isArray(tags)) return tags.find((t) => t.name === name)?.value ?? null;
  return (tags as Record<string, string>)[name] ?? null;
}

/** First time something happened to a recipient's email. */
const FIRST_SEEN: Record<string, string> = {
  "email.delivered": "delivered_at",
  "email.opened": "opened_at",
  "email.clicked": "clicked_at",
  "email.bounced": "bounced_at",
  "email.complained": "complained_at",
};

export async function POST(req: Request) {
  const body = await req.text();
  const check = verify(req, body);
  if (!check.ok) {
    console.warn("[resend-webhook] rejected", check.reason);
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body) as ResendEvent;
  const type = event.type ?? "unknown";
  const data = event.data ?? {};
  const resendId = data.email_id ?? null;
  const to = (Array.isArray(data.to) ? data.to[0] : data.to)?.trim().toLowerCase() ?? null;
  const tagged = tagValue(data.tags, "broadcast_id");
  if (tagged === "test") return NextResponse.json({ ok: true, ignored: "test send" });

  const db = getSupabaseAdminOrNull();
  if (!db) return NextResponse.json({ message: "Database unavailable" }, { status: 503 });

  // Match to a broadcast recipient by Resend's id, falling back to the tag + address.
  let broadcastId: string | null = null;
  let email: string | null = to;
  if (resendId) {
    const { data: row } = await db.from("email_broadcast_recipients").select("broadcast_id, email").eq("resend_id", resendId).maybeSingle();
    if (row) {
      broadcastId = String(row.broadcast_id);
      email = String(row.email);
    }
  }
  if (!broadcastId && tagged && /^[0-9a-f-]{36}$/i.test(tagged)) broadcastId = tagged;

  const bounceType = data.bounce?.type ?? "";
  // Approximate location for clicks only (opens mostly come from mail-provider proxies).
  const place = type === "email.clicked" ? await lookupPlace(data.click?.ipAddress ?? data.click?.ip_address) : null;
  const row = {
    svix_id: check.id,
    type,
    resend_id: resendId,
    broadcast_id: broadcastId,
    email,
    link: data.click?.link?.slice(0, 2000) ?? null,
    // Bounces: the reason. Opens and clicks: the reader's user agent (device and mail app).
    detail: data.bounce
      ? [bounceType, data.bounce.subType, data.bounce.message].filter(Boolean).join(" · ").slice(0, 500)
      : (data.click?.userAgent ?? data.click?.user_agent ?? data.open?.userAgent ?? data.open?.user_agent ?? "").slice(0, 500) || null,
    occurred_at: event.created_at ?? new Date().toISOString(),
  };
  let { error: insertError } = await db.from("email_events").insert(place ? { ...row, ...place } : row);
  // Location columns missing (migration 047 not run yet): keep the event, drop the location.
  if (insertError && place && insertError.code !== "23505") ({ error: insertError } = await db.from("email_events").insert(row));
  // Duplicate delivery of the same webhook: already handled.
  if (insertError?.code === "23505") return NextResponse.json({ ok: true, duplicate: true });

  const column = FIRST_SEEN[type];
  if (column && broadcastId && email) {
    await db
      .from("email_broadcast_recipients")
      .update({ [column]: event.created_at ?? new Date().toISOString() })
      .eq("broadcast_id", broadcastId)
      .eq("email", email)
      .is(column, null);
  }

  // Protect the sender reputation: never email hard bounces or people who marked it as spam again.
  const suppress = type === "email.complained" ? "complained" : type === "email.bounced" && bounceType.toLowerCase() !== "transient" ? "bounced" : null;
  if (suppress && email) {
    await db.from("newsletter_subscribers").update({ unsubscribed_at: new Date().toISOString() }).eq("email", email).is("unsubscribed_at", null);
    await db.from("newsletter_subscribers").update({ suppressed_reason: suppress }).eq("email", email);
  }

  return NextResponse.json({ ok: true });
}
