"use client";

import { useCallback, useEffect, useId, useRef } from "react";

type ShareLinkModalProps = {
  open: boolean;
  onClose: () => void;
  url: string;
  title: string;
};

export function ShareLinkModal({ open, onClose, url, title }: ShareLinkModalProps) {
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
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* ignore */
    }
  }, [url]);

  const nativeShare = useCallback(async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({ title, text: "Check this out on Culturin.", url });
      onClose();
    } catch {
      /* user cancelled or error */
    }
  }, [onClose, title, url]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1600] flex items-end justify-center p-4 sm:items-center" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-black/75 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md rounded-2xl border border-white/15 bg-neutral-950 p-6 text-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 id={titleId} className="m-0 text-lg font-semibold tracking-tight">
            Share
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-white/15 text-lg leading-none text-white/80 transition hover:bg-white/10 focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-500/50"
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>
        <p className="mt-2 text-sm text-white/65">Copy the link or use your device share sheet.</p>
        <label className="mt-4 block text-xs font-medium uppercase tracking-wide text-white/45" htmlFor={`${titleId}-url`}>
          Link
        </label>
        <input
          id={`${titleId}-url`}
          readOnly
          value={url}
          className="mt-1.5 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-white/90 outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
          onFocus={(e) => e.currentTarget.select()}
        />
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void copy()}
            className="inline-flex min-h-[40px] items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/15 focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-500/50"
          >
            Copy link
          </button>
          {typeof navigator !== "undefined" && typeof navigator.share === "function" ? (
            <button
              type="button"
              onClick={() => void nativeShare()}
              className="inline-flex min-h-[40px] items-center justify-center rounded-full border border-amber-400/40 bg-amber-500/15 px-4 text-sm font-semibold text-amber-100 transition hover:bg-amber-500/25 focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-400/60"
            >
              Share via…
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
