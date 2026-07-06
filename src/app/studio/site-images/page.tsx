import type { Metadata } from "next";

import { getSiteImagesMap, SITE_IMAGE_SLOTS, manifestDefault } from "@/lib/siteImages";
import { getSupabaseAdminOrNull } from "@/lib/supabaseServiceRole";

import { StudioSiteImagesPageClient } from "./StudioSiteImagesPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Site Images",
  description: "Replace the fixed homepage and event photos shown across the marketing site.",
};

export default async function StudioSiteImagesPage() {
  const hasDb = Boolean(getSupabaseAdminOrNull());
  const map = hasDb ? await getSiteImagesMap() : {};

  const slots = SITE_IMAGE_SLOTS.map((slot) => {
    const row = map[slot.key];
    const current = row && row.src ? row : manifestDefault(slot.key);
    return {
      key: slot.key,
      label: slot.label,
      src: current.src,
      alt: current.alt,
      isCustomized: Boolean(row && row.src),
    };
  });

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-culturin-700 dark:text-culturin-300">Content</p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl dark:text-white">Site images</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-white/65">
        Replace the homepage hero, gallery preview grid, and event card photos (homepage upcoming events, events
        index, and event detail pages) without a code change. Each of these is a fixed spot on the site, so
        there&apos;s no delete here — just swap in a different photo.
      </p>

      <StudioSiteImagesPageClient slots={slots} hasDb={hasDb} />
    </div>
  );
}
