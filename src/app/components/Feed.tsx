"use client";

import Image from "next/image";
import Link from "next/link";

export type FeedCardProps = {
  title: string;
  description: string;
  /** Destination when the card is activated. */
  href: string;
  imageSrc: string;
  imageAlt: string;
  /** ISO 8601 date string for `<time dateTime>` (e.g. `2024-01-17`). */
  publishedAt: string;
  /** Human-readable date label. */
  dateLabel: string;
  blurDataURL?: string;
};

const linkShellClass =
  "group block w-full max-w-3xl rounded-2xl border border-white/10 bg-black text-left shadow-sm no-underline transition-colors hover:border-white/20 hover:bg-neutral-950/80";

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
  return (
    <Link href={href} className={linkShellClass}>
      <article className={articleInnerClass}>
        <div className={imageWrapClass}>
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, 16rem"
            className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
            placeholder={blurDataURL ? "blur" : "empty"}
            blurDataURL={blurDataURL}
            draggable={false}
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
          <h2 className="text-xl font-semibold leading-snug text-white group-hover:text-amber-100/95 sm:text-[1.35rem]">
            {title}
          </h2>
          <p className="text-sm leading-relaxed text-white/70 sm:text-base">{description}</p>
          <time
            dateTime={publishedAt}
            className="text-xs font-medium uppercase tracking-wide text-white/45"
          >
            {dateLabel}
          </time>
        </div>
      </article>
    </Link>
  );
}
