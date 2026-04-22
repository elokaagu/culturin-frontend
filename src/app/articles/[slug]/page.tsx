import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCmsDbOrNull } from "../../../lib/cms/server";
import { getBlogBySlug } from "../../../lib/cms/queries";
import type { fullBlog } from "../../../libs/interface";
import { normalizeSlugParam } from "../../../lib/slug";
import ArticleClient from "./ArticleClient";

async function getArticleBySlug(slug: string): Promise<fullBlog | null> {
  const db = getCmsDbOrNull();
  if (!db) return null;
  return getBlogBySlug(db, slug);
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getArticleBySlug(normalizeSlugParam(params.slug));

  if (!article) {
    return { title: "Article" };
  }

  return {
    title: article.title,
    description: article.summary ?? undefined,
  };
}

export default async function BlogArticle({
  params,
}: {
  params: { slug: string };
}) {
  const data = await getArticleBySlug(normalizeSlugParam(params.slug));

  if (!data) {
    notFound();
  }

  return <ArticleClient data={data} />;
}
