"use client";

import { useMemo, useState } from "react";
import { Link } from "next-view-transitions";

import {
  StudioCulturinListSection,
  StudioCulturinSearchSortRow,
  studioCreateButtonClass,
  studioListEditLinkClass,
  studioListRowClass,
} from "@/app/studio/_components/StudioCulturinListKit";
import { filterStudioList, sortStudioList, type StudioSortKey } from "@/app/studio/_lib/studioListShared";
import type { StudioVideoListItem } from "@/lib/cms/queries";

type StudioVideosPageClientProps = {
  videos: StudioVideoListItem[];
  hasDb: boolean;
};

export function StudioVideosPageClient({ videos, hasDb }: StudioVideosPageClientProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<StudioSortKey>("date-newest");

  const filteredSorted = useMemo(() => {
    const filtered = filterStudioList(videos, search, (v) => [
      v.title,
      v.currentSlug,
      v.uploader,
      v.description,
      v.playbackId,
    ]);
    return sortStudioList(filtered, sort, (v) => v.title, (v) => v.currentSlug);
  }, [videos, search, sort]);

  const searchTrim = search.trim();
  const countLabel =
    searchTrim.length > 0
      ? `${filteredSorted.length} of ${videos.length} shown`
      : `${videos.length} item${videos.length === 1 ? "" : "s"}`;

  const toolbar =
    hasDb && videos.length > 0 ? (
      <StudioCulturinSearchSortRow
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search title, slug, uploader, player ID…"
        sortValue={sort}
        onSortChange={setSort}
      />
    ) : null;

  return (
    <>
      <div className="mt-6">
        <Link href="/studio/videos/new" className={studioCreateButtonClass}>
          Create video
        </Link>
      </div>

      <StudioCulturinListSection title="All videos" countLabel={countLabel} toolbar={toolbar}>
        {!hasDb ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-600 dark:border-white/15 dark:text-white/55">
            Your content library isn&apos;t connected in this preview, so videos can&apos;t be listed yet.
          </p>
        ) : videos.length === 0 ? (
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
            {filteredSorted.map((video) => (
              <li key={video.currentSlug} className={studioListRowClass}>
                <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="min-w-0">
                    <p className="m-0 truncate text-sm font-semibold text-neutral-900 dark:text-white">{video.title}</p>
                    <p className="m-0 mt-1 truncate text-xs text-neutral-500 dark:text-white/50">/{video.currentSlug}</p>
                    {video.uploader ? (
                      <p className="m-0 mt-1.5 text-xs text-neutral-600 dark:text-white/60">Uploader: {video.uploader}</p>
                    ) : null}
                    {video.playbackId ? (
                      <p className="m-0 mt-1 text-xs text-neutral-500 dark:text-white/50">Player ID: {video.playbackId}</p>
                    ) : null}
                  </div>
                  <Link href={`/studio/videos/edit/${encodeURIComponent(video.currentSlug)}`} className={studioListEditLinkClass}>
                    Edit
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </StudioCulturinListSection>
    </>
  );
}
