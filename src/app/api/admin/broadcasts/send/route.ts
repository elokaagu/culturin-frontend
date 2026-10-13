import { NextResponse } from "next/server";

import { sendBatch, sendTest } from "@/lib/email/broadcasts";
import { getCurrentAdminState } from "@/lib/studio/admin";

export const dynamic = "force-dynamic";
// Sending ~2,000 emails in batches of 100 takes well under a minute; leave headroom.
export const maxDuration = 300;

/** The co-founders always get test sends. */
const TEST_RECIPIENTS = ["eloka@culturin.com", "unik@culturin.com"];

/**
 * `{ id, mode: "test" }` sends to the co-founders (and the signed-in admin, if that's someone else).
 * `{ id, mode: "batch", limit: 50 | null, confirm: true }` sends to the next `limit` people who haven't had it (null = everyone left).
 */
export async function POST(request: Request) {
  const { isAdmin, email } = await getCurrentAdminState();
  if (!isAdmin || !email) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const body = (await request.json().catch(() => ({}))) as { id?: unknown; mode?: unknown; confirm?: unknown; limit?: unknown };
  const id = typeof body.id === "string" ? body.id : "";
  if (!id) return NextResponse.json({ message: "Missing email id." }, { status: 400 });

  if (body.mode === "test") {
    const to = Array.from(new Set([...TEST_RECIPIENTS, email.trim().toLowerCase()]));
    const err = await sendTest(id, to);
    if (err) return NextResponse.json({ message: err }, { status: 400 });
    return NextResponse.json({ ok: true, message: `Test sent to ${to.join(" and ")}.` });
  }

  if (body.mode === "batch" && body.confirm === true) {
    const limit = body.limit === null ? null : Number(body.limit);
    if (limit !== null && (!Number.isFinite(limit) || limit < 1)) return NextResponse.json({ message: "Pick how many to send to." }, { status: 400 });
    const result = await sendBatch(id, limit, email);
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  }

  return NextResponse.json({ message: "Unknown send mode." }, { status: 400 });
}
