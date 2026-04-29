import type { Metadata } from "next";

import { listVideosForStudio } from "@/lib/cms/queries";
import { getCmsDbOrNull } from "@/lib/cms/server";

import type { VideoFormInitial } from "./StudioVideoForm";
import { StudioVideosPageClient } from "./StudioVideosPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Videos",
  description: "Create or update hosted video entries.",
};

type StudioVideosPageProps = {
  searchParams?: { edit?: string };
};

export default async function StudioVideosPage({ searchParams }: StudioVideosPageProps) {
  const db = getCmsDbOrNull();
  const videos = db ? await listVideosForStudio(db) : [];
  const editSlug = searchParams?.edit?.trim() || "";
  const editing = db && editSlug
    ? await db
        .from("cms_videos")
        .select("slug,title,uploader,description,thumbnail_url,playback_id,published_at")
        .eq("slug", editSlug)
        .maybeSingle()
    : null;
  const editEntry: VideoFormInitial | null =
    editing?.data && !editing.error
      ? {
          slug: String(editing.data.slug ?? ""),
          title: String(editing.data.title ?? ""),
          uploader: String(editing.data.uploader ?? ""),
          description: String(editing.data.description ?? ""),
          thumbnail_url: String(editing.data.thumbnail_url ?? ""),
          playback_id: String(editing.data.playback_id ?? ""),
          published_at: String(editing.data.published_at ?? ""),
        }
      : null;

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">Content</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Videos</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-white/65">
        Videos with a valid player ID from your host can appear on Videos, stream pages, and featured rails.
      </p>

      <StudioVideosPageClient videos={videos} hasDb={Boolean(db)} editEntry={editEntry} />
    </div>
  );
}
