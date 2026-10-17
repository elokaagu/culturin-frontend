import { NextResponse } from "next/server";

import { PROSPECTUS_FILENAME, renderProspectus } from "@/lib/partners/prospectusPdf";

export const runtime = "nodejs";
export const maxDuration = 60;
// Rendered on request (not at build time) and cached at the edge for a day via Cache-Control.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const pdf = await renderProspectus();
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${PROSPECTUS_FILENAME}"`,
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (err) {
    console.error("[partners/prospectus] PDF render failed", err);
    return NextResponse.json({ message: "Couldn't build the prospectus." }, { status: 500 });
  }
}
