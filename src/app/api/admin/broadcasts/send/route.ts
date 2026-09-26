import { NextResponse } from "next/server";

import { sendTest, sendToAll } from "@/lib/email/broadcasts";
import { getCurrentAdminState } from "@/lib/studio/admin";

export const dynamic = "force-dynamic";
// Sending ~2,000 emails in batches of 100 takes well under a minute; leave headroom.
export const maxDuration = 300;

/** `{ id, mode: "test" }` sends to the signed-in admin; `{ id, mode: "all", confirm: true }` sends to every subscriber. */
export async function POST(request: Request) {
  const { isAdmin, email } = await getCurrentAdminState();
  if (!isAdmin || !email) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const body = (await request.json().catch(() => ({}))) as { id?: unknown; mode?: unknown; confirm?: unknown };
  const id = typeof body.id === "string" ? body.id : "";
  if (!id) return NextResponse.json({ message: "Missing email id." }, { status: 400 });

  if (body.mode === "test") {
    const err = await sendTest(id, [email]);
    if (err) return NextResponse.json({ message: err }, { status: 400 });
    return NextResponse.json({ ok: true, message: `Test sent to ${email}.` });
  }

  if (body.mode === "all" && body.confirm === true) {
    const result = await sendToAll(id, email);
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  }

  return NextResponse.json({ message: "Unknown send mode." }, { status: 400 });
}
