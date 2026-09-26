import { NextResponse } from "next/server";

import { verifyUnsubscribe } from "@/lib/email/unsubscribe";
import { getSupabaseAdminOrNull } from "@/lib/supabaseServiceRole";

export const dynamic = "force-dynamic";

/**
 * Unsubscribes the person in a signed link. Handles both the button on /unsubscribe and
 * mail apps' one-click unsubscribe (RFC 8058), which POSTs to the List-Unsubscribe URL.
 */
export async function POST(request: Request) {
  const url = new URL(request.url);
  let e = url.searchParams.get("e");
  let t = url.searchParams.get("t");
  if (!e || !t) {
    const form = await request.formData().catch(() => null);
    e = e || (form?.get("e") as string | null) || null;
    t = t || (form?.get("t") as string | null) || null;
  }
  const email = verifyUnsubscribe(e, t);
  if (!email) return NextResponse.json({ message: "This unsubscribe link isn't valid." }, { status: 400 });

  const db = getSupabaseAdminOrNull();
  if (db) {
    await db.from("newsletter_subscribers").update({ unsubscribed_at: new Date().toISOString() }).eq("email", email).is("unsubscribed_at", null);
  }

  const isForm = (request.headers.get("content-type") ?? "").includes("application/x-www-form-urlencoded") && !url.searchParams.get("e");
  if (isForm) return NextResponse.redirect(new URL(`/unsubscribe?done=1`, url.origin), 303);
  return NextResponse.json({ ok: true });
}
