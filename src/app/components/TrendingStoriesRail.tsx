"use client";

import Image from "next/image";
import { Link } from "next-view-transitions";

import type { simpleBlogCard } from "@/lib/interface";
import {
  IMAGE_BLUR_DATA_URL,
  isBundledPlaceholderSrc,
  resolveContentImageSrc,
} from "../../lib/imagePlaceholder";

type TrendingStoriesRailProps = {
  stories: simpleBlogCard[];
};

function oneLineFromSummary(summary: string): string {
  const t = summary.replace(/\s+/g, " ").trim();
  if (!t) return "";
  const end = t.search(/[.!?]/);
  const one = (end === -1 ? t : t.slice(0, end)).trim();
  if (one.length > 80) return `${one.slice(0, 78)}…`;
  return one;
}

/**
 * Home “Trending stories” horizontal row: 3:2 image, title + one-line deck (Explore-the-World style).
 */
export default function TrendingStoriesRail({ stories }: TrendingStoriesRailProps) {
  if (stories.length === 0) return null;

  return (
    <div className="relative">
      <div
        className="flex gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-1 pt-0.5 [-webkit-overflow-scrolling:touch] [scrollbar-color:rgba(0,0,0,0.2)_transparent] [scrollbar-width:thin] dark:[scrollbar-color:rgba(255,255,255,0.2)_transparent] sm:gap-5 md:gap-6 md:snap-none snap-x snap-mandatory"
        role="list"
        aria-label="Trending story cards"
      >
        {stories.map((story) => {
          const thumbSrc = resolveContentImageSrc(story.titleImageUrl);
          const subtitle = story.summary ? oneLineFromSummary(story.summary) : "";
          return (
            <article
              key={story.currentSlug}
              role="listitem"
              className="w-40 shrink-0 snap-center sm:w-44 md:w-48"
            >
              <Link
                href={`/articles/${story.currentSlug}`}
                className="group block w-full no-underline outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50 dark:focus-visible:ring-offset-black"
              >
                <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl bg-neutral-200 dark:bg-neutral-800">
                  <Image
                    src={thumbSrc}
                    alt={story.title}
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
                  <h3 className="line-clamp-2 text-sm font-bold leading-snug tracking-tight text-neutral-900 sm:text-base dark:text-white">
                    {story.title}
                  </h3>
                  {subtitle ? (
                    <p className="mt-0.5 line-clamp-1 text-xs font-medium text-neutral-500 sm:text-sm dark:text-white/50">
                      {subtitle}
                    </p>
                  ) : null}
                </div>
              </Link>
            </article>
          );
        })}
      </div>
      <p className="mt-2 text-center text-[0.7rem] text-neutral-400 md:hidden dark:text-white/35" aria-hidden>
        Swipe for more
      </p>
    </div>
  );
}
