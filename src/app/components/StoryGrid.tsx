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

/** A calm 3-up grid of story cards: 4:3 image, headline, one-line dek. Images lazy-load with a blur-up. */
export default function StoryGrid({ stories }: { stories: simpleBlogCard[] }) {
  if (stories.length === 0) return null;

  return (
    <ul className="m-0 grid list-none grid-cols-1 gap-x-6 gap-y-10 p-0 sm:grid-cols-2 lg:grid-cols-3">
      {stories.map((story) => {
        const src = resolveContentImageSrc(story.titleImageUrl);
        return (
          <li key={story.currentSlug}>
            <Link href={`/articles/${story.currentSlug}`} className="group block no-underline outline-none">
              <div
                className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border"
                style={{ borderColor: "var(--c-rule)", background: "var(--c-rule)" }}
              >
                <SafeContentImage
                  src={src}
                  alt={story.title}
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                  className="object-cover transition duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  unoptimized={isBundledPlaceholderSrc(src) || cmsImageUnoptimized(src)}
                />
              </div>
              <h3
                className="m-0 mt-4 text-xl font-medium leading-snug tracking-tight transition-opacity group-hover:opacity-70"
                style={{ ...displayFont, color: "var(--c-ink)" }}
              >
                {story.title}
              </h3>
              {story.summary ? (
                <p className="m-0 mt-2 line-clamp-2 text-sm leading-relaxed" style={{ color: "var(--c-muted)" }}>
                  {story.summary}
                </p>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
