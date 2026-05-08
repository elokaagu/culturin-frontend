"use client";

import { useMemo, useState, useTransition } from "react";
import { Link } from "next-view-transitions";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import {
  StudioCulturinListSection,
  StudioCulturinSearchSortRow,
  studioCreateButtonClass,
  studioListEditLinkClass,
  studioListRowClass,
} from "@/app/studio/_components/StudioCulturinListKit";
import { filterStudioList, sortStudioList, type StudioSortKey } from "@/app/studio/_lib/studioListShared";
import { deleteCmsEntry } from "@/app/studio/_lib/postCmsEntry";
import type { StudioVideoListItem } from "@/lib/cms/queries";

type StudioVideosPageClientProps = {
  videos: StudioVideoListItem[];
  hasDb: boolean;
};

export function StudioVideosPageClient({ videos, hasDb }: StudioVideosPageClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<StudioSortKey>("date-newest");
  const [removed, setRemoved] = useState<Set<string>>(() => new Set());
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const visibleVideos = useMemo(
    () => videos.filter((v) => !removed.has(v.currentSlug)),
    [videos, removed],
  );

  const filteredSorted = useMemo(() => {
    const filtered = filterStudioList(visibleVideos, search, (v) => [
      v.title,
      v.currentSlug,
      v.uploader,
      v.description,
      v.playbackId,
    ]);
    return sortStudioList(filtered, sort, (v) => v.title, (v) => v.currentSlug);
  }, [visibleVideos, search, sort]);

  const searchTrim = search.trim();
  const countLabel =
    searchTrim.length > 0
      ? `${filteredSorted.length} of ${visibleVideos.length} shown`
      : `${visibleVideos.length} item${visibleVideos.length === 1 ? "" : "s"}`;

  const toolbar =
    hasDb && visibleVideos.length > 0 ? (
      <StudioCulturinSearchSortRow
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search title, slug, uploader, player ID…"
        sortValue={sort}
        onSortChange={setSort}
      />
    ) : null;

  async function handleDelete(video: StudioVideoListItem) {
    const confirmed = window.confirm(
      `Delete “${video.title}”? This permanently removes the video from the public site.`,
    );
    if (!confirmed) return;

    setDeletingSlug(video.currentSlug);
    setErrorMessage(null);

    const result = await deleteCmsEntry("video", video.currentSlug);

    setDeletingSlug(null);

    if (!result.ok) {
      setErrorMessage(result.message);
      return;
    }

    setRemoved((prev) => {
      const next = new Set(prev);
      next.add(video.currentSlug);
      return next;
    });
    startTransition(() => router.refresh());
  }

  return (
    <>
      <div className="mt-6">
        <Link href="/studio/videos/new" className={studioCreateButtonClass}>
          Create video
        </Link>
      </div>

      {errorMessage ? (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-rose-300/60 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-200"
        >
          {errorMessage}
        </p>
      ) : null}

      <StudioCulturinListSection title="All videos" countLabel={countLabel} toolbar={toolbar}>
        {!hasDb ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-600 dark:border-white/15 dark:text-white/55">
            Your content library isn&apos;t connected in this preview, so videos can&apos;t be listed yet.
          </p>
        ) : visibleVideos.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-600 dark:border-white/15 dark:text-white/55">
            No videos found. Use <span className="font-medium text-amber-800 dark:text-amber-300/90">Create video</span> to add
            one.
          </p>
        ) : filteredSorted.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-600 dark:border-white/15 dark:text-white/55">
            No videos match your search. Try a different term or clear the search box.
          </p>
        ) : (
          <ul className="m-0 list-none space-y-3 p-0">
            {filteredSorted.map((video) => {
              const slug = video.currentSlug;
              const isDeleting = deletingSlug === slug;
              return (
                <li key={slug} className={studioListRowClass}>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <a
                      href="/videos"
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Open “${video.title}” in the public video library`}
                      className="group min-w-0 flex-1 rounded-md no-underline outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50"
                    >
                      <p className="m-0 truncate text-sm font-semibold text-neutral-900 transition group-hover:text-amber-800 dark:text-white dark:group-hover:text-amber-300">
                        {video.title}
                      </p>
                      <p className="m-0 mt-1 truncate text-xs text-neutral-500 dark:text-white/50">/{slug}</p>
                      {video.uploader ? (
                        <p className="m-0 mt-1.5 text-xs text-neutral-600 dark:text-white/60">Uploader: {video.uploader}</p>
                      ) : null}
                      {video.playbackId ? (
                        <p className="m-0 mt-1 text-xs text-neutral-500 dark:text-white/50">Player ID: {video.playbackId}</p>
                      ) : null}
                    </a>
                    <div className="flex shrink-0 items-center gap-2">
                      <Link href={`/studio/videos/edit/${encodeURIComponent(slug)}`} className={studioListEditLinkClass}>
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(video)}
                        disabled={isDeleting}
                        aria-label={`Delete ${video.title}`}
                        title="Delete video"
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-700 transition hover:border-rose-400/60 hover:bg-rose-50 hover:text-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400/70 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/18 dark:bg-white/[0.06] dark:text-white/85 dark:hover:border-rose-400/40 dark:hover:bg-rose-500/15 dark:hover:text-rose-200"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        <span className="sr-only">{isDeleting ? "Deleting…" : "Delete"}</span>
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </StudioCulturinListSection>
    </>
  );
}
