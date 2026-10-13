import { NextResponse } from "next/server";

import { generateAudienceBriefing } from "@/lib/studio/audienceBriefing";
import { getCurrentAdminState } from "@/lib/studio/admin";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST() {
  const { isAdmin, email } = await getCurrentAdminState();
  if (!isAdmin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const result = await generateAudienceBriefing(email);
  if (!result.ok) return NextResponse.json({ message: result.message }, { status: 502 });
  return NextResponse.json(result.briefing, { status: 201 });
}
