"use client";

import { Link } from "next-view-transitions";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  IMAGE_BLUR_DATA_URL,
  cmsImageUnoptimized,
  isBundledPlaceholderSrc,
  resolveContentImageSrc,
} from "@/lib/imagePlaceholder";
import type { simpleBlogCard } from "@/lib/interface";
import SafeContentImage from "@/app/components/SafeContentImage";

export function ArticleCardFromBlog({
  card,
  layout = "grid",
  className,
}: {
  card: simpleBlogCard;
  layout?: "grid" | "profile";
  className?: string;
}) {
  const imgSrc = resolveContentImageSrc(card.titleImageUrl);
  const unopt = isBundledPlaceholderSrc(imgSrc) || cmsImageUnoptimized(imgSrc);

  if (layout === "profile") {
    return (
      <Card
        className={cn(
          "gap-0 overflow-visible border-0 bg-transparent p-0 shadow-none ring-0",
          "transition duration-300 hover:opacity-[0.92] motion-reduce:transition-none",
          className,
        )}
      >
        <Link href={`/articles/${card.currentSlug}`} className="group block">
          <CardContent className="p-0">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-neutral-200/90 dark:ring-white/10">
              <SafeContentImage
                src={imgSrc}
                alt={card.title}
                className="object-cover transition duration-500 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                blurDataURL={IMAGE_BLUR_DATA_URL}
                unoptimized={unopt}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 sm:p-4">
                <h2 className="line-clamp-2 text-left text-sm font-semibold leading-snug tracking-tight text-white drop-shadow-sm sm:text-base">
                  {card.title}
                </h2>
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "group relative flex-col gap-0 overflow-hidden border-0 bg-neutral-900 p-0 shadow-lg ring-1 ring-border/60",
        "text-white dark:bg-card",
        "transition duration-200 hover:scale-[0.99]",
        className,
      )}
    >
      <Link href={`/articles/${card.currentSlug}`} className="block w-full no-underline">
        <CardContent className="p-0">
          <div
            className={cn(
              "relative w-full max-w-full overflow-hidden rounded-lg bg-neutral-900 shadow-md",
              "aspect-[4/5] min-h-[12.5rem] w-full min-[1025px]:min-h-[18.75rem]",
            )}
          >
            <SafeContentImage
              src={imgSrc}
              alt={card.title}
              className="object-cover"
              sizes="(max-width: 1024px) 50vw, 300px"
              blurDataURL={IMAGE_BLUR_DATA_URL}
              unoptimized={unopt}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-5">
              <h2
                className={cn(
                  "line-clamp-2 text-base font-semibold leading-tight text-white",
                  "min-[1025px]:text-base max-[428px]:text-sm",
                )}
              >
                {card.title}
              </h2>
              {card.summary ? (
                <p
                  className={cn(
                    "mt-1.5 line-clamp-2 text-sm text-white/90",
                    "min-[1025px]:text-xs max-[428px]:text-xs",
                  )}
                >
                  {card.summary}
                </p>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
