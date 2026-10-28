import { NextResponse } from "next/server";

import { renderBriefingPdf } from "@/lib/briefings/pdf";
import { placeSlug } from "@/lib/briefings/intake";
import { getBriefingByToken } from "@/lib/briefings/store";
import { getCurrentAdminState } from "@/lib/studio/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** The briefing as a branded PDF. Approved briefings are public by token; drafts are admin-only. */
export async function GET(_request: Request, { params }: { params: { token: string } }) {
  const found = await getBriefingByToken(params.token);
  if (!found) return NextResponse.json({ message: "Not found." }, { status: 404 });
  if (!found.briefing.reviewedAt && !(await getCurrentAdminState()).isAdmin) {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }
  try {
    const pdf = await renderBriefingPdf(found);
    const name = `culturin-${placeSlug(found.request.place)}-${found.request.kind}.pdf`;
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${name}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (err) {
    console.error("[briefings/pdf] render failed", err);
    return NextResponse.json({ message: "Couldn't build the PDF." }, { status: 500 });
  }
}
