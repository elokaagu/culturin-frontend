import type { Metadata } from "next";

import { StudioArticleEditorPage } from "@/app/studio/articles/_components/StudioArticleEditorPage";

export const metadata: Metadata = {
  title: "New article",
  description: "Submit an article draft for review.",
};

export default function CreatorNewArticlePage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">Creator</p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl dark:text-white">New article</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-white/65">
        Your draft is saved as a submission for the team — it will not appear on the public site until approved.
      </p>

      <div className="mt-8">
        <StudioArticleEditorPage mode="create" initial={null} workspace="creator" />
      </div>
    </div>
  );
}
