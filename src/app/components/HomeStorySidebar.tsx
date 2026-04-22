"use client";

import Image from "next/image";
import Link from "next/link";

import type { simpleBlogCard } from "../../libs/interface";
import { IMAGE_BLUR_DATA_URL } from "../../lib/imagePlaceholder";

const TAGS = ["Culture", "Travel", "Stories", "Guides", "Community"] as const;

type HomeStorySidebarProps = {
  stories: simpleBlogCard[];
};

/**
 * Desktop-only vertical rail (Trippin-style): thumbnail + pill + headline,
 * complements the main hero without duplicating the horizontal snap rail on large viewports.
 */
export default function HomeStorySidebar({ stories }: HomeStorySidebarProps) {
  if (stories.length === 0) return null;

  const items = stories.slice(0, 6);

  return (
    <aside
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-white/10 dark:bg-neutral-950/40 dark:shadow-none"
      aria-label="Trending stories"
    >
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-neutral-100 px-4 py-3 dark:border-white/10">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-white/55">
          Trending
        </h2>
        <Link
          href="/trending"
          className="text-xs font-semibold text-amber-700 no-underline transition-colors hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-200"
        >
          View all
        </Link>
      </div>
      <ul className="m-0 flex min-h-0 flex-1 list-none flex-col divide-y divide-neutral-100 overflow-y-auto p-0 dark:divide-white/10">
        {items.map((story, i) => (
          <li key={story.currentSlug} className="min-w-0">
            <Link
              href={`/articles/${story.currentSlug}`}
              className="group flex gap-3 px-3 py-3 no-underline outline-none transition-colors hover:bg-neutral-50 focus-visible:bg-neutral-100 dark:hover:bg-white/[0.04] dark:focus-visible:bg-white/[0.06]"
            >
              <div className="relative h-[4.25rem] w-[4.25rem] shrink-0 overflow-hidden rounded-xl bg-neutral-200 dark:bg-neutral-800">
                {story.titleImageUrl ? (
                  <Image
                    src={story.titleImageUrl}
                    alt={story.title}
                    fill
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR_DATA_URL}
                    className="object-cover transition duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    sizes="68px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-100 to-neutral-200 text-[10px] font-semibold uppercase tracking-wide text-amber-900/80 dark:from-amber-900/30 dark:to-neutral-900 dark:text-amber-200/90">
                    Story
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1 py-0.5">
                <span className="inline-flex rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-600 dark:border-white/15 dark:bg-white/5 dark:text-white/70">
                  {TAGS[i % TAGS.length]}
                </span>
                <p className="mt-1.5 text-sm font-semibold leading-snug tracking-tight text-neutral-900 line-clamp-2 transition-colors group-hover:text-amber-900 dark:text-white dark:group-hover:text-amber-100/95">
                  {story.title}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
