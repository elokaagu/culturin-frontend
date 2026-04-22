import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCmsDbOrNull } from "../../../lib/cms/server";
import { getProviderBySlug } from "../../../lib/cms/queries";
import type { fullProvider } from "../../../libs/interface";
import { normalizeSlugParam } from "../../../lib/slug";
import ProviderDetailClient from "./ProviderDetailClient";

async function getProvider(slug: string): Promise<fullProvider | null> {
  const db = getCmsDbOrNull();
  if (!db) return null;
  return getProviderBySlug(db, slug);
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const provider = await getProvider(normalizeSlugParam(params.slug));
  if (!provider) {
    return { title: "Experience" };
  }
  const title = provider.eventName || provider.name || "Experience";
  return {
    title: `${title} | Culturin`,
    description: provider.description ?? undefined,
  };
}

export default async function ProviderSlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const data = await getProvider(normalizeSlugParam(params.slug));
  if (!data) {
    notFound();
  }
  return <ProviderDetailClient data={data} />;
}
