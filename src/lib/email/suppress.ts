import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

export type SuppressReason = "unsubscribed" | "bounced" | "complained";

/** Never email this address again: marks the subscriber (if there is one) and records the suppression for event-list guests too. */
export async function suppressEmail(db: SupabaseClient, rawEmail: string, reason: SuppressReason): Promise<void> {
  const email = rawEmail.trim().toLowerCase();
  if (!email) return;
  const variants = Array.from(new Set([rawEmail.trim(), email]));
  await db.from("newsletter_subscribers").update({ unsubscribed_at: new Date().toISOString() }).in("email", variants).is("unsubscribed_at", null);
  // Separate update: the reason column only exists after migration 046.
  if (reason === "unsubscribed") {
    await db.from("newsletter_subscribers").update({ suppressed_reason: reason }).in("email", variants).is("suppressed_reason", null);
  } else {
    await db.from("newsletter_subscribers").update({ suppressed_reason: reason }).in("email", variants);
  }
  // Table only exists after migration 049; a bounce or complaint outranks an unsubscribe.
  await db.from("email_suppressions").upsert({ email, reason }, { onConflict: "email", ignoreDuplicates: reason === "unsubscribed" });
}
