import type { Metadata } from "next";

import { getCmsDbOrNull } from "@/lib/cms/server";
import { listBlogsForStudio } from "@/lib/cms/queries";

import type { ArticleFormInitial } from "./StudioArticleForm";
import { StudioArticlesPageClient } from "./StudioArticlesPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Articles & guides",
  description: "Create or update blog and guide entries.",
};

type StudioArticlesPageProps = {
  searchParams?: { edit?: string };
};

export default async function StudioArticlesPage({ searchParams }: StudioArticlesPageProps) {
  const db = getCmsDbOrNull();
  const articles = db ? await listBlogsForStudio(db) : [];
  const editSlug = searchParams?.edit?.trim() || "";
  const editing = db && editSlug
    ? await db
        .from("cms_blogs")
        .select("slug,title,summary,title_image_url,published_at")
        .eq("slug", editSlug)
        .maybeSingle()
    : null;
  const editEntry: ArticleFormInitial | null =
    editing?.data && !editing.error
      ? {
          slug: String(editing.data.slug ?? ""),
          title: String(editing.data.title ?? ""),
          summary: String(editing.data.summary ?? ""),
          title_image_url: String(editing.data.title_image_url ?? ""),
          published_at: String(editing.data.published_at ?? ""),
        }
      : null;

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">Content</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Articles &amp; guides</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-white/65">
        Saved entries appear on Articles and the home page when you feature them.
      </p>

      <StudioArticlesPageClient articles={articles} hasDb={Boolean(db)} editEntry={editEntry} />
    </div>
  );
}
