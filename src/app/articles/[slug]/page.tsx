import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCmsDbOrNull } from "../../../lib/cms/server";
import { getBlogBySlug, getCuratorBySlug } from "../../../lib/cms/queries";
import { getShowcaseFullBlog, getShowcaseFullCurator } from "../../../lib/cms/showcaseContent";
import type { curatorCard, fullBlog } from "@/lib/interface";
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

async function getCuratorForArticle(curatorSlug: string | null | undefined): Promise<curatorCard | null> {
  if (!curatorSlug) return null;
  const db = getCmsDbOrNull();
  if (db) {
    const fromDb = await getCuratorBySlug(db, curatorSlug);
    if (fromDb) return { slug: fromDb.slug, name: fromDb.name, tagline: fromDb.tagline, avatarUrl: fromDb.avatarUrl, websiteUrl: fromDb.websiteUrl, instagramUrl: fromDb.instagramUrl, specialties: fromDb.specialties };
  }
  const showcase = getShowcaseFullCurator(curatorSlug);
  if (!showcase) return null;
  return { slug: showcase.slug, name: showcase.name, tagline: showcase.tagline, avatarUrl: showcase.avatarUrl, websiteUrl: showcase.websiteUrl, instagramUrl: showcase.instagramUrl, specialties: showcase.specialties };
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

  const curator = await getCuratorForArticle(data.curatorSlug);

  return <ArticleClient data={data} curator={curator} />;
}
