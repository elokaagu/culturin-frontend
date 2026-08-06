import type { Metadata } from "next";

import { getCmsDbOrNull } from "@/lib/cms/server";
import type { SalesDeck } from "@/lib/salesDecks/types";

import { StudioSalesDecksPageClient } from "./StudioSalesDecksPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sales decks",
  description: "Upload partner PDFs, share interactive links, and track engagement.",
};

export default async function StudioSalesDecksPage() {
  const db = getCmsDbOrNull();
  const { data } = db
    ? await db.from("sales_decks").select("*").order("created_at", { ascending: false })
    : { data: [] as SalesDeck[] };

  const decks = (data as SalesDeck[]) || [];
  const viewCounts: Record<string, number> = {};

  if (db && decks.length > 0) {
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

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-culturin-700 dark:text-culturin-300">
        Sales
      </p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl dark:text-white">
        Sales decks
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-neutral-600 dark:text-white/65">
        Upload partner and brand PDFs. Share an interactive link — track opens, time on page, and completion.
      </p>

      <StudioSalesDecksPageClient initialDecks={decks} viewCounts={viewCounts} hasDb={Boolean(db)} />
    </div>
  );
}
