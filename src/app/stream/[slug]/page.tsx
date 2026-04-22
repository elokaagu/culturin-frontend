import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCmsDbOrNull } from "../../../lib/cms/server";
import { getVideoBySlug } from "../../../lib/cms/queries";
import type { fullVideo } from "../../../libs/interface";
import { normalizeSlugParam } from "../../../lib/slug";
import VideoDetailClient from "./VideoDetailClient";

async function getVideo(slug: string): Promise<fullVideo | null> {
  const db = getCmsDbOrNull();
  if (!db) return null;
  return getVideoBySlug(db, slug);
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
  const data = await getVideo(normalizeSlugParam(params.slug));
  if (!data) {
    notFound();
  }
  return <VideoDetailClient data={data} />;
}
