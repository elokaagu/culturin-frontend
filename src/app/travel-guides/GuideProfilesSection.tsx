"use client";

import { Check, ChevronDown } from "lucide-react";
import { Link } from "next-view-transitions";
import { useEffect, useMemo, useRef, useState } from "react";

import { IMAGE_BLUR_DATA_URL, isBundledPlaceholderSrc } from "@/lib/imagePlaceholder";
import type { providerCard } from "@/lib/interface";
import SafeContentImage from "../components/SafeContentImage";

function normalizeLocation(value: string) {
  return value.trim().toLowerCase();
}

export default function GuideProfilesSection({ guides }: { guides: providerCard[] }) {
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const locations = useMemo(() => {
    const set = new Set<string>();
    for (const guide of guides) {
      const location = (guide.location ?? "").trim();
      if (location) set.add(location);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [guides]);

  const filteredGuides = useMemo(() => {
    if (locationFilter === "all") return guides;
    return guides.filter((g) => normalizeLocation(g.location ?? "") === locationFilter);
  }, [guides, locationFilter]);

  useEffect(() => {
    if (!filterOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      const node = event.target as Node;
      if (filterRef.current?.contains(node)) return;
      setFilterOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFilterOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, [filterOpen]);

  const currentFilterLabel =
    locationFilter === "all" ? "All locations" : locations.find((location) => normalizeLocation(location) === locationFilter) || "All locations";

  return (
    <section className="mb-10 sm:mb-14">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="m-0 text-2xl font-semibold tracking-tight sm:text-3xl">Meet our local guides</h2>
          <p className="m-0 mt-2 text-sm text-neutral-500 dark:text-white/55">
            Real people with bios, specialties, and locations they guide.
          </p>
        </div>

        <div ref={filterRef} className="relative inline-flex items-center gap-2 text-sm">
          <span className="text-neutral-500 dark:text-white/60">Filter by location</span>
          <button
            type="button"
            aria-expanded={filterOpen}
            aria-haspopup="listbox"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50 focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-500/40 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            onClick={() => setFilterOpen((v) => !v)}
          >
            <span>{currentFilterLabel}</span>
            <ChevronDown className="h-4 w-4 opacity-70" aria-hidden />
          </button>
          {filterOpen ? (
            <ul
              role="listbox"
              className="absolute right-0 top-[calc(100%+0.35rem)] z-20 min-w-[12rem] overflow-hidden rounded-2xl border border-neutral-200 bg-white p-1 shadow-lg dark:border-white/10 dark:bg-neutral-950"
            >
              <li role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={locationFilter === "all"}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium text-neutral-800 transition hover:bg-neutral-100 dark:text-white/90 dark:hover:bg-white/10"
                  onClick={() => {
                    setLocationFilter("all");
                    setFilterOpen(false);
                  }}
                >
                  <span>All locations</span>
                  <Check className={locationFilter === "all" ? "h-4 w-4 text-amber-600 dark:text-amber-300" : "h-4 w-4 opacity-0"} />
                </button>
              </li>
              {locations.map((location) => {
                const normalized = normalizeLocation(location);
                const selected = locationFilter === normalized;
                return (
                  <li role="presentation" key={location}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium text-neutral-800 transition hover:bg-neutral-100 dark:text-white/90 dark:hover:bg-white/10"
                      onClick={() => {
                        setLocationFilter(normalized);
                        setFilterOpen(false);
                      }}
                    >
                      <span>{location}</span>
                      <Check className={selected ? "h-4 w-4 text-amber-600 dark:text-amber-300" : "h-4 w-4 opacity-0"} />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </header>

      {filteredGuides.length > 0 ? (
        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGuides.map((guide) => {
            const coverUrl = guide.bannerImage?.image?.url?.trim() || null;
            const coverAlt = guide.bannerImage?.image?.alt?.trim() || guide.name || guide.eventName || "Guide cover";
            const avatarUrl = guide.avatarImageUrl?.trim() || coverUrl;
            const tags = [...(guide.languages ?? []), ...(guide.specialties ?? [])].slice(0, 5);

            return (
              <li
                key={guide.slug.current}
                className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-white/10 dark:bg-neutral-950/40"
              >
                <div className="relative h-40 w-full">
                  {coverUrl ? (
                    <SafeContentImage
                      src={coverUrl}
                      alt={coverAlt}
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      blurDataURL={IMAGE_BLUR_DATA_URL}
                      unoptimized={isBundledPlaceholderSrc(coverUrl)}
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-white/15 dark:to-white/5" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  <div className="absolute -bottom-7 left-4 h-14 w-14 overflow-hidden rounded-full border-2 border-white bg-neutral-100 shadow dark:border-black dark:bg-neutral-900">
                    {avatarUrl ? (
                      <SafeContentImage
                        src={avatarUrl}
                        alt={`${guide.name || "Guide"} avatar`}
                        className="object-cover"
                        sizes="56px"
                        blurDataURL={IMAGE_BLUR_DATA_URL}
                        unoptimized={isBundledPlaceholderSrc(avatarUrl)}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-neutral-700 dark:text-white/80">
                        {(guide.name || "G").slice(0, 1).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 p-4 pt-9">
                  <h3 className="m-0 text-lg font-semibold text-neutral-900 dark:text-white">{guide.name || "Local guide"}</h3>
                  <p className="m-0 text-sm text-neutral-500 dark:text-white/60">{guide.eventName}</p>
                  {guide.location ? (
                    <p className="m-0 text-sm text-neutral-600 dark:text-white/75">Guides in: {guide.location}</p>
                  ) : null}
                  {guide.description ? (
                    <p className="m-0 line-clamp-3 text-sm leading-relaxed text-neutral-600 dark:text-white/75">{guide.description}</p>
                  ) : null}

                  {tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {tags.map((tag) => (
                        <span
                          key={`${guide.slug.current}-${tag}`}
                          className="rounded-full border border-neutral-300 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:border-white/15 dark:bg-white/5 dark:text-white/80"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-3 pt-1">
                    <Link
                      href={`/travel-guides/hosts/${guide.slug.current}`}
                      className="text-sm font-medium text-amber-800 underline-offset-2 hover:underline dark:text-amber-400/90"
                    >
                      View profile
                    </Link>
                    {guide.contactEmail ? (
                      <a
                        href={`mailto:${guide.contactEmail}`}
                        className="text-sm font-medium text-neutral-700 underline-offset-2 hover:underline dark:text-white/80"
                      >
                        Contact
                      </a>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="m-0 rounded-xl border border-dashed border-neutral-300 px-4 py-6 text-sm text-neutral-500 dark:border-white/15 dark:text-white/55">
          No guides match this location yet.
        </p>
      )}
    </section>
  );
}
