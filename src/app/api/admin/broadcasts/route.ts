import { NextResponse } from "next/server";

import { countRecipients, createBroadcast, deleteBroadcasts, listBroadcasts, saveBroadcast } from "@/lib/email/broadcasts";
import { getCurrentAdminState } from "@/lib/studio/admin";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

export async function GET() {
  const { isAdmin } = await getCurrentAdminState();
  if (!isAdmin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const [list, recipients] = await Promise.all([listBroadcasts(), countRecipients()]);
  return NextResponse.json({ ...list, recipients }, { headers: NO_STORE });
}

/** `{ action: "create" }` makes a blank draft; `{ id, subject, preheader, body }` saves one. */
export async function POST(request: Request) {
  const { isAdmin } = await getCurrentAdminState();
  if (!isAdmin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  if (body.action === "create") {
    const created = await createBroadcast();
    if (!created) return NextResponse.json({ message: "Couldn't create the email. Has migration 044 been run?" }, { status: 500 });
    return NextResponse.json({ id: created.id }, { status: 201 });
  }

  const id = typeof body.id === "string" ? body.id : "";
  if (!id) return NextResponse.json({ message: "Missing email id." }, { status: 400 });
  const err = await saveBroadcast(id, {
    subject: String(body.subject ?? "").trim(),
    preheader: String(body.preheader ?? "").trim(),
    body: body.body,
  });
  if (err) return NextResponse.json({ message: err }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const { isAdmin } = await getCurrentAdminState();
  if (!isAdmin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const body = (await request.json().catch(() => ({}))) as { ids?: unknown };
  const ids = Array.isArray(body.ids) ? body.ids.filter((v): v is string => typeof v === "string") : [];
  if (ids.length === 0) return NextResponse.json({ message: "Nothing selected." }, { status: 400 });
  const err = await deleteBroadcasts(ids);
  if (err) return NextResponse.json({ message: err }, { status: 500 });
  return NextResponse.json({ ok: true });
}
