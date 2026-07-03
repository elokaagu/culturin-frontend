import type { Metadata } from "next";

import { listGalleryImagesForStudio } from "@/lib/cms/queries";
import { getCmsDbOrNull } from "@/lib/cms/server";

import { StudioGalleryPageClient } from "./StudioGalleryPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Add or remove photos shown on the public gallery.",
};

export default async function StudioGalleryPage() {
  const db = getCmsDbOrNull();
  const images = db ? await listGalleryImagesForStudio(db) : [];

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">Content</p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl dark:text-white">Gallery</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-white/65">
        Photos shown on the public /gallery page, grouped by event.
      </p>

      <StudioGalleryPageClient images={images} hasDb={Boolean(db)} />
    </div>
  );
}
