import { NextResponse } from "next/server";

import {
  listBlogsForStudio,
  listCuratorsForStudio,
  listProvidersForStudio,
  listVideosForStudio,
} from "@/lib/cms/queries";
import { getCmsDbOrNull } from "@/lib/cms/server";
import { getCurrentAdminState } from "@/lib/studio/admin";

export const dynamic = "force-dynamic";

type ListKind = "blog" | "video" | "provider" | "curator";

/** Fresh Studio CMS lists — bypasses soft-navigation RSC cache. */
export async function GET(request: Request) {
  const { isAdmin } = await getCurrentAdminState();
  if (!isAdmin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const kind = new URL(request.url).searchParams.get("type") as ListKind | null;
  if (!kind || !["blog", "video", "provider", "curator"].includes(kind)) {
    return NextResponse.json({ message: "Invalid type." }, { status: 400 });
  }

  const db = getCmsDbOrNull();
  if (!db) {
    return NextResponse.json({ items: [] }, { headers: { "Cache-Control": "no-store" } });
  }

  const items =
    kind === "blog"
      ? await listBlogsForStudio(db)
      : kind === "video"
        ? await listVideosForStudio(db)
        : kind === "provider"
          ? await listProvidersForStudio(db)
          : await listCuratorsForStudio(db);

  return NextResponse.json(
    { items },
    { headers: { "Cache-Control": "no-store" } },
  );
}
