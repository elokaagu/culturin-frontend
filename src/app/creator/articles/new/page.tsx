import type { Metadata } from "next";

import { StudioArticleEditorPage } from "@/app/studio/articles/_components/StudioArticleEditorPage";

export const metadata: Metadata = {
  title: "New article",
  description: "Submit an article draft for review.",
};

const displayFont = { fontFamily: "var(--font-display), 'Times New Roman', serif" };

export default function CreatorNewArticlePage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--c-accent)" }}>Creator</p>
      <h1 className="mt-2 text-2xl font-medium tracking-tight sm:text-3xl" style={{ ...displayFont, color: "var(--c-ink)" }}>New article</h1>
      <p className="mt-2 text-sm" style={{ color: "var(--c-muted)" }}>
        Your draft is saved as a submission for the team — it will not appear on the public site until approved.
      </p>

      <div className="mt-8">
        <StudioArticleEditorPage mode="create" initial={null} workspace="creator" />
      </div>
    </div>
  );
}
