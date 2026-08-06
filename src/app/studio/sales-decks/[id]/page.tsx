import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCmsDbOrNull } from "@/lib/cms/server";
import type { DeckPageEvent, DeckPartnerLink, DeckViewSession, SalesDeck } from "@/lib/salesDecks/types";

import { StudioDeckDetailClient } from "./StudioDeckDetailClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Deck analytics",
};

type PageProps = {
  params: { id: string };
  searchParams?: { tab?: string };
};

export default async function StudioDeckDetailPage({ params, searchParams }: PageProps) {
  const db = getCmsDbOrNull();
  if (!db) notFound();

  const [{ data: deck }, { data: sessions }, { data: events }, { data: partnerLinks }] =
    await Promise.all([
      db.from("sales_decks").select("*").eq("id", params.id).maybeSingle(),
      db
        .from("deck_view_sessions")
        .select("*")
        .eq("deck_id", params.id)
        .order("started_at", { ascending: false }),
      db.from("deck_page_events").select("*").eq("deck_id", params.id),
      db
        .from("deck_partner_links")
        .select("*")
        .eq("deck_id", params.id)
        .order("created_at", { ascending: false }),
    ]);

  if (!deck) notFound();

  return (
    <div className="p-4 sm:p-6 md:max-w-4xl md:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-culturin-700 dark:text-culturin-300">
        Sales decks
      </p>
      <div className="mt-4">
        <StudioDeckDetailClient
          deck={deck as SalesDeck}
          sessions={(sessions as DeckViewSession[]) || []}
          events={(events as DeckPageEvent[]) || []}
          partnerLinks={(partnerLinks as DeckPartnerLink[]) || []}
          initialTab={searchParams?.tab === "settings" ? "settings" : "analytics"}
        />
      </div>
    </div>
  );
}
