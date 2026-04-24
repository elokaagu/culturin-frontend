"use client";

import Image from "next/image";
import { Link } from "next-view-transitions";

import {
  IMAGE_BLUR_DATA_URL,
  isBundledPlaceholderSrc,
  resolveContentImageSrc,
} from "../../lib/imagePlaceholder";

type FeedCardProps = {
  title: string;
  description: string;
  /** Destination when the card is activated. */
  href: string;
  /** Remote URL, `/path`, or empty — empty uses the bundled placeholder. */
  imageSrc: string | null | undefined;
  imageAlt: string;
  /** ISO 8601 date string for `<time dateTime>` (e.g. `2024-01-17`). */
  publishedAt: string;
  /** Human-readable date label. */
  dateLabel: string;
  blurDataURL?: string;
};

const linkShellClass =
  "group block w-full max-w-3xl rounded-2xl border border-neutral-200 bg-white text-left shadow-sm no-underline transition-colors hover:border-neutral-300 hover:bg-neutral-50 dark:border-white/10 dark:bg-black dark:hover:border-white/20 dark:hover:bg-neutral-950/80";

const articleInnerClass =
  "flex flex-col gap-4 p-4 sm:flex-row sm:items-stretch sm:gap-6 sm:p-5";

const imageWrapClass =
  "relative aspect-[5/3] w-full shrink-0 overflow-hidden rounded-xl bg-neutral-900 sm:aspect-auto sm:h-40 sm:w-64";

/**
 * Editorial-style card: entire surface navigates to `href` (no misleading partial hit targets).
 */
export function FeedCard({
  title,
  description,
  href,
  imageSrc,
  imageAlt,
  publishedAt,
  dateLabel,
  blurDataURL,
}: FeedCardProps) {
  const resolvedSrc = resolveContentImageSrc(imageSrc);
  return (
    <Link href={href} className={linkShellClass}>
      <article className={articleInnerClass}>
        <div className={imageWrapClass}>
          <Image
            src={resolvedSrc}
            alt={imageAlt}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 100vw, 16rem"
            className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
            placeholder="blur"
            blurDataURL={blurDataURL ?? IMAGE_BLUR_DATA_URL}
            draggable={false}
            unoptimized={isBundledPlaceholderSrc(resolvedSrc)}
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
          <h2 className="text-xl font-semibold leading-snug text-neutral-900 group-hover:text-amber-800 sm:text-[1.35rem] dark:text-white dark:group-hover:text-amber-100/95">
            {title}
          </h2>
          <p className="text-sm leading-relaxed text-neutral-600 sm:text-base dark:text-white/70">{description}</p>
          <time
            dateTime={publishedAt}
            className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-white/45"
          >
            {dateLabel}
          </time>
        </div>
      </article>
    </Link>
  );
}
