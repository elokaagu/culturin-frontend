"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import LazyImg from "@/app/components/LazyImg";

type GalleryPickerImage = {
  id: string;
  src: string;
  alt: string;
  eventLabel: string;
};

export function StudioMediaGalleryPicker({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (src: string) => void;
}) {
  const [images, setImages] = useState<GalleryPickerImage[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open || images) return;
    let cancelled = false;
    fetch("/api/admin/gallery", { cache: "no-store" })
      .then(async (res) => {
        const body = (await res.json().catch(() => ({}))) as { images?: GalleryPickerImage[]; message?: string };
        if (cancelled) return;
        if (!res.ok) {
          setError(res.status === 403 ? "The media gallery is only available to admins." : body.message ?? "Could not load the media gallery.");
          return;
        }
        setImages(body.images ?? []);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load the media gallery.");
      });
    return () => {
      cancelled = true;
    };
  }, [open, images]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const filtered = useMemo(() => {
    if (!images) return [];
    const q = query.trim().toLowerCase();
    if (!q) return images;
    return images.filter((img) => `${img.eventLabel} ${img.alt}`.toLowerCase().includes(q));
  }, [images, query]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="studio-media-picker-title"
        className="culturin-editorial relative flex max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl border border-[color:var(--c-rule)] bg-[color:color-mix(in_srgb,var(--c-bg)_55%,white)] p-5 shadow-xl dark:bg-[#1c1a17]"
        style={{ color: "var(--c-ink)" }}
      >
        <div className="flex items-center justify-between gap-3">
          <p id="studio-media-picker-title" className="m-0 font-display text-lg font-semibold tracking-tight">
            Media gallery
          </p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 items-center rounded-full border border-[color:var(--c-rule)] px-3 text-xs font-medium transition hover:bg-[color:color-mix(in_srgb,var(--c-accent)_10%,transparent)]"
          >
            Close
          </button>
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by event or alt text"
          className="mt-4 rounded-xl border border-[color:var(--c-rule)] bg-[color:color-mix(in_srgb,var(--c-bg)_40%,white)] px-3.5 py-2 text-sm text-[color:var(--c-ink)] outline-none placeholder:text-[color:var(--c-muted)] focus-visible:border-[color:var(--c-accent)] dark:bg-black/35"
        />
        <div className="mt-4 min-h-[8rem] overflow-y-auto">
          {error ? (
            <p className="m-0 text-sm text-[color:var(--c-muted)]">{error}</p>
          ) : !images ? (
            <p className="m-0 text-sm text-[color:var(--c-muted)]">Loading…</p>
          ) : filtered.length === 0 ? (
            <p className="m-0 text-sm text-[color:var(--c-muted)]">
              {images.length === 0 ? "No images in the media gallery yet." : "No images match your search."}
            </p>
          ) : (
            <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 md:grid-cols-4">
              {filtered.map((img) => (
                <li key={img.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(img.src);
                      onClose();
                    }}
                    className="group block w-full overflow-hidden rounded-xl border border-[color:var(--c-rule)] text-left transition hover:border-[color:var(--c-accent)] focus-visible:border-[color:var(--c-accent)] focus-visible:outline-none"
                  >
                    <LazyImg src={img.src} alt={img.alt} loading="lazy" className="aspect-square w-full object-cover" />
                    <span className="block truncate px-2 py-1.5 text-[11px] text-[color:var(--c-muted)]">
                      {img.eventLabel}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
