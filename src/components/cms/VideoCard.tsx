"use client";

import { Link } from "next-view-transitions";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  IMAGE_BLUR_DATA_URL,
  cmsImageUnoptimized,
  isBundledPlaceholderSrc,
  resolveVideoThumbnailSrc,
} from "@/lib/imagePlaceholder";
import type { videoCard } from "@/lib/interface";
import SafeContentImage from "@/app/components/SafeContentImage";

export function VideoCardFromCms({ video, className }: { video: videoCard; className?: string }) {
  const thumbSrc = resolveVideoThumbnailSrc(video.videoThumbnailUrl);
  return (
    <Card
      className={cn(
        "w-full max-w-[25rem] gap-0 overflow-hidden border-0 p-0 shadow-lg ring-1 ring-border/60",
        "transition duration-200 hover:scale-[0.99] hover:opacity-90",
        className,
      )}
    >
      <Link href={`/stream/${video.currentSlug}`} className="block">
        <CardContent className="p-0">
          <div
            className={cn(
              "relative h-[200px] w-full max-w-[400px] overflow-hidden bg-muted",
              "max-[428px]:h-[200px] max-[428px]:w-[min(100%,300px)]",
            )}
          >
            <SafeContentImage
              src={thumbSrc}
              alt={video.title}
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 33vw"
              blurDataURL={IMAGE_BLUR_DATA_URL}
              unoptimized={isBundledPlaceholderSrc(thumbSrc) || cmsImageUnoptimized(thumbSrc)}
            />
          </div>
        </CardContent>
      </Link>
      <div className="px-0 pt-4">
        <h2 className="line-clamp-2 cursor-pointer text-base font-medium text-foreground max-[428px]:text-sm">
          <Link href={`/stream/${video.currentSlug}`}>{video.title}</Link>
        </h2>
        <p className="text-sm text-muted-foreground max-[428px]:text-xs">{video.uploader}</p>
      </div>
    </Card>
  );
}
