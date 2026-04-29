import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StudioVideoEditorPage, type StudioVideoEditorInitial } from "../../_components/StudioVideoEditorPage";
import { getCmsDbOrNull } from "@/lib/cms/server";
import { getVideoBySlug } from "@/lib/cms/queries";
import { normalizeSlugParam } from "@/lib/slug";

export const dynamic = "force-dynamic";

type EditVideoPageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: EditVideoPageProps): Promise<Metadata> {
  const db = getCmsDbOrNull();
  const slug = normalizeSlugParam(params.slug);
  const video = db ? await getVideoBySlug(db, slug) : null;
  if (!video) {
    return { title: "Edit video" };
  }
  return {
    title: `Edit · ${video.title}`,
    description: "Update video metadata and player settings.",
  };
}

export default async function StudioEditVideoPage({ params }: EditVideoPageProps) {
  const db = getCmsDbOrNull();
  if (!db) {
    notFound();
  }
  const slug = normalizeSlugParam(params.slug);
  const video = await getVideoBySlug(db, slug);
  if (!video) {
    notFound();
  }

  const initial: StudioVideoEditorInitial = {
    slug: video.currentSlug,
    title: video.title,
    uploader: video.uploader,
    description: video.description,
    thumbnail_url: video.videoThumbnailUrl ?? "",
    playback_id: video.playbackId,
    published_at: video.publishedAt ?? "",
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">Content</p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl dark:text-white">Edit video</h1>
      <p className="mt-2 max-w-2xl text-sm text-neutral-600 dark:text-white/65">
        <span className="font-medium text-neutral-800 dark:text-white/85">{video.title}</span>
        <span className="text-neutral-500 dark:text-white/45"> · /{video.currentSlug}</span>
      </p>

      <div className="mt-8">
        <StudioVideoEditorPage mode="edit" initial={initial} />
      </div>
    </div>
  );
}
