import type { Metadata } from "next";

import { listSubscribersForStudio } from "@/lib/studio/subscribers";
import { getSupabaseAdminOrNull } from "@/lib/supabaseServiceRole";

import { StudioSubscribersPageClient } from "./StudioSubscribersPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Subscribers",
  description: "Everyone who has joined the Culturin mailing list from the site footer.",
};

export default async function StudioSubscribersPage() {
  const hasDb = Boolean(getSupabaseAdminOrNull());
  const subscribers = hasDb ? await listSubscribersForStudio() : [];

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--c-accent)]">Audience</p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[color:var(--c-ink)] sm:text-3xl">Subscribers</h1>
      <p className="mt-2 text-sm text-[color:var(--c-muted)]">
        Everyone who has joined the mailing list from the site footer or a CSV import. Click a row to see every field from the original file.
      </p>

      <StudioSubscribersPageClient subscribers={subscribers} hasDb={hasDb} />
    </div>
  );
}
