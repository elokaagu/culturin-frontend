"use client";

import { Check, ChevronDown } from "lucide-react";
import { Link } from "next-view-transitions";
import { useEffect, useMemo, useRef, useState } from "react";

import { IMAGE_BLUR_DATA_URL, isBundledPlaceholderSrc } from "@/lib/imagePlaceholder";
import type { providerCard } from "@/lib/interface";
import SafeContentImage from "../components/SafeContentImage";

const displayFont = { fontFamily: "var(--font-display), 'Times New Roman', serif" };

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
          <h2 className="m-0 text-2xl font-medium tracking-tight sm:text-3xl" style={{ ...displayFont, color: "var(--c-ink)" }}>
            Meet our local guides
          </h2>
          <p className="m-0 mt-2 text-sm" style={{ color: "var(--c-muted)" }}>
            Real people with bios, specialties, and locations they guide.
          </p>
        </div>

        <div ref={filterRef} className="relative inline-flex items-center gap-2 text-sm">
          <span style={{ color: "var(--c-muted)" }}>Filter by location</span>
          <button
            type="button"
            aria-expanded={filterOpen}
            aria-haspopup="listbox"
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition hover:opacity-80"
            style={{ borderColor: "var(--c-rule)", color: "var(--c-ink)" }}
            onClick={() => setFilterOpen((v) => !v)}
          >
            <span>{currentFilterLabel}</span>
            <ChevronDown className="h-4 w-4 opacity-70" aria-hidden />
          </button>
          {filterOpen ? (
            <ul
              role="listbox"
              className="absolute right-0 top-[calc(100%+0.35rem)] z-20 min-w-[12rem] overflow-hidden rounded-2xl border p-1 shadow-lg"
              style={{ borderColor: "var(--c-rule)", background: "var(--c-bg)" }}
            >
              <li role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={locationFilter === "all"}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium transition hover:opacity-80"
                  style={{ color: "var(--c-ink)" }}
                  onClick={() => {
                    setLocationFilter("all");
                    setFilterOpen(false);
                  }}
                >
                  <span>All locations</span>
                  <Check className="h-4 w-4" style={{ color: "var(--c-accent)", opacity: locationFilter === "all" ? 1 : 0 }} />
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
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium transition hover:opacity-80"
                      style={{ color: "var(--c-ink)" }}
                      onClick={() => {
                        setLocationFilter(normalized);
                        setFilterOpen(false);
                      }}
                    >
                      <span>{location}</span>
                      <Check className="h-4 w-4" style={{ color: "var(--c-accent)", opacity: selected ? 1 : 0 }} />
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
              <li key={guide.slug.current} className="overflow-hidden rounded-2xl border" style={{ borderColor: "var(--c-rule)" }}>
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
                  <div className="absolute -bottom-7 left-4 h-14 w-14 overflow-hidden rounded-full border-2 shadow" style={{ borderColor: "var(--c-bg)" }}>
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
                      <div className="flex h-full w-full items-center justify-center text-sm font-semibold" style={{ color: "var(--c-ink)" }}>
                        {(guide.name || "G").slice(0, 1).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 p-4 pt-9">
                  <h3 className="m-0 text-lg font-medium" style={{ ...displayFont, color: "var(--c-ink)" }}>
                    {guide.name || "Local guide"}
                  </h3>
                  <p className="m-0 text-sm" style={{ color: "var(--c-muted)" }}>{guide.eventName}</p>
                  {guide.location ? (
                    <p className="m-0 text-sm" style={{ color: "var(--c-muted)" }}>Guides in: {guide.location}</p>
                  ) : null}
                  {guide.description ? (
                    <p className="m-0 line-clamp-3 text-sm leading-relaxed" style={{ color: "var(--c-muted)" }}>{guide.description}</p>
                  ) : null}

                  {tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {tags.map((tag) => (
                        <span
                          key={`${guide.slug.current}-${tag}`}
                          className="rounded-full border px-2.5 py-1 text-xs font-medium"
                          style={{ borderColor: "var(--c-rule)", color: "var(--c-muted)" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-3 pt-1">
                    <Link
                      href={`/travel-guides/hosts/${guide.slug.current}`}
                      className="text-sm font-medium underline-offset-2 hover:underline"
                      style={{ color: "var(--c-accent)" }}
                    >
                      View profile
                    </Link>
                    {guide.contactEmail ? (
                      <a
                        href={`mailto:${guide.contactEmail}`}
                        className="text-sm font-medium underline-offset-2 hover:underline"
                        style={{ color: "var(--c-ink)" }}
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
        <p className="m-0 rounded-xl border border-dashed px-4 py-6 text-sm" style={{ borderColor: "var(--c-rule)", color: "var(--c-muted)" }}>
          No guides match this location yet.
        </p>
      )}
    </section>
  );
}
