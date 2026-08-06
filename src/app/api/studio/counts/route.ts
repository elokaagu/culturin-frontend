import { NextResponse } from "next/server";

import { getCurrentAdminState } from "@/lib/studio/admin";
import { getStudioCounts } from "@/lib/studio/getStudioCounts";

export const dynamic = "force-dynamic";

/** Fresh Studio nav badge counts — bypasses soft-navigation RSC cache. */
export async function GET() {
  const { isAdmin } = await getCurrentAdminState();
  if (!isAdmin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const counts = await getStudioCounts();
  return NextResponse.json(counts, {
    headers: { "Cache-Control": "no-store" },
  });
}
