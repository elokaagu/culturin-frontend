"use client";

import Image from "next/image";
import { Link } from "next-view-transitions";
import { useEffect, useRef, useState } from "react";

import type { videoCard } from "@/lib/interface";
import {
  IMAGE_BLUR_DATA_URL,
  isBundledPlaceholderSrc,
  resolveVideoThumbnailSrc,
} from "../../lib/imagePlaceholder";

type TopVideosRailProps = {
  videos: videoCard[];
};

/**
 * Home “Top videos” rail: server-fed, horizontal scroll, full-card links to stream detail.
 */
export default function TopVideosRail({ videos }: TopVideosRailProps) {
  const railRef = useRef<HTMLDivElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || videos.length < 2 || isPaused) return;

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
  }, [isPaused, videos.length]);

  if (videos.length === 0) return null;

  return (
    <div className="relative">
      <div
        ref={railRef}
        className="flex gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-1 pt-0.5 [-webkit-overflow-scrolling:touch] [scrollbar-color:rgba(115,115,115,0.45)_transparent] [scrollbar-width:thin] dark:[scrollbar-color:rgba(255,255,255,0.22)_transparent] sm:gap-5 md:gap-6 md:snap-none snap-x snap-mandatory"
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
              className="w-48 shrink-0 snap-center sm:w-52 md:w-56"
            >
              <div className="group relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-neutral-200 ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-white/10 sm:rounded-2xl">
                <Image
                  src={thumbSrc}
                  alt={video.title}
                  fill
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                  className="object-cover transition duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  sizes="(max-width: 640px) 12rem, 14rem"
                  unoptimized={isBundledPlaceholderSrc(thumbSrc)}
                />

                <Link
                  href={`/stream?play=${video.currentSlug}`}
                  className="absolute left-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/60 text-white no-underline transition hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                  aria-label={`Play ${video.title}`}
                >
                  <span className="ml-0.5 text-xs" aria-hidden>
                    ▶
                  </span>
                </Link>

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-3.5 pb-3.5 pt-10 sm:px-4 sm:pb-4">
                  <Link
                    href={`/stream?play=${video.currentSlug}`}
                    className="no-underline outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    <h3 className="line-clamp-2 text-sm font-semibold leading-snug tracking-tight text-white sm:text-base">
                      {video.title}
                    </h3>
                  </Link>
                  {video.uploader ? (
                    <p className="mt-1 line-clamp-1 text-xs font-medium text-white/70 sm:text-sm">{video.uploader}</p>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <p className="mt-2 text-center text-[0.7rem] text-neutral-500 dark:text-white/35 md:hidden" aria-hidden>
        Swipe for more - auto scroll pauses on touch
      </p>
    </div>
  );
}
