"use client";

import Image from "next/image";
import { Link } from "next-view-transitions";

import type { simpleBlogCard } from "../../libs/interface";
import {
  IMAGE_BLUR_DATA_URL,
  isBundledPlaceholderSrc,
  resolveContentImageSrc,
} from "../../lib/imagePlaceholder";

const TAG_POOL = [
  "Community",
  "Experiences",
  "Culture",
  "Events",
  "Guides",
  "Travel",
  "Spotlight",
] as const;

type HomeStorySidebarProps = {
  stories: simpleBlogCard[];
  /** @default 5 */
  maxItems?: number;
};

function tagsForIndex(index: number, slug: string): string[] {
  const a = (slug.length + index * 7) % TAG_POOL.length;
  const b = (slug.length + index * 13 + 3) % TAG_POOL.length;
  const t1 = TAG_POOL[a] ?? "Culture";
  const t2 = TAG_POOL[b] ?? "Stories";
  return t1 === t2
    ? [t1, TAG_POOL[(b + 1) % TAG_POOL.length] ?? "Guides"]
    : [t1, t2];
}

/**
 * Right column: compact rows (Trippin-style) — square thumb, pill tags, title.
 * Used for the home hero; stories should exclude the featured post.
 */
export default function HomeStorySidebar({ stories, maxItems = 5 }: HomeStorySidebarProps) {
  const items = stories.slice(0, maxItems);
  if (items.length === 0) return null;

  return (
    <aside
      className="flex h-full min-h-0 w-full min-w-0 flex-col justify-start gap-3 lg:max-h-[40rem] lg:overflow-y-auto"
      aria-label="More stories"
    >
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {items.map((story, i) => {
          const thumbSrc = resolveContentImageSrc(story.titleImageUrl);
          const [tag1, tag2] = tagsForIndex(i, story.currentSlug);
          return (
            <li key={story.currentSlug} className="min-w-0">
              <Link
                href={`/articles/${story.currentSlug}`}
                className="group flex gap-3 rounded-2xl border border-neutral-200/90 bg-white p-3 pr-2 no-underline shadow-sm outline-none transition-colors hover:border-neutral-300 hover:bg-neutral-50/80 focus-visible:ring-2 focus-visible:ring-amber-400/80 dark:border-white/10 dark:bg-neutral-950/50 dark:shadow-none dark:hover:border-white/20 dark:hover:bg-white/[0.04]"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-200 dark:bg-neutral-800 sm:h-[4.5rem] sm:w-[4.5rem]">
                  <Image
                    src={thumbSrc}
                    alt=""
                    fill
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR_DATA_URL}
                    className="object-cover transition duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    sizes="(max-width: 640px) 80px, 72px"
                    unoptimized={isBundledPlaceholderSrc(thumbSrc)}
                  />
                </div>
                <div className="min-w-0 flex-1 py-0.5 pr-0.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex max-w-[5.5rem] items-center justify-center rounded-full border border-neutral-800 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-900 dark:border-white/70 dark:bg-black dark:text-white">
                      {tag1}
                    </span>
                    <span className="inline-flex max-w-[5.5rem] items-center justify-center rounded-full border border-neutral-800 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-900 dark:border-white/70 dark:bg-black dark:text-white">
                      {tag2}
                    </span>
                    <span
                      className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full border border-dashed border-neutral-400 text-[10px] font-bold leading-none text-neutral-500 dark:border-white/35 dark:text-white/60"
                      title="More topics"
                    >
                      …
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm font-bold leading-snug tracking-tight text-neutral-900 transition-colors group-hover:text-amber-900 dark:text-white dark:group-hover:text-amber-100/95">
                    {story.title}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
