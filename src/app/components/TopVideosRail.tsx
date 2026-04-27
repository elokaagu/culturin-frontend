"use client";

import { useEffect, useRef, useState } from "react";

import { appPageFullBleedClass, appPageRailScrollPadClass } from "@/lib/appLayout";
import { VideoHeroDialog } from "./detail/VideoHeroDialog";
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
 * Home and library “Top videos” rail: server-fed, horizontal scroll; each card opens a hero dialog with the Mux player (or stream fallback if no `playbackId`).
 * Auto-advances slowly; pauses on hover or focus. Disabled when the user prefers reduced motion.
 */
export default function TopVideosRail({
  videos,
  fullBleed = false,
  showDescription = false,
}: TopVideosRailProps) {
  const railRef = useRef<HTMLDivElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(true);
  const [heroVideo, setHeroVideo] = useState<videoCard | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setReduceMotion(mq.matches);
    read();
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || videos.length < 2 || isPaused || reduceMotion) return;

    const advance = () => {
      const firstCard = rail.querySelector<HTMLElement>("[data-video-card]");
      const step = firstCard ? firstCard.offsetWidth + 16 : 240;
      const maxScrollLeft = rail.scrollWidth - rail.clientWidth;
      const next = rail.scrollLeft + step;

      if (next >= maxScrollLeft - 2) {
        rail.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }

      rail.scrollTo({ left: next, behavior: "smooth" });
    };

    const timer = window.setInterval(advance, 3200);
    return () => window.clearInterval(timer);
  }, [isPaused, videos.length, reduceMotion]);

  if (videos.length === 0) return null;

  const track = (
    <div
      ref={railRef}
      className={`flex snap-x snap-mandatory justify-start gap-4 overflow-x-auto scroll-smooth overscroll-x-contain pt-0.5 [-webkit-overflow-scrolling:touch] [scrollbar-color:rgba(115,115,115,0.45)_transparent] [scrollbar-width:thin] dark:[scrollbar-color:rgba(255,255,255,0.22)_transparent] sm:gap-5 sm:pt-0.5 md:gap-6 ${fullBleed ? appPageRailScrollPadClass : ""} md:pb-1.5 ${fullBleed ? "pb-2" : "pb-1"} md:snap-none`}
      role="list"
      aria-label="Featured video cards"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      {videos.map((video) => {
        const thumbSrc = resolveVideoThumbnailSrc(video.videoThumbnailUrl);
        return (
          <article
            key={video.currentSlug}
            data-video-card
            role="listitem"
            className="w-[min(18rem,80vw)] shrink-0 snap-start sm:w-72 md:w-80"
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
    </div>
  );

  return (
    <div className="relative">
      {fullBleed ? <div className={appPageFullBleedClass}>{track}</div> : track}
      <VideoHeroDialog open={heroVideo !== null} onClose={() => setHeroVideo(null)} video={heroVideo} />
      <p className="mt-2 text-center text-[0.7rem] text-neutral-500 dark:text-white/35 md:hidden" aria-hidden>
        Swipe for more; auto scroll pauses while you touch or hover
      </p>
    </div>
  );
}
