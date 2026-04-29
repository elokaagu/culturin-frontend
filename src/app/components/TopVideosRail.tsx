"use client";

import { useState } from "react";

import { appPageRailScrollPadClass } from "@/lib/appLayout";
import { VideoHeroDialog } from "./detail/VideoHeroDialog";
import MarqueeFadeRail from "./MarqueeFadeRail";
import type { videoCard } from "@/lib/interface";
import {
  IMAGE_BLUR_DATA_URL,
  cmsImageUnoptimized,
  isBundledPlaceholderSrc,
  resolveVideoThumbnailSrc,
} from "../../lib/imagePlaceholder";
import SafeContentImage from "./SafeContentImage";

type TopVideosRailProps = {
  videos: videoCard[];
  /** When true, extend the scroll area to the viewport edges (cancels parent `px-4` / `px-6` padding). */
  fullBleed?: boolean;
  /** When true, show a short line-clamp description under the title (e.g. video library page). */
  showDescription?: boolean;
};

/**
 * Home and library “Top videos” rail: server-fed; each card opens a hero dialog with the Mux player (or stream fallback if no `playbackId`).
 * Uses Magic UI `Marquee` with edge fades; falls back to horizontal scroll when reduced motion is preferred.
 */
export default function TopVideosRail({
  videos,
  fullBleed = false,
  showDescription = false,
}: TopVideosRailProps) {
  const [heroVideo, setHeroVideo] = useState<videoCard | null>(null);

  if (videos.length === 0) return null;

  return (
    <div className="relative">
      <MarqueeFadeRail
        ariaLabel="Featured video cards"
        fullBleed={fullBleed}
        marqueeClassName={
          fullBleed
            ? `[--duration:72s] pb-2 pt-0.5 sm:pb-2 sm:pt-0.5 md:pb-1.5 ${appPageRailScrollPadClass}`
            : "[--duration:72s] pb-1 pt-0.5 sm:pt-0.5 md:pb-1.5"
        }
      >
        {videos.map((video) => {
          const thumbSrc = resolveVideoThumbnailSrc(video.videoThumbnailUrl);
          return (
            <article
              key={video.currentSlug}
              className="w-[min(18rem,80vw)] shrink-0 sm:w-72 md:w-80"
            >
              <button
                type="button"
                onClick={() => setHeroVideo(video)}
                aria-label={`Play ${video.title}`}
                className="group relative block aspect-video w-full cursor-pointer overflow-hidden rounded-xl bg-neutral-200 text-left ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-white/10 sm:rounded-2xl"
              >
                <SafeContentImage
                  src={thumbSrc}
                  alt={video.title}
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                  className="object-cover transition duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  sizes="(max-width: 640px) 80vw, 20rem"
                  unoptimized={isBundledPlaceholderSrc(thumbSrc) || cmsImageUnoptimized(thumbSrc)}
                />

                <span
                  className="absolute left-3 top-3 z-[1] inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/60 text-white shadow-sm backdrop-blur-sm"
                  aria-hidden
                >
                  <span className="ml-0.5 text-xs">▶</span>
                </span>

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-3.5 pb-3.5 pt-10 sm:px-4 sm:pb-4">
                  <h3 className="line-clamp-2 text-sm font-semibold leading-snug tracking-tight text-white sm:text-base">
                    {video.title}
                  </h3>
                  {video.uploader ? (
                    <p className="mt-1 line-clamp-1 text-xs font-medium text-white/70 sm:text-sm">{video.uploader}</p>
                  ) : null}
                  {showDescription && video.description ? (
                    <p className="mt-1 line-clamp-2 text-[0.7rem] leading-relaxed text-white/55 sm:text-xs">{video.description}</p>
                  ) : null}
                </div>
              </button>
            </article>
          );
        })}
      </MarqueeFadeRail>
      <VideoHeroDialog open={heroVideo !== null} onClose={() => setHeroVideo(null)} video={heroVideo} />
    </div>
  );
}
