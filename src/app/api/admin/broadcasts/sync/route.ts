import { NextResponse } from "next/server";

import { syncBroadcastFromResend } from "@/lib/email/broadcasts";
import { getCurrentAdminState } from "@/lib/studio/admin";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** `{ id }`: fill in this broadcast's delivery/open/click data from Resend's own records. */
export async function POST(request: Request) {
  const { isAdmin } = await getCurrentAdminState();
  if (!isAdmin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const body = (await request.json().catch(() => ({}))) as { id?: unknown };
  const id = typeof body.id === "string" ? body.id : "";
  if (!id) return NextResponse.json({ message: "Missing email id." }, { status: 400 });
  const result = await syncBroadcastFromResend(id);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
