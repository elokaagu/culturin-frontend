import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCmsDbOrNull } from "../../../lib/cms/server";
import { getBlogBySlug } from "../../../lib/cms/queries";
import { getShowcaseFullBlog } from "../../../lib/cms/showcaseContent";
import type { fullBlog } from "@/lib/interface";
import { isBlogHiddenFromSite } from "@/lib/cms/blockedFromSite";
import { normalizeSlugParam } from "../../../lib/slug";
import ArticleClient from "./ArticleClient";

async function getArticleBySlug(slug: string): Promise<fullBlog | null> {
  const db = getCmsDbOrNull();
  if (db) {
    const fromDb = await getBlogBySlug(db, slug);
    if (fromDb) return fromDb;
  }
  return getShowcaseFullBlog(slug);
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

  if (isBlogHiddenFromSite({ title: article.title, currentSlug: article.currentSlug })) {
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

  if (isBlogHiddenFromSite({ title: data.title, currentSlug: data.currentSlug })) {
    notFound();
  }

  return <ArticleClient data={data} />;
}
