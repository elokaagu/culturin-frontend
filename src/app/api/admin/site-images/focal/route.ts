import { NextResponse } from "next/server";

import { getCurrentAdminState } from "@/lib/studio/admin";
import { smartFocalPoint } from "@/lib/smartFocal";

export const maxDuration = 30;

/** Suggest a focal point for a photo already in our storage ("Smart position" in Studio). */
export async function POST(request: Request) {
  const { isAdmin } = await getCurrentAdminState();
  if (!isAdmin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const body = (await request.json().catch(() => ({}))) as { src?: unknown };
  const src = typeof body.src === "string" ? body.src.trim() : "";
  const point = src ? await smartFocalPoint(src).catch(() => null) : null;
  if (!point) return NextResponse.json({ message: "Couldn't analyse that photo. Set the point by hand instead." }, { status: 422 });
  return NextResponse.json(point);
}
