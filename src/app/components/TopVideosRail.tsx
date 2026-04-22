"use client";

import Image from "next/image";
import Link from "next/link";

import type { videoCard } from "../../libs/interface";
import { IMAGE_BLUR_DATA_URL } from "../../lib/imagePlaceholder";

type TopVideosRailProps = {
  videos: videoCard[];
};

/**
 * Home “Top videos” rail: server-fed, horizontal scroll, full-card links to stream detail.
 */
export default function TopVideosRail({ videos }: TopVideosRailProps) {
  if (videos.length === 0) return null;

  return (
    <div className="relative">
      <div
        className="flex gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-2 pt-1 [-webkit-overflow-scrolling:touch] [scrollbar-color:rgba(0,0,0,0.2)_transparent] [scrollbar-width:thin] dark:[scrollbar-color:rgba(255,255,255,0.2)_transparent] sm:gap-5 md:gap-6 md:snap-none snap-x snap-mandatory"
        role="list"
        aria-label="Featured video cards"
      >
        {videos.map((video) => (
          <article
            key={video.currentSlug}
            role="listitem"
            className="w-[min(88vw,20rem)] shrink-0 snap-center sm:w-[min(48vw,19rem)] md:w-[min(34vw,18rem)] lg:w-[22rem]"
          >
            <Link
              href={`/stream/${video.currentSlug}`}
              className="group flex h-full min-h-[16rem] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-gradient-to-b from-white to-neutral-100 no-underline outline-none ring-offset-2 ring-offset-neutral-50 transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-1 hover:border-amber-400/40 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.12)] motion-reduce:transform-none motion-reduce:hover:transform-none focus-visible:ring-2 focus-visible:ring-amber-400 dark:border-white/10 dark:from-white/[0.06] dark:to-white/[0.02] dark:ring-offset-black dark:hover:border-amber-400/30 dark:hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.85)]"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-neutral-900">
                {video.videoThumbnailUrl ? (
                  <Image
                    src={video.videoThumbnailUrl}
                    alt={video.title}
                    fill
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR_DATA_URL}
                    className="object-cover transition duration-500 ease-out motion-reduce:transition-none group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
                    sizes="(max-width: 640px) 88vw, (max-width: 1024px) 34vw, 22rem"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-sky-100 via-neutral-100 to-neutral-200 px-4 text-center dark:from-sky-900/25 dark:via-neutral-900 dark:to-black">
                    <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sky-700/90 dark:text-sky-300/90">
                      Video
                    </span>
                    <span className="text-sm font-medium leading-snug text-neutral-800 line-clamp-2 dark:text-white/80">{video.title}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1.5 px-4 pb-5 pt-4">
                <h3 className="text-[0.95rem] font-semibold leading-snug tracking-tight text-neutral-900 line-clamp-2 transition-colors group-hover:text-amber-900 dark:text-white dark:group-hover:text-amber-50 sm:text-base">
                  {video.title}
                </h3>
                {video.uploader ? (
                  <p className="text-xs text-neutral-600 sm:text-sm dark:text-white/50">{video.uploader}</p>
                ) : null}
              </div>
            </Link>
          </article>
        ))}
      </div>
      <p className="mt-2 text-center text-[0.7rem] text-neutral-400 md:hidden dark:text-white/35" aria-hidden>
        Swipe for more
      </p>
    </div>
  );
}
