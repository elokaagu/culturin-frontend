"use client";

import { Link } from "next-view-transitions";
import { useEffect, useId, useRef, type ReactNode } from "react";

type SaveFavoriteModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description: ReactNode;
  primaryAction?: {
    label: string;
    onClick: () => void | Promise<void>;
    pending?: boolean;
  };
  loginHref?: string;
  loginLabel?: string;
  /** Optional “copy this page” action (e.g. current experience URL). */
  onCopyLink?: () => void | Promise<void>;
};

export function SaveFavoriteModal({
  open,
  onClose,
  title,
  description,
  primaryAction,
  loginHref,
  loginLabel = "Sign in",
  onCopyLink,
}: SaveFavoriteModalProps) {
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
            {title}
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
        <div className="mt-2 text-sm leading-relaxed text-white/70">{description}</div>
        <div className="mt-5 flex flex-wrap gap-2">
          {primaryAction ? (
            <button
              type="button"
              disabled={primaryAction.pending}
              onClick={() => void primaryAction.onClick()}
              className="inline-flex min-h-[40px] items-center justify-center rounded-full border border-amber-400/40 bg-amber-500/15 px-4 text-sm font-semibold text-amber-100 transition hover:bg-amber-500/25 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-400/60"
            >
              {primaryAction.pending ? "Saving…" : primaryAction.label}
            </button>
          ) : null}
          {onCopyLink ? (
            <button
              type="button"
              onClick={() => void onCopyLink()}
              className="inline-flex min-h-[40px] items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/15 focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-500/50"
            >
              Copy link
            </button>
          ) : null}
          {loginHref ? (
            <Link
              href={loginHref}
              onClick={onClose}
              className="inline-flex min-h-[40px] items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 text-sm font-semibold text-white no-underline transition hover:bg-white/15 focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-500/50"
            >
              {loginLabel}
            </Link>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-[40px] items-center justify-center rounded-full border border-white/15 px-4 text-sm font-medium text-white/85 transition hover:bg-white/10 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white/30"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
