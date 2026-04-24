"use client";

import Image from "next/image";
import { Link } from "next-view-transitions";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  IMAGE_BLUR_DATA_URL,
  isBundledPlaceholderSrc,
  resolveContentImageSrc,
} from "@/lib/imagePlaceholder";
import type { simpleBlogCard } from "@/lib/interface";

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
  return (
    <Card
      className={cn(
        "gap-0 overflow-hidden border-0 p-0 pb-5 pr-4 shadow-lg ring-1 ring-border/60",
        "transition duration-200 hover:scale-[0.98] hover:opacity-90",
        layout === "profile" && "w-[200px] shrink-0",
        className,
      )}
    >
      <Link href={`/articles/${card.currentSlug}`} className="block">
        <CardContent className="p-0">
          <div
            className={cn(
              "relative overflow-hidden rounded-lg bg-neutral-900 shadow-md",
              layout === "grid" &&
                "h-[200px] w-[200px] min-[1025px]:h-[300px] min-[1025px]:w-[300px]",
              layout === "profile" &&
                "h-[200px] w-[150px] min-[1025px]:h-[300px] min-[1025px]:w-[200px] max-[428px]:h-[200px] max-[428px]:w-[150px]",
            )}
          >
            <Image
              src={imgSrc}
              alt={card.title}
              fill
              loading="lazy"
              draggable={false}
              className="object-cover"
              sizes={
                layout === "profile"
                  ? "(max-width: 428px) 150px, 200px"
                  : "(max-width: 1024px) 200px, 300px"
              }
              placeholder="blur"
              blurDataURL={IMAGE_BLUR_DATA_URL}
              unoptimized={isBundledPlaceholderSrc(imgSrc)}
            />
          </div>
        </CardContent>
      </Link>
      <div className={cn("pt-5", layout === "grid" && "max-[428px]:w-[70%]")}>
        <h2
          className={cn(
            "line-clamp-2 cursor-pointer text-base font-medium leading-tight text-foreground",
            "min-[1025px]:text-base max-[428px]:text-sm",
          )}
        >
          <Link href={`/articles/${card.currentSlug}`}>{card.title}</Link>
        </h2>
        <p
          className={cn(
            "line-clamp-2 cursor-pointer text-sm text-muted-foreground",
            "min-[1025px]:text-xs max-[428px]:text-xs",
          )}
        >
          {card.summary}
        </p>
      </div>
    </Card>
  );
}
