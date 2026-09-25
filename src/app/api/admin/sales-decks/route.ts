import { NextResponse } from "next/server";

import { getCmsDbOrNull } from "@/lib/cms/server";
import type { SalesDeck } from "@/lib/salesDecks/types";
import { getCurrentAdminState } from "@/lib/studio/admin";

export const dynamic = "force-dynamic";

/** Fresh sales-deck list for Studio — bypasses soft-navigation RSC cache. */
export async function GET() {
  const { isAdmin } = await getCurrentAdminState();
  if (!isAdmin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const db = getCmsDbOrNull();
  if (!db) {
    return NextResponse.json(
      { decks: [], viewCounts: {} },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const { data, error } = await db
    .from("sales_decks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("studio sales-decks list failed", error);
    return NextResponse.json({ message: "Could not load decks." }, { status: 500 });
  }

  const decks = (data as SalesDeck[]) || [];
  const viewCounts: Record<string, number> = {};

  if (decks.length > 0) {
    const { data: sessions } = await db
      .from("deck_view_sessions")
      .select("deck_id")
      .in(
        "deck_id",
        decks.map((d) => d.id),
      );
    for (const s of sessions || []) {
      viewCounts[s.deck_id] = (viewCounts[s.deck_id] || 0) + 1;
    }
  }

  return NextResponse.json(
    { decks, viewCounts },
    { headers: { "Cache-Control": "no-store" } },
  );
}
