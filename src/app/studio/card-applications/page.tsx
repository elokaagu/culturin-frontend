import type { Metadata } from "next";

import { listCardApplicationsForStudio } from "@/lib/studio/cardApplications";
import { getSupabaseAdminOrNull } from "@/lib/supabaseServiceRole";

import { StudioCardApplicationsPageClient } from "./StudioCardApplicationsPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Card Applications",
  description: "Event RSVPs and advisor applications nominated for a Culturin Card invite.",
};

export default async function StudioCardApplicationsPage() {
  const hasDb = Boolean(getSupabaseAdminOrNull());
  const applications = hasDb ? await listCardApplicationsForStudio() : [];

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--c-accent)]">Audience</p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[color:var(--c-ink)] sm:text-3xl">
        Card applications
      </h1>
      <p className="mt-2 text-sm text-[color:var(--c-muted)]">
        People nominated from event RSVPs or the advisors form for a Culturin Card invite. Invite a pending applicant
        to generate a one-time claim link.
      </p>

      <StudioCardApplicationsPageClient applications={applications} hasDb={hasDb} />
    </div>
  );
}
