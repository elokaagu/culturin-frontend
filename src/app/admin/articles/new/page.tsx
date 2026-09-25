import type { Metadata } from "next";

import { StudioArticleEditorPage } from "../_components/StudioArticleEditorPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New article",
  description: "Create a new guide or article with rich text.",
};

export default function StudioNewArticlePage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--c-accent)]">Content</p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[color:var(--c-ink)] sm:text-3xl">
        New article
      </h1>
      <p className="mt-2 text-sm text-[color:var(--c-muted)]">
        Set the slug and metadata, add a title image, then write the full story in the editor below.
      </p>

      <div className="mt-8">
        <StudioArticleEditorPage mode="create" initial={null} />
      </div>
    </div>
  );
}
