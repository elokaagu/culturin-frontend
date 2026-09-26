import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { siteOrigin } from "@/lib/email/culturinEmail";

/** Signing key for unsubscribe links. Set EMAIL_UNSUBSCRIBE_SECRET; falls back to the service role key. */
function secret(): string {
  return process.env.EMAIL_UNSUBSCRIBE_SECRET?.trim() || process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";
}

const b64url = (s: string) => Buffer.from(s, "utf8").toString("base64url");

function sign(email: string): string {
  return createHmac("sha256", secret()).update(`unsubscribe:${email.toLowerCase()}`).digest("base64url").slice(0, 32);
}

/** A per-person link that unsubscribes them without signing in. */
export function unsubscribeUrl(email: string): string {
  const e = email.trim().toLowerCase();
  return `${siteOrigin()}/unsubscribe?e=${b64url(e)}&t=${sign(e)}`;
}

/** The one-click endpoint mail apps POST to (List-Unsubscribe header). */
export function unsubscribeOneClickUrl(email: string): string {
  const e = email.trim().toLowerCase();
  return `${siteOrigin()}/api/unsubscribe?e=${b64url(e)}&t=${sign(e)}`;
}

/** Returns the email for a valid link, otherwise null. */
export function verifyUnsubscribe(e: string | null, t: string | null): string | null {
  if (!e || !t || !secret()) return null;
  let email: string;
  try {
    email = Buffer.from(e, "base64url").toString("utf8").trim().toLowerCase();
  } catch {
    return null;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  const expected = Buffer.from(sign(email));
  const given = Buffer.from(t);
  return expected.length === given.length && timingSafeEqual(expected, given) ? email : null;
}
