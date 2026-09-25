import type { Metadata } from "next";

import { listGalleryDownloadsForStudio } from "@/lib/studio/galleryDownloads";
import { getSupabaseAdminOrNull } from "@/lib/supabaseServiceRole";

import { StudioGalleryDownloadsPageClient } from "./StudioGalleryDownloadsPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery Downloads",
  description: "Everyone who has downloaded a full-quality photo from /gallery.",
};

export default async function StudioGalleryDownloadsPage() {
  const hasDb = Boolean(getSupabaseAdminOrNull());
  const downloads = hasDb ? await listGalleryDownloadsForStudio() : [];

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--c-accent)]">Audience</p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[color:var(--c-ink)] sm:text-3xl">Gallery downloads</h1>
      <p className="mt-2 text-sm text-[color:var(--c-muted)]">
        Everyone who has downloaded a full-quality photo from the public gallery, and which photo they took.
      </p>

      <StudioGalleryDownloadsPageClient downloads={downloads} hasDb={hasDb} />
    </div>
  );
}
