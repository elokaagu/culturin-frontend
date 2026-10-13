import { NextResponse } from "next/server";

import { deleteEmailList, importToList, listEmailLists, type ListMemberInput } from "@/lib/email/lists";
import { getCurrentAdminState } from "@/lib/studio/admin";

export const dynamic = "force-dynamic";

const MAX_MEMBERS = 20_000;

export async function GET() {
  const { isAdmin } = await getCurrentAdminState();
  if (!isAdmin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  return NextResponse.json(await listEmailLists(), { headers: { "Cache-Control": "no-store" } });
}

/** `{ listId?, name?, members }`: adds guests to a list, creating it when there's no `listId`. */
export async function POST(request: Request) {
  const { isAdmin } = await getCurrentAdminState();
  if (!isAdmin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const body = (await request.json().catch(() => ({}))) as { listId?: unknown; name?: unknown; members?: unknown; addToNewsletter?: unknown };
  const members = Array.isArray(body.members) ? (body.members as ListMemberInput[]).filter((m) => m && typeof m.email === "string") : [];
  if (members.length === 0) return NextResponse.json({ message: "There's nobody with an email address in that file." }, { status: 400 });
  if (members.length > MAX_MEMBERS) return NextResponse.json({ message: `Lists can hold up to ${MAX_MEMBERS.toLocaleString()} people.` }, { status: 400 });

  const result = await importToList({
    listId: typeof body.listId === "string" ? body.listId : undefined,
    name: typeof body.name === "string" ? body.name : undefined,
    members,
    addToNewsletter: body.addToNewsletter === true,
  });
  if (!result.ok) return NextResponse.json({ message: result.message }, { status: 400 });
  return NextResponse.json(result, { status: 201 });
}

export async function DELETE(request: Request) {
  const { isAdmin } = await getCurrentAdminState();
  if (!isAdmin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const body = (await request.json().catch(() => ({}))) as { id?: unknown };
  if (typeof body.id !== "string" || !body.id) return NextResponse.json({ message: "Missing list id." }, { status: 400 });
  const err = await deleteEmailList(body.id);
  if (err) return NextResponse.json({ message: err }, { status: 400 });
  return NextResponse.json({ ok: true });
}
