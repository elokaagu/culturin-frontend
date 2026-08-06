import type { Metadata } from "next";

import { listVideosForStudio } from "@/lib/cms/queries";
import { getCmsDbOrNull } from "@/lib/cms/server";

import { StudioVideosPageClient } from "./StudioVideosPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Videos",
  description: "Create or update hosted video entries.",
};

export default async function StudioVideosPage() {
  const db = getCmsDbOrNull();
  const videos = db ? await listVideosForStudio(db) : [];

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--c-accent)]">Content</p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[color:var(--c-ink)] sm:text-3xl">Videos</h1>
      <p className="mt-2 text-sm text-[color:var(--c-muted)]">
        Videos with a valid player ID from your host can appear on Videos, stream pages, and featured rails.
      </p>

      <StudioVideosPageClient videos={videos} hasDb={Boolean(db)} />
    </div>
  );
}
