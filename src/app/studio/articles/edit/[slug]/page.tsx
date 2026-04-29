import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StudioArticleEditorPage, type StudioArticleEditorInitial } from "../../_components/StudioArticleEditorPage";
import { getCmsDbOrNull } from "@/lib/cms/server";
import { getBlogBySlug } from "@/lib/cms/queries";
import { normalizeSlugParam } from "@/lib/slug";

export const dynamic = "force-dynamic";

type EditArticlePageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: EditArticlePageProps): Promise<Metadata> {
  const db = getCmsDbOrNull();
  const slug = normalizeSlugParam(params.slug);
  const blog = db ? await getBlogBySlug(db, slug) : null;
  if (!blog) {
    return { title: "Edit article" };
  }
  return {
    title: `Edit · ${blog.title}`,
    description: "Update article metadata and body.",
  };
}

export default async function StudioEditArticlePage({ params }: EditArticlePageProps) {
  const db = getCmsDbOrNull();
  if (!db) {
    notFound();
  }
  const slug = normalizeSlugParam(params.slug);
  const blog = await getBlogBySlug(db, slug);
  if (!blog) {
    notFound();
  }

  const initial: StudioArticleEditorInitial = {
    slug: blog.currentSlug,
    title: blog.title,
    summary: blog.summary ?? "",
    title_image_url: blog.titleImageUrl ?? "",
    published_at: blog.publishedAt ?? "",
    body: blog.body,
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">Content</p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl dark:text-white">
        Edit article
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-neutral-600 dark:text-white/65">
        <span className="font-medium text-neutral-800 dark:text-white/85">{blog.title}</span>
        <span className="text-neutral-500 dark:text-white/45"> · /{blog.currentSlug}</span>
      </p>

      <div className="mt-8">
        <StudioArticleEditorPage mode="edit" initial={initial} />
      </div>
    </div>
  );
}
