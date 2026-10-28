import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { approve, deliver, saveReview, setPublished } from "@/lib/briefings/review";
import { getRequest, latestBriefing } from "@/lib/briefings/store";
import type { BriefingSections } from "@/lib/briefings/types";
import { getCurrentAdminState } from "@/lib/studio/admin";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const { isAdmin } = await getCurrentAdminState();
  if (!isAdmin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const [request, briefing] = await Promise.all([getRequest(params.id), latestBriefing(params.id)]);
  if (!request) return NextResponse.json({ message: "Request not found." }, { status: 404 });
  return NextResponse.json({ request, briefing }, { headers: { "Cache-Control": "no-store" } });
}

/** Saves review edits: `{ sections?, summary?, localNotes?, curatorId? }`. */
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { isAdmin } = await getCurrentAdminState();
  if (!isAdmin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const body = (await request.json().catch(() => ({}))) as {
    sections?: BriefingSections;
    summary?: string;
    localNotes?: string;
    curatorId?: string | null;
  };
  const res = await saveReview(params.id, body);
  return res.ok ? NextResponse.json({ ok: true }) : NextResponse.json({ message: res.message }, { status: 400 });
}

/** `{ action: "approve" | "deliver" | "publish" | "unpublish" }`. */
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { isAdmin, email } = await getCurrentAdminState();
  if (!isAdmin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const { action } = (await request.json().catch(() => ({}))) as { action?: string };
  if (action === "approve") {
    const res = await approve(params.id, email);
    return res.ok ? NextResponse.json({ ok: true }) : NextResponse.json({ message: res.message }, { status: 400 });
  }
  if (action === "deliver") {
    const res = await deliver(params.id);
    return res.ok ? NextResponse.json({ ok: true }) : NextResponse.json({ message: res.message }, { status: 400 });
  }
  if (action === "publish" || action === "unpublish") {
    const res = await setPublished(params.id, action === "publish");
    if (!res.ok) return NextResponse.json({ message: res.message }, { status: 400 });
    if (res.slug) {
      revalidatePath(`/destinations/${res.slug}/guide`);
      revalidatePath(`/destinations/${res.slug}`);
    }
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ message: "Unknown action." }, { status: 400 });
}
