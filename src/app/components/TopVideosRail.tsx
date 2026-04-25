"use client";

import Image from "next/image";
import { Link } from "next-view-transitions";

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
  if (videos.length === 0) return null;

  return (
    <div className="relative">
      <div
        className="flex gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-1 pt-0.5 [-webkit-overflow-scrolling:touch] [scrollbar-color:rgba(255,255,255,0.22)_transparent] [scrollbar-width:thin] sm:gap-5 md:gap-6 md:snap-none snap-x snap-mandatory"
        role="list"
        aria-label="Featured video cards"
      >
        {videos.map((video) => {
          const thumbSrc = resolveVideoThumbnailSrc(video.videoThumbnailUrl);
          return (
            <article
              key={video.currentSlug}
              role="listitem"
              className="w-36 shrink-0 snap-center sm:w-40 md:w-44"
            >
              <Link
                href={`/stream/${video.currentSlug}`}
                className="group block w-full no-underline outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-neutral-900 ring-1 ring-white/10 sm:rounded-2xl">
                  <Image
                    src={thumbSrc}
                    alt={video.title}
                    fill
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR_DATA_URL}
                    className="object-cover transition duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    sizes="(max-width: 640px) 10rem, 12rem"
                    unoptimized={isBundledPlaceholderSrc(thumbSrc)}
                  />
                </div>
                <div className="mt-2.5 min-w-0 pl-0.5 text-left">
                  <h3 className="line-clamp-2 text-sm font-semibold leading-snug tracking-tight text-white sm:text-base">
                    {video.title}
                  </h3>
                  {video.uploader ? (
                    <p className="mt-0.5 line-clamp-1 text-xs font-medium text-white/45 sm:text-sm">
                      {video.uploader}
                    </p>
                  ) : null}
                </div>
              </Link>
            </article>
          );
        })}
      </div>
      <p className="mt-2 text-center text-[0.7rem] text-white/35 md:hidden" aria-hidden>
        Swipe for more
      </p>
    </div>
  );
}
