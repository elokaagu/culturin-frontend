"use client";

import Image from "next/image";
import { Link } from "next-view-transitions";

import type { simpleBlogCard } from "@/lib/interface";
import {
  IMAGE_BLUR_DATA_URL,
  isBundledPlaceholderSrc,
  resolveContentImageSrc,
} from "../../lib/imagePlaceholder";

type ExploreWorldRailProps = {
  stories: simpleBlogCard[];
};

export default function ExploreWorldRail({ stories }: ExploreWorldRailProps) {
  if (stories.length === 0) return null;
  const leadStories = stories.slice(0, 3);
  const [firstStory, secondStory, featuredStory] = leadStories;

  return (
    <div className="relative">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr_2.1fr]" role="list" aria-label="Explore the world cards">
        {[firstStory, secondStory].filter(Boolean).map((story) => {
          const thumbSrc = resolveContentImageSrc(story.titleImageUrl);
          const subtitle = (story.summary || "").trim() || "Discover with Culturin";

          return (
            <article key={story.currentSlug} role="listitem" className="min-w-0">
              <Link
                href={`/articles/${story.currentSlug}`}
                className="group block w-full no-underline outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-neutral-200 ring-1 ring-neutral-200">
                  <Image
                    src={thumbSrc}
                    alt={story.title}
                    fill
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR_DATA_URL}
                    className="object-cover transition duration-300 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    sizes="(max-width: 1024px) 100vw, 22vw"
                    unoptimized={isBundledPlaceholderSrc(thumbSrc)}
                  />
                </div>
                <h3 className="mt-3 line-clamp-2 text-[1.04rem] font-medium leading-tight tracking-tight text-neutral-900">
                  {story.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-700">{subtitle}</p>
              </Link>
            </article>
          );
        })}

        {featuredStory ? (
          <article role="listitem" className="min-w-0">
            <Link
              href={`/articles/${featuredStory.currentSlug}`}
              className="group block w-full no-underline outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-neutral-200 ring-1 ring-neutral-200">
                <Image
                  src={resolveContentImageSrc(featuredStory.titleImageUrl)}
                  alt={featuredStory.title}
                  fill
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                  className="object-cover transition duration-300 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  unoptimized={isBundledPlaceholderSrc(resolveContentImageSrc(featuredStory.titleImageUrl))}
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent" />
              </div>
              <h3 className="mt-3 line-clamp-2 text-[2.8rem] font-medium leading-[0.98] tracking-tight text-neutral-900 sm:text-[3.1rem]">
                {featuredStory.title}
              </h3>
              <p className="mt-2 max-w-4xl text-[1.06rem] leading-relaxed text-neutral-800">
                {(featuredStory.summary || "").trim() || "Move through culture differently with stories, local guides, and curated perspectives."}
              </p>
            </Link>
          </article>
        ) : null}
      </div>
    </div>
  );
}
