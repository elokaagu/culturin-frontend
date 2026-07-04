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
      <p className="text-xs font-semibold uppercase tracking-wide text-culturin-700 dark:text-culturin-300">Audience</p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl dark:text-white">Subscribers</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-white/65">
        Everyone who has joined the mailing list from the site footer: first name, last name, email, and company.
      </p>

      <StudioSubscribersPageClient subscribers={subscribers} hasDb={hasDb} />
    </div>
  );
}
