"use client";

import { useState } from "react";
import { Link } from "next-view-transitions";

import { VideoHeroDialog } from "./detail/VideoHeroDialog";
import type { videoCard } from "@/lib/interface";
import {
  IMAGE_BLUR_DATA_URL,
  cmsImageUnoptimized,
  isBundledPlaceholderSrc,
  resolveVideoThumbnailSrc,
} from "../../lib/imagePlaceholder";
import SafeContentImage from "./SafeContentImage";

const displayFont = { fontFamily: "var(--font-display), 'Times New Roman', serif" };

type WatchFilmstripProps = {
  videos: videoCard[];
  title: string;
  description: string;
  viewAllHref: string;
  headingId: string;
};

/**
 * "Watch" as a tight, cinematic filmstrip (up to 3 large tiles) instead of an
 * endless horizontal shelf — a curated screening, not a scrollable catalog.
 */
export default function WatchFilmstrip({
  videos,
  title,
  description,
  viewAllHref,
  headingId,
}: WatchFilmstripProps) {
  const [heroVideo, setHeroVideo] = useState<videoCard | null>(null);
  const featured = videos.slice(0, 3);

  return (
    <div className="w-full min-w-0">
      <header className="mb-5 flex items-start justify-between gap-4 sm:mb-6">
        <div className="min-w-0 flex-1 pr-2">
          <h2 id={headingId} className="text-xl font-medium tracking-tight sm:text-2xl" style={{ ...displayFont, color: "var(--c-ink)" }}>
            {title}
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed sm:mt-1.5 sm:text-[0.95rem]" style={{ color: "var(--c-muted)" }}>
            {description}
          </p>
        </div>
        <Link
          href={viewAllHref}
          className="shrink-0 self-center text-xs font-semibold uppercase tracking-[0.08em] no-underline transition-colors hover:opacity-70"
          style={{ color: "var(--c-accent)" }}
        >
          See all →
        </Link>
      </header>

      {featured.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--c-muted)" }}>No videos are available yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {featured.map((video) => {
            const thumbSrc = resolveVideoThumbnailSrc(video.videoThumbnailUrl);
            return (
              <button
                key={video.currentSlug}
                type="button"
                onClick={() => setHeroVideo(video)}
                aria-label={`Play ${video.title}`}
                className="group block w-full cursor-pointer text-left"
              >
                <div className="relative aspect-[9/13] w-full overflow-hidden rounded-2xl bg-neutral-900">
                  <SafeContentImage
                    src={thumbSrc}
                    alt={video.title}
                    blurDataURL={IMAGE_BLUR_DATA_URL}
                    className="object-cover transition duration-300 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    sizes="(max-width: 640px) 100vw, 22rem"
                    unoptimized={isBundledPlaceholderSrc(thumbSrc) || cmsImageUnoptimized(thumbSrc)}
                  />
                  <span
                    className="absolute left-1/2 top-1/2 inline-flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/55 text-white backdrop-blur-sm"
                    aria-hidden
                  >
                    <span className="ml-0.5 text-base">▶</span>
                  </span>
                </div>
                <p className="mt-3 line-clamp-2 text-sm font-medium leading-snug sm:text-base" style={{ color: "var(--c-ink)" }}>
                  {video.title}
                </p>
                {video.uploader ? (
                  <p className="mt-1 text-xs sm:text-sm" style={{ color: "var(--c-muted)" }}>{video.uploader}</p>
                ) : null}
              </button>
            );
          })}
        </div>
      )}

      <VideoHeroDialog open={heroVideo !== null} onClose={() => setHeroVideo(null)} video={heroVideo} />
    </div>
  );
}
