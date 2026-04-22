"use client";

import Image from "next/image";
import Link from "next/link";

import type { simpleBlogCard } from "../../libs/interface";

type TrendingStoriesRailProps = {
  stories: simpleBlogCard[];
};

/**
 * Home “Trending stories” horizontal rail: server-fed cards, no duplicate CMS fetch.
 * Full-card links, scroll-snap on small viewports, calm hover (lift + image scale).
 */
export default function TrendingStoriesRail({ stories }: TrendingStoriesRailProps) {
  if (stories.length === 0) return null;

  return (
    <div className="relative">
      <div
        className="flex gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-2 pt-1 [-webkit-overflow-scrolling:touch] [scrollbar-color:rgba(255,255,255,0.2)_transparent] [scrollbar-width:thin] sm:gap-5 md:gap-6 md:snap-none snap-x snap-mandatory"
        role="list"
        aria-label="Trending story cards"
      >
        {stories.map((story) => (
          <article
            key={story.currentSlug}
            role="listitem"
            className="w-[min(78vw,17.5rem)] shrink-0 snap-center sm:w-[min(44vw,16rem)] md:w-[min(31vw,15rem)] lg:w-60"
          >
            <Link
              href={`/articles/${story.currentSlug}`}
              className="group flex h-full min-h-[20rem] flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] no-underline outline-none ring-offset-2 ring-offset-black transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-1 hover:border-amber-400/30 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.85)] motion-reduce:transform-none motion-reduce:hover:transform-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900">
                {story.titleImageUrl ? (
                  <Image
                    src={story.titleImageUrl}
                    alt={story.title}
                    fill
                    className="object-cover transition duration-500 ease-out motion-reduce:transition-none group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
                    sizes="(max-width: 640px) 78vw, (max-width: 1024px) 31vw, 15rem"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-amber-900/20 via-neutral-900 to-black px-4 text-center">
                    <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-amber-400/90">
                      Story
                    </span>
                    <span className="text-sm font-medium leading-snug text-white/80 line-clamp-3">{story.title}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2 px-4 pb-5 pt-4">
                <h3 className="text-[0.95rem] font-semibold leading-snug tracking-tight text-white line-clamp-2 transition-colors group-hover:text-amber-50 sm:text-base">
                  {story.title}
                </h3>
                {story.summary ? (
                  <p className="text-xs leading-relaxed text-white/55 line-clamp-3 sm:text-sm">{story.summary}</p>
                ) : null}
              </div>
            </Link>
          </article>
        ))}
      </div>
      <p className="mt-2 text-center text-[0.7rem] text-white/35 md:hidden" aria-hidden>
        Swipe for more
      </p>
    </div>
  );
}
