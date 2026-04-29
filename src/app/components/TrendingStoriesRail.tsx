"use client";

import { Link } from "next-view-transitions";

import type { simpleBlogCard } from "@/lib/interface";
import {
  IMAGE_BLUR_DATA_URL,
  cmsImageUnoptimized,
  isBundledPlaceholderSrc,
  resolveContentImageSrc,
} from "../../lib/imagePlaceholder";
import MarqueeFadeRail from "./MarqueeFadeRail";
import SafeContentImage from "./SafeContentImage";

type TrendingStoriesRailProps = {
  stories: simpleBlogCard[];
};

export default function TrendingStoriesRail({ stories }: TrendingStoriesRailProps) {
  if (stories.length === 0) return null;

  return (
    <MarqueeFadeRail
      ariaLabel="Trending story cards"
      marqueeClassName="[--duration:56s] pb-1 pt-0.5"
    >
      {stories.map((story) => {
        const thumbSrc = resolveContentImageSrc(story.titleImageUrl);

        return (
          <article
            key={story.currentSlug}
            className="w-48 shrink-0 sm:w-52 md:w-56"
          >
            <Link
              href={`/articles/${story.currentSlug}`}
              className="group block w-full no-underline outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-neutral-900 ring-1 ring-white/10 sm:rounded-2xl">
                <SafeContentImage
                  src={thumbSrc}
                  alt={story.title}
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                  className="object-cover transition duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  sizes="(max-width: 640px) 12rem, 14rem"
                  unoptimized={isBundledPlaceholderSrc(thumbSrc) || cmsImageUnoptimized(thumbSrc)}
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-3.5 pb-3.5 pt-10 sm:px-4 sm:pb-4">
                  <h3 className="line-clamp-2 text-sm font-semibold leading-snug tracking-tight text-white sm:text-base">
                    {story.title}
                  </h3>
                  {story.summary ? (
                    <p className="mt-1 line-clamp-1 text-xs font-medium text-white/70 sm:text-sm">
                      {story.summary}
                    </p>
                  ) : null}
                </div>
              </div>
            </Link>
          </article>
        );
      })}
    </MarqueeFadeRail>
  );
}
