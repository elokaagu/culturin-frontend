import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { isVideoHiddenFromSite } from "@/lib/cms/blockedFromSite";
import { getCmsDbOrNull } from "../../../lib/cms/server";
import { getVideoBySlug } from "../../../lib/cms/queries";
import { getShowcaseFullVideo } from "../../../lib/cms/showcaseContent";
import type { fullVideo } from "@/lib/interface";
import { normalizeSlugParam } from "../../../lib/slug";

async function getVideo(slug: string): Promise<fullVideo | null> {
  const db = getCmsDbOrNull();
  if (db) {
    const fromDb = await getVideoBySlug(db, slug);
    if (fromDb) return fromDb;
  }
  return getShowcaseFullVideo(slug);
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const video = await getVideo(normalizeSlugParam(params.slug));
  if (!video) {
    return { title: "Video" };
  }
  if (isVideoHiddenFromSite({ title: video.title, currentSlug: video.currentSlug })) {
    return { title: "Video" };
  }
  return {
    title: `${video.title} | Culturin`,
    description: video.description ?? undefined,
  };
}

export default async function StreamVideoPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = normalizeSlugParam(params.slug);
  const video = await getVideo(slug);
  if (!video || isVideoHiddenFromSite({ title: video.title, currentSlug: video.currentSlug })) {
    notFound();
  }
  redirect(`/stream?play=${encodeURIComponent(slug)}`);
}
