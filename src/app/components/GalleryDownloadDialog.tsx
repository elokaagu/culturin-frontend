"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "culturin-gallery-download-info";

type SavedInfo = { firstName: string; lastName: string; email: string };

function readSavedInfo(): SavedInfo | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SavedInfo>;
    if (parsed.firstName && parsed.lastName && parsed.email) return parsed as SavedInfo;
  } catch {
    /* ignore */
  }
  return null;
}

export type GalleryDownloadTarget = { src: string; alt: string };

export default function GalleryDownloadDialog({
  target,
  onClose,
}: {
  target: GalleryDownloadTarget | null;
  onClose: () => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!target) return;
    const saved = readSavedInfo();
    if (saved) {
      setFirstName(saved.firstName);
      setLastName(saved.lastName);
      setEmail(saved.email);
    }
    setError(null);
    firstInputRef.current?.focus();
  }, [target]);

  useEffect(() => {
    if (!target) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [target, onClose]);

  if (!target) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!target || submitting) return;
    setSubmitting(true);
    setError(null);

    const response = await fetch("/api/gallery-download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageSrc: target.src,
        imageAlt: target.alt,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
      }),
    }).catch(() => null);

    const data = (await response?.json().catch(() => ({}))) as { message?: string } | undefined;

    if (!response || !response.ok) {
      setError(data?.message ?? "Could not record your download. Try again in a moment.");
      setSubmitting(false);
      return;
    }

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim() }),
      );
    } catch {
      /* ignore */
    }

    const link = document.createElement("a");
    link.href = target.src;
    link.download = target.src.split("/").pop() ?? "culturin-photo.jpg";
    document.body.appendChild(link);
    link.click();
    link.remove();

    setSubmitting(false);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gallery-download-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />
      <div
        className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#1c1a17] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-lg text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          &times;
        </button>

        <p
          id="gallery-download-title"
          className="m-0 font-display text-xl font-semibold tracking-tight text-[#f1e9dc]"
        >
          Download this photo
        </p>
        <p className="m-0 mt-2 text-sm leading-relaxed text-[#f1e9dc]/65">
          Tell us who you are and the full-quality download is yours.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-[0.7rem] font-medium uppercase tracking-[0.1em] text-[#f1e9dc]/55">
                First name
              </span>
              <input
                ref={firstInputRef}
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="given-name"
                className="rounded-xl border border-white/15 bg-white/[0.06] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/30 focus-visible:border-[#e08a5b]/60 focus-visible:ring-2 focus-visible:ring-[#e08a5b]/25"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[0.7rem] font-medium uppercase tracking-[0.1em] text-[#f1e9dc]/55">
                Last name
              </span>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="family-name"
                className="rounded-xl border border-white/15 bg-white/[0.06] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/30 focus-visible:border-[#e08a5b]/60 focus-visible:ring-2 focus-visible:ring-[#e08a5b]/25"
              />
            </label>
          </div>
          <label className="flex flex-col gap-1.5">
            <span className="text-[0.7rem] font-medium uppercase tracking-[0.1em] text-[#f1e9dc]/55">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="rounded-xl border border-white/15 bg-white/[0.06] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/30 focus-visible:border-[#e08a5b]/60 focus-visible:ring-2 focus-visible:ring-[#e08a5b]/25"
            />
          </label>

          {error ? (
            <p role="alert" className="m-0 text-sm text-rose-300">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 inline-flex items-center justify-center rounded-full bg-[#e08a5b] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#17130f] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Preparing download…" : "Download photo"}
          </button>
        </form>
      </div>
    </div>
  );
}
