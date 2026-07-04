"use client";

import { useMemo, useState } from "react";

import type { StudioGalleryDownload } from "@/lib/studio/galleryDownloads";

function formatDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function StudioGalleryDownloadsPageClient({
  downloads,
  hasDb,
}: {
  downloads: StudioGalleryDownload[];
  hasDb: boolean;
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return downloads;
    return downloads.filter((d) =>
      [d.firstName, d.lastName, d.email, d.imageSrc].some((f) => f.toLowerCase().includes(q)),
    );
  }, [downloads, search]);

  return (
    <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#121212] sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3 gap-y-2">
        <h2 className="m-0 font-display text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl dark:text-white">
          All downloads
        </h2>
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-culturin-800 dark:text-culturin-300/90">
          {search.trim()
            ? `${filtered.length} of ${downloads.length} shown`
            : `${downloads.length} download${downloads.length === 1 ? "" : "s"}`}
        </span>
      </div>

      {hasDb && downloads.length > 0 ? (
        <label className="mt-5 flex flex-col gap-2 sm:max-w-sm">
          <span className="text-[0.7rem] font-medium uppercase tracking-[0.12em] text-neutral-500 dark:text-white/58">
            Search
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, photo…"
            autoComplete="off"
            className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 shadow-inner shadow-neutral-900/5 outline-none transition placeholder:text-neutral-400 focus-visible:border-culturin-500/60 focus-visible:ring-2 focus-visible:ring-culturin-400/25 dark:border-white/12 dark:bg-black/60 dark:text-white dark:shadow-black/40 dark:placeholder:text-white/35"
          />
        </label>
      ) : null}

      <div className="mt-6 space-y-3">
        {!hasDb ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-600 dark:border-white/15 dark:text-white/65">
            Your content library isn&apos;t connected in this preview, so downloads can&apos;t be listed yet.
          </p>
        ) : downloads.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-600 dark:border-white/15 dark:text-white/65">
            No downloads yet. When someone downloads a full-quality photo from /gallery, it&apos;ll show up here.
          </p>
        ) : filtered.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-600 dark:border-white/15 dark:text-white/65">
            No downloads match your search. Try a different term or clear the search box.
          </p>
        ) : (
          filtered.map((d) => (
            <div
              key={d.id}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3.5 dark:border-white/12 dark:bg-white/[0.04]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={d.imageSrc}
                alt={d.imageAlt || ""}
                className="h-12 w-12 shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="m-0 text-sm font-semibold text-neutral-900 dark:text-white">
                  {d.firstName} {d.lastName}
                </p>
                <a
                  href={`mailto:${d.email}`}
                  className="text-xs text-neutral-600 no-underline hover:underline dark:text-white/70"
                >
                  {d.email}
                </a>
              </div>
              <span className="whitespace-nowrap text-xs text-neutral-500 dark:text-white/58">
                {formatDate(d.createdAt)}
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
