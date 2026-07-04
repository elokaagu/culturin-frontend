"use client";

import { useCallback, useEffect } from "react";

export type LightboxItem = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

type LightboxProps = {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
  /** Called instead of downloading directly, so the caller can gate it behind a form. */
  onDownloadRequest?: (item: LightboxItem) => void;
};

/**
 * Full-screen spotlight for a gallery image. Renders a plain <img> pointing
 * directly at the highest-quality file we have, so the browser's native
 * right-click → "Save Image As" downloads that exact file (no Next.js image
 * proxy in the way).
 */
export default function Lightbox({ items, index, onClose, onNavigate, onDownloadRequest }: LightboxProps) {
  const open = index !== null;
  const item = open ? items[index] : null;

  const goPrev = useCallback(() => {
    if (index === null) return;
    onNavigate((index - 1 + items.length) % items.length);
  }, [index, items.length, onNavigate]);

  const goNext = useCallback(() => {
    if (index === null) return;
    onNavigate((index + 1) % items.length);
  }, [index, items.length, onNavigate]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose, goPrev, goNext]);

  if (!open || !item) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-10"
      style={{ background: "rgba(10,8,6,0.94)" }}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full text-2xl text-white/80 transition hover:bg-white/10 hover:text-white sm:right-8 sm:top-8"
      >
        &times;
      </button>

      {items.length > 1 ? (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-2xl text-white/70 transition hover:bg-white/10 hover:text-white sm:left-6"
          >
            &#8249;
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="Next image"
            className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-2xl text-white/70 transition hover:bg-white/10 hover:text-white sm:right-6"
          >
            &#8250;
          </button>
        </>
      ) : null}

      <figure
        className="m-0 flex max-h-full max-w-full flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- direct <img> so right-click "Save Image As" downloads the real file, not a Next.js image-proxy URL */}
        <img
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          className="max-h-[80dvh] w-auto max-w-full select-auto rounded-sm object-contain shadow-2xl"
        />
        <figcaption className="flex items-center gap-4 text-xs text-white/60">
          <span>{index !== null ? index + 1 : 0} / {items.length}</span>
          <button
            type="button"
            onClick={() => onDownloadRequest?.(item)}
            className="text-white/80 underline underline-offset-2 transition hover:text-white"
          >
            Download full quality
          </button>
        </figcaption>
      </figure>
    </div>
  );
}
