"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef } from "react";

import { cmsImageUnoptimized, IMAGE_BLUR_DATA_URL } from "@/lib/imagePlaceholder";

export type LightboxItem = { src: string; alt: string };

type ProviderGalleryLightboxProps = {
  open: boolean;
  onClose: () => void;
  items: LightboxItem[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  title?: string;
};

/**
 * Full-screen image lightbox for provider / experience galleries.
 */
export function ProviderGalleryLightbox({
  open,
  onClose,
  items,
  activeIndex,
  onActiveIndexChange,
  title = "Photo",
}: ProviderGalleryLightboxProps) {
  const labelId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const count = items.length;
  const current = count > 0 && activeIndex >= 0 && activeIndex < count ? items[activeIndex] : null;

  const goNext = useCallback(() => {
    if (count < 2) return;
    onActiveIndexChange((activeIndex + 1) % count);
  }, [activeIndex, count, onActiveIndexChange]);

  const goPrev = useCallback(() => {
    if (count < 2) return;
    onActiveIndexChange((activeIndex - 1 + count) % count);
  }, [activeIndex, count, onActiveIndexChange]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose, goNext, goPrev]);

  if (!open || !current || count === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex flex-col items-stretch justify-center p-2 sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        aria-label="Close gallery"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col"
      >
        <div className="flex items-center justify-between gap-2 px-1 py-2 sm:px-0">
          <p id={labelId} className="m-0 min-w-0 text-sm text-white/80 sm:text-base">
            <span className="font-medium text-white">{title}</span>
            {count > 1 ? (
              <span className="text-white/50">
                {" "}
                · {activeIndex + 1} / {count}
              </span>
            ) : null}
          </p>
          <div className="flex shrink-0 items-center gap-1">
            {count > 1 ? (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-white/20 text-sm text-white transition hover:bg-white/10 focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-500/50"
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-white/20 text-sm text-white transition hover:bg-white/10 focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-500/50"
                  aria-label="Next image"
                >
                  ›
                </button>
              </>
            ) : null}
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="ml-1 inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-white/20 text-lg leading-none text-white transition hover:bg-white/10 focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-500/50"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
        <div
          className="relative w-full min-w-0 flex-1 overflow-hidden rounded-lg bg-black/50 sm:rounded-xl"
          style={{ minHeight: "200px", height: "min(85vh, 900px)" }}
        >
          <Image
            key={current.src + activeIndex}
            src={current.src}
            alt={current.alt}
            fill
            unoptimized={cmsImageUnoptimized(current.src)}
            className="object-contain"
            sizes="100vw"
            priority
            placeholder="blur"
            blurDataURL={IMAGE_BLUR_DATA_URL}
          />
        </div>
        {count > 1 ? (
          <ul
            className="mt-2 flex max-w-full list-none flex-nowrap justify-center gap-1.5 overflow-x-auto p-0 pb-1 sm:mt-3"
            aria-label="Photo thumbnails"
          >
            {items.map((it, i) => (
              <li key={it.src + i}>
                <button
                  type="button"
                  onClick={() => onActiveIndexChange(i)}
                  className={`relative h-12 w-16 shrink-0 overflow-hidden rounded border-2 transition sm:h-14 sm:w-20 ${
                    i === activeIndex ? "border-amber-400" : "border-white/20 hover:border-white/40"
                  }`}
                  aria-label={`View image ${i + 1}`}
                  aria-current={i === activeIndex ? "true" : undefined}
                >
                  <Image
                    src={it.src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 64px, 80px"
                    unoptimized={cmsImageUnoptimized(it.src)}
                  />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
