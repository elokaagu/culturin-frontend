import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCmsDbOrNull } from "../../../lib/cms/server";
import { getBlogBySlug, getCuratorBySlug } from "../../../lib/cms/queries";
import type { curatorCard, fullBlog } from "@/lib/interface";
import { normalizeSlugParam } from "../../../lib/slug";
import ArticleClient from "./ArticleClient";

async function getArticleBySlug(slug: string): Promise<fullBlog | null> {
  const db = getCmsDbOrNull();
  if (!db) return null;
  const blog = await getBlogBySlug(db, slug);
  if (!blog?.publishedAt) return null;
  return blog;
}

async function getCuratorForArticle(curatorSlug: string | null | undefined): Promise<curatorCard | null> {
  if (!curatorSlug) return null;
  const db = getCmsDbOrNull();
  if (!db) return null;
  const fromDb = await getCuratorBySlug(db, curatorSlug);
  if (!fromDb) return null;
  return {
    slug: fromDb.slug,
    name: fromDb.name,
    tagline: fromDb.tagline,
    avatarUrl: fromDb.avatarUrl,
    websiteUrl: fromDb.websiteUrl,
    instagramUrl: fromDb.instagramUrl,
    specialties: fromDb.specialties,
  };
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

  const curator = await getCuratorForArticle(data.curatorSlug);

  return <ArticleClient data={data} curator={curator} />;
}
