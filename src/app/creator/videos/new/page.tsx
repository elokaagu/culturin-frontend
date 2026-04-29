import type { Metadata } from "next";

import { StudioVideoEditorPage } from "@/app/studio/videos/_components/StudioVideoEditorPage";

export const metadata: Metadata = {
  title: "New video",
  description: "Submit a video draft for review.",
};

export default function CreatorNewVideoPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">Creator</p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl dark:text-white">New video</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-white/65">
        Include your player ID and thumbnail — submissions are reviewed before publication.
      </p>

      <div className="mt-8">
        <StudioVideoEditorPage mode="create" initial={null} workspace="creator" />
      </div>
    </div>
  );
}
