import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { AUDIENCE_KINDS, isAudienceKind } from "@/lib/studio/audience";
import { getCurrentAdminState } from "@/lib/studio/admin";
import { getSupabaseAdminFreshOrNull } from "@/lib/supabaseServiceRole";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };
const MAX_IDS_PER_REQUEST = 500;

/** Live list for one audience table (subscribers, inquiries, RSVPs, gallery downloads). */
export async function GET(request: Request) {
  const { isAdmin } = await getCurrentAdminState();
  if (!isAdmin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const kind = new URL(request.url).searchParams.get("kind");
  if (!isAudienceKind(kind)) {
    return NextResponse.json({ message: "Unknown list." }, { status: 400 });
  }

  const items = await AUDIENCE_KINDS[kind].list();
  return NextResponse.json({ items }, { headers: NO_STORE });
}

/** Permanently delete one or many rows: body `{ kind, ids: string[] }`. */
export async function DELETE(request: Request) {
  const { isAdmin } = await getCurrentAdminState();
  if (!isAdmin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const body = (await request.json().catch(() => ({}))) as { kind?: unknown; ids?: unknown };
  if (!isAudienceKind(body.kind)) {
    return NextResponse.json({ message: "Unknown list." }, { status: 400 });
  }
  const ids = Array.isArray(body.ids)
    ? Array.from(new Set(body.ids.filter((v): v is string => typeof v === "string" && v.length > 0)))
    : [];
  if (ids.length === 0) {
    return NextResponse.json({ message: "Nothing selected to delete." }, { status: 400 });
  }
  if (ids.length > MAX_IDS_PER_REQUEST) {
    return NextResponse.json({ message: `Delete at most ${MAX_IDS_PER_REQUEST} at a time.` }, { status: 400 });
  }

  const admin = getSupabaseAdminFreshOrNull();
  if (!admin) {
    return NextResponse.json({ message: "Deleting isn’t available: the database isn’t connected." }, { status: 503 });
  }

  const config = AUDIENCE_KINDS[body.kind];
  const { data, error } = await admin.from(config.table).delete().in("id", ids).select("id");
  if (error) {
    console.error(`[admin] delete from ${config.table} failed:`, error.message);
    return NextResponse.json({ message: "Could not delete. Please try again." }, { status: 500 });
  }

  revalidatePath(config.adminPath);
  revalidatePath("/admin");
  return NextResponse.json({ deleted: data?.length ?? 0 }, { headers: NO_STORE });
}
