import type { Metadata } from "next";

import { StudioVideoEditorPage } from "@/app/studio/videos/_components/StudioVideoEditorPage";

export const metadata: Metadata = {
  title: "New video",
  description: "Submit a video draft for review.",
};

const displayFont = { fontFamily: "var(--font-display), 'Times New Roman', serif" };

export default function CreatorNewVideoPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--c-accent)" }}>Creator</p>
      <h1 className="mt-2 text-2xl font-medium tracking-tight sm:text-3xl" style={{ ...displayFont, color: "var(--c-ink)" }}>New video</h1>
      <p className="mt-2 text-sm" style={{ color: "var(--c-muted)" }}>
        Include your player ID and thumbnail — submissions are reviewed before publication.
      </p>

      <div className="mt-8">
        <StudioVideoEditorPage mode="create" initial={null} workspace="creator" />
      </div>
    </div>
  );
}
