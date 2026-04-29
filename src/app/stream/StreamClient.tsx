"use client";

import Image from "next/image";
import { Link } from "next-view-transitions";
import { Play } from "lucide-react";

import type { fullVideo } from "@/lib/interface";
import { hostedVideoIframeSrc } from "@/lib/videoEmbed";
import {
  IMAGE_BLUR_DATA_URL,
  isBundledPlaceholderSrc,
  resolveVideoThumbnailSrc,
} from "../../lib/imagePlaceholder";

type StreamClientProps = {
  videos: fullVideo[];
  selectedSlug?: string;
};

export default function StreamClient({ videos, selectedSlug }: StreamClientProps) {
  if (videos.length === 0) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-14 text-center sm:px-6">
        <h1 className="text-2xl font-semibold text-white">Stream</h1>
        <p className="mt-2 text-sm text-white/65">No videos are available yet.</p>
      </div>
    );
  }

  const selectedVideo = videos.find((video) => video.currentSlug === selectedSlug) ?? videos[0];
  const rowVideos = videos.filter((video) => video.currentSlug !== selectedVideo.currentSlug);
  const streamIframeSrc = selectedVideo.playbackId
    ? hostedVideoIframeSrc(selectedVideo.playbackId, selectedVideo.title ?? "")
    : "";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-14 pt-5 sm:px-6">
      <section className="mb-10 overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/75 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.75)]">
        <div className="grid gap-0 lg:grid-cols-[1.35fr_1fr]">
          <div className="min-w-0">
            {streamIframeSrc ? (
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                <iframe
                  key={selectedVideo.currentSlug}
                  src={streamIframeSrc}
                  title={selectedVideo.title ?? "Video"}
                  className="absolute inset-0 size-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                />
              </div>
            ) : selectedVideo.playbackId ? (
              <div className="flex aspect-video w-full items-center justify-center bg-neutral-900 px-6 text-center text-sm text-white/60">
                Inline playback isn&apos;t configured for this deployment yet.
              </div>
            ) : (
              <div className="flex aspect-video w-full items-center justify-center bg-neutral-900 text-sm text-white/60">
                No player ID for this video.
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center p-5 sm:p-6 lg:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-400/80">Now streaming</p>
            <h1 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">
              {selectedVideo.title}
            </h1>
            {selectedVideo.uploader ? <p className="mt-2 text-sm text-white/65">{selectedVideo.uploader}</p> : null}
            {selectedVideo.description ? (
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">{selectedVideo.description}</p>
            ) : null}
            <div className="mt-6">
              <Link
                href={`/stream?play=${selectedVideo.currentSlug}`}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black no-underline transition hover:bg-neutral-200"
              >
                <Play className="h-4 w-4" fill="currentColor" />
                Play from start
              </Link>
            </div>
          </div>
        </div>
      </section>

      {rowVideos.length > 0 ? (
        <section aria-labelledby="stream-trending-now">
          <h2 id="stream-trending-now" className="mb-4 text-xl font-semibold tracking-tight text-white sm:text-2xl">
            Trending now
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {rowVideos.map((video) => {
              const thumbSrc = resolveVideoThumbnailSrc(video.videoThumbnailUrl);
              return (
                <article key={video.currentSlug} className="min-w-0">
                  <Link
                    href={`/stream?play=${video.currentSlug}`}
                    className="group block w-full no-underline outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-neutral-900 ring-1 ring-white/10">
                      <Image
                        src={thumbSrc}
                        alt={video.title}
                        fill
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL={IMAGE_BLUR_DATA_URL}
                        className="object-cover transition duration-300 group-hover:scale-[1.03]"
                        sizes="(max-width: 640px) 48vw, (max-width: 1024px) 30vw, 18vw"
                        unoptimized={isBundledPlaceholderSrc(thumbSrc)}
                      />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent px-3 pb-3 pt-10">
                        <p className="line-clamp-2 text-sm font-semibold leading-snug tracking-tight text-white">{video.title}</p>
                        {video.uploader ? <p className="mt-1 line-clamp-1 text-xs text-white/65">{video.uploader}</p> : null}
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
}
