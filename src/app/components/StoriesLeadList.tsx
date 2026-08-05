"use client";

import { Link } from "next-view-transitions";

import type { simpleBlogCard } from "@/lib/interface";
import {
  IMAGE_BLUR_DATA_URL,
  cmsImageUnoptimized,
  isBundledPlaceholderSrc,
  resolveContentImageSrc,
} from "../../lib/imagePlaceholder";
import SafeContentImage from "./SafeContentImage";

const displayFont = { fontFamily: "var(--font-display), 'Times New Roman', serif" };

type StoriesLeadListProps = {
  stories: simpleBlogCard[];
  title: string;
  description: string;
  viewAllHref: string;
  headingId: string;
};

/**
 * "Stories" as an editorial lead + list — one featured story with image and dek,
 * paired with a plain headline list. Replaces the horizontal card rail.
 */
export default function StoriesLeadList({
  stories,
  title,
  description,
  viewAllHref,
  headingId,
}: StoriesLeadListProps) {
  const [lead, ...rest] = stories;
  const list = rest.slice(0, 4);
  const leadImgSrc = lead ? resolveContentImageSrc(lead.titleImageUrl) : "";

  return (
    <div className="w-full min-w-0">
      <header className="mb-5 flex items-start justify-between gap-4 sm:mb-6">
        <div className="min-w-0 flex-1 pr-2">
          <h2 id={headingId} className="text-xl font-medium tracking-tight sm:text-2xl" style={{ ...displayFont, color: "var(--c-ink)" }}>
            {title}
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed sm:mt-1.5 sm:text-[0.95rem]" style={{ color: "var(--c-muted)" }}>
            {description}
          </p>
        </div>
        <Link
          href={viewAllHref}
          className="shrink-0 self-center text-xs font-semibold uppercase tracking-[0.08em] no-underline transition-colors hover:opacity-70"
          style={{ color: "var(--c-accent)" }}
        >
          See all →
        </Link>
      </header>

      {!lead ? (
        <p className="text-sm" style={{ color: "var(--c-muted)" }}>Stories are being prepared. Check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.3fr_1fr]">
          <Link href={`/articles/${lead.currentSlug}`} className="group block no-underline outline-none">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-neutral-900">
              <SafeContentImage
                src={leadImgSrc}
                alt={lead.title}
                blurDataURL={IMAGE_BLUR_DATA_URL}
                className="object-cover transition duration-300 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                sizes="(max-width: 768px) 100vw, 60vw"
                unoptimized={isBundledPlaceholderSrc(leadImgSrc) || cmsImageUnoptimized(leadImgSrc)}
              />
            </div>
            <h3 className="mt-4 text-xl font-medium tracking-tight sm:text-2xl" style={{ ...displayFont, color: "var(--c-ink)" }}>
              {lead.title}
            </h3>
            {lead.summary ? (
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed sm:text-base" style={{ color: "var(--c-muted)" }}>
                {lead.summary}
              </p>
            ) : null}
          </Link>

          {list.length > 0 ? (
            <ul className="m-0 flex list-none flex-col p-0">
              {list.map((story) => (
                <li key={story.currentSlug} className="border-b py-3 first:pt-0" style={{ borderColor: "var(--c-rule)" }}>
                  <Link href={`/articles/${story.currentSlug}`} className="group block no-underline outline-none">
                    <p className="text-sm font-medium leading-snug transition-colors group-hover:opacity-70 sm:text-base" style={{ color: "var(--c-ink)" }}>
                      {story.title}
                    </p>
                    {story.summary ? (
                      <p className="mt-1 line-clamp-1 text-xs sm:text-sm" style={{ color: "var(--c-muted)" }}>
                        {story.summary}
                      </p>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      )}
    </div>
  );
}
