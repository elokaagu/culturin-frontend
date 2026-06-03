import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCmsDbOrNull } from "../../../lib/cms/server";
import { getCuratorBySlug, listBlogsByCurator } from "../../../lib/cms/queries";
import {
  getShowcaseFullCurator,
  getShowcaseBlogsBycurator,
} from "../../../lib/cms/showcaseContent";
import type { fullCurator, simpleBlogCard } from "@/lib/interface";
import { normalizeSlugParam } from "../../../lib/slug";
import CuratorClient from "./CuratorClient";

async function getData(slug: string): Promise<{ curator: fullCurator; articles: simpleBlogCard[] } | null> {
  const db = getCmsDbOrNull();
  if (db) {
    const curator = await getCuratorBySlug(db, slug);
    if (curator) {
      const dbArticles = await listBlogsByCurator(db, slug);
      // Fall back to showcase articles while the DB article hasn't been seeded yet
      const articles = dbArticles.length > 0 ? dbArticles : getShowcaseBlogsBycurator(slug);
      return { curator, articles };
    }
  }
  const curator = getShowcaseFullCurator(slug);
  if (!curator) return null;
  const articles = getShowcaseBlogsBycurator(slug);
  return { curator, articles };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const result = await getData(normalizeSlugParam(params.slug));
  if (!result) return { title: "Curator" };
  return {
    title: result.curator.name,
    description: result.curator.tagline ?? result.curator.description ?? undefined,
  };
}

export default async function CuratorPage({ params }: { params: { slug: string } }) {
  const result = await getData(normalizeSlugParam(params.slug));
  if (!result) notFound();
  return <CuratorClient curator={result.curator} articles={result.articles} />;
}
