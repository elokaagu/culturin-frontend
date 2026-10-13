import { NextResponse } from "next/server";

import { renderBroadcastReport } from "@/lib/email/broadcastReport";
import { getBroadcast, getBroadcastStats, getSendProgress } from "@/lib/email/broadcasts";
import { getCurrentAdminState } from "@/lib/studio/admin";
import { getSupabaseAdminFreshOrNull } from "@/lib/supabaseServiceRole";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

async function audienceName(listId: string | null): Promise<string> {
  if (!listId) return "the Culturin mailing list";
  const { data } = (await getSupabaseAdminFreshOrNull()?.from("email_lists").select("name").eq("id", listId).maybeSingle()) ?? {};
  return data?.name ? `the ${data.name} guest list` : "an event guest list";
}

/** `?id=` → a Culturin-branded PDF of the email's results. */
export async function GET(request: Request) {
  const { isAdmin } = await getCurrentAdminState();
  if (!isAdmin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const id = new URL(request.url).searchParams.get("id") ?? "";
  const broadcast = id ? await getBroadcast(id) : null;
  if (!broadcast) return NextResponse.json({ message: "Email not found." }, { status: 404 });

  const [progress, stats, audience] = await Promise.all([getSendProgress(id), getBroadcastStats(id), audienceName(broadcast.listId)]);
  try {
    const pdf = await renderBroadcastReport({ broadcast, stats, sent: progress.sent, total: progress.total, audience });
    const filename = `culturin-report-${(broadcast.subject || "email").replace(/[^a-z0-9]+/gi, "-").toLowerCase().replace(/^-|-$/g, "")}.pdf`;
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[broadcasts/report] PDF render failed", err);
    return NextResponse.json({ message: "Couldn't build the PDF report." }, { status: 500 });
  }
}
