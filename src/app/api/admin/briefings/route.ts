import { NextResponse } from "next/server";

import { createRequest, validateIntake } from "@/lib/briefings/intake";
import { listRequests } from "@/lib/briefings/store";
import { getCurrentAdminState } from "@/lib/studio/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const { isAdmin } = await getCurrentAdminState();
  if (!isAdmin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  return NextResponse.json(await listRequests(), { headers: { "Cache-Control": "no-store" } });
}

/** Intake: creates a queued request. The runner (or the admin page) then advances it. */
export async function POST(request: Request) {
  const { isAdmin, email } = await getCurrentAdminState();
  if (!isAdmin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const checked = validateIntake(body);
  if (!checked.ok) return NextResponse.json({ message: checked.message }, { status: 400 });
  try {
    const created = await createRequest(checked.input, email);
    return NextResponse.json({ id: created.id }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: err instanceof Error ? err.message : "Couldn't create the request." }, { status: 500 });
  }
}
