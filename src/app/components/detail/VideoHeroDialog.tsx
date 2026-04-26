"use client";

import MuxPlayer from "@mux/mux-player-react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { useEffect, useId, useRef } from "react";

import type { videoCard } from "@/lib/interface";
import {
  IMAGE_BLUR_DATA_URL,
  isBundledPlaceholderSrc,
  resolveVideoThumbnailSrc,
} from "@/lib/imagePlaceholder";

type VideoHeroDialogProps = {
  open: boolean;
  onClose: () => void;
  video: videoCard | null;
};

export function VideoHeroDialog({ open, onClose, video }: VideoHeroDialogProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || !video) return null;

  const streamHref = `/stream?play=${encodeURIComponent(video.currentSlug)}`;
  const thumbSrc = resolveVideoThumbnailSrc(video.videoThumbnailUrl);
  const canPlay = Boolean(video.playbackId);

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-5" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-5xl overflow-hidden rounded-2xl border border-white/15 bg-neutral-950 text-white shadow-[0_24px_80px_rgba(0,0,0,0.85)]"
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
          <h2 id={titleId} className="m-0 min-w-0 text-base font-semibold tracking-tight sm:text-lg">
            <span className="line-clamp-1">{video.title}</span>
          </h2>
          <div className="flex shrink-0 items-center gap-1.5">
            <Link
              href={streamHref}
              className="hidden rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium text-white/80 no-underline transition hover:bg-white/10 sm:inline-flex"
            >
              Full page
            </Link>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-white/15 text-lg leading-none text-white/80 transition hover:bg-white/10 focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-500/50"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        <div className="grid gap-0 md:grid-cols-[1.2fr_0.8fr]">
          <div className="relative min-w-0 bg-black">
            {canPlay ? (
              <MuxPlayer
                key={video.currentSlug}
                playbackId={video.playbackId}
                className="w-full"
                style={{ width: "100%", aspectRatio: "16 / 9" }}
                metadata={{
                  video_title: video.title ?? "",
                  viewer_user_id: "hero-dialog",
                }}
              />
            ) : (
              <div className="relative aspect-video w-full">
                <Image
                  src={thumbSrc}
                  alt={video.title}
                  fill
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                  sizes="(max-width: 768px) 100vw, 896px"
                  unoptimized={isBundledPlaceholderSrc(thumbSrc)}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Link
                    href={streamHref}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black no-underline transition hover:bg-neutral-200"
                    onClick={onClose}
                  >
                    Open in stream
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className="border-t border-white/10 p-4 sm:p-5 md:border-l md:border-t-0">
            {video.uploader ? <p className="m-0 text-sm text-white/60">{video.uploader}</p> : null}
            {video.description ? (
              <p className="m-0 mt-2 text-sm leading-relaxed text-white/80 sm:text-base">{video.description}</p>
            ) : null}
            <p className="m-0 mt-4 sm:hidden">
              <Link
                href={streamHref}
                className="text-sm font-medium text-amber-300/90 no-underline transition hover:text-amber-200"
                onClick={onClose}
              >
                Open full stream page →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
