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

function deckExcerpt(summary: string): string {
  const t = summary.replace(/\s+/g, " ").trim();
  if (!t) return "";
  const end = t.search(/[.!?]/);
  const one = (end === -1 ? t : t.slice(0, end + 1)).trim();
  if (one.length <= 200) return one;
  return `${one.slice(0, 198)}…`;
}

/**
 * Large “slate” cards: responsive grid, generous image area, no cramped rail.
 */
export default function TrendingStoriesRail({ stories }: TrendingStoriesRailProps) {
  if (stories.length === 0) return null;

  return (
    <ul className="m-0 grid w-full list-none grid-cols-1 gap-8 p-0 sm:grid-cols-2 sm:gap-9 lg:gap-10">
      {stories.map((story) => {
        const thumbSrc = resolveContentImageSrc(story.titleImageUrl);
        const deck = story.summary ? deckExcerpt(story.summary) : "";

        return (
          <li key={story.currentSlug} className="min-w-0">
            <Link
              href={`/articles/${story.currentSlug}`}
              className="group block h-full no-underline outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-4 focus-visible:ring-offset-neutral-50 dark:focus-visible:ring-offset-black"
            >
              <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-md ring-1 ring-black/[0.04] dark:border-white/10 dark:bg-neutral-950 dark:ring-white/10 sm:rounded-3xl">
                <div className="relative aspect-[4/3] w-full min-h-[220px] sm:min-h-[260px] md:min-h-[300px] lg:aspect-[16/10] lg:min-h-[320px]">
                  <Image
                    src={thumbSrc}
                    alt={story.title}
                    fill
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR_DATA_URL}
                    className="object-cover transition duration-500 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 600px"
                    unoptimized={isBundledPlaceholderSrc(thumbSrc)}
                  />
                </div>
                <div className="flex flex-1 flex-col space-y-2.5 px-4 pb-6 pt-4 sm:px-6 sm:pb-7 sm:pt-5">
                  <h3 className="text-balance text-xl font-bold leading-tight tracking-tight text-neutral-900 sm:text-2xl md:text-[1.65rem] md:leading-snug dark:text-white">
                    {story.title}
                  </h3>
                  {deck ? (
                    <p className="line-clamp-2 text-pretty text-sm leading-relaxed text-neutral-600 sm:line-clamp-3 sm:text-base md:leading-relaxed dark:text-white/60">
                      {deck}
                    </p>
                  ) : null}
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
