import type { Metadata } from "next";

import { getCmsDbOrNull } from "@/lib/cms/server";
import { listBlogsForStudio } from "@/lib/cms/queries";

import { StudioArticlesPageClient } from "./StudioArticlesPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Articles & guides",
  description: "Create or update blog and guide entries.",
};

export default async function StudioArticlesPage() {
  const db = getCmsDbOrNull();
  const articles = db ? await listBlogsForStudio(db) : [];

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">Content</p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl dark:text-white">
        Articles &amp; guides
      </h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-white/65">
        Saved entries appear on Articles and the home page when you feature them.
      </p>

      <StudioArticlesPageClient articles={articles} hasDb={Boolean(db)} />
    </div>
  );
}
