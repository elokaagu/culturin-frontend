import { NextResponse } from "next/server";

import { getCurrentAdminState } from "@/lib/studio/admin";

export const dynamic = "force-dynamic";

/** Whether the session user is authenticated and has Culturin admin (CMS) access. */
export async function GET() {
  const state = await getCurrentAdminState();
  return NextResponse.json({
    authenticated: Boolean(state.userId),
    isAdmin: state.isAdmin,
  });
}
