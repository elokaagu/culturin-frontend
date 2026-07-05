"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import { blurForSrc } from "@/lib/culturinImages";
import { EDITORIAL_BG, EDITORIAL_INK, EDITORIAL_MUTED, EDITORIAL_RULE, SURFACE_DARK } from "@/lib/theme/culturinTokens";
import BlurImage from "../components/motion/BlurImage";
import Reveal from "../components/motion/Reveal";
import Lightbox, { type LightboxItem } from "../components/Lightbox";
import GalleryDownloadDialog, { type GalleryDownloadTarget } from "../components/GalleryDownloadDialog";

export type Orientation = "portrait" | "landscape";

export type GalleryItem = {
  src: string;
  largeSrc: string;
  alt: string;
  event: string;
  location: string;
  eventKey: string;
  orientation: Orientation;
};

export type GalleryFilter = {
  key: string;
  label: string;
};

const LARGE_DIMS: Record<Orientation, { width: number; height: number }> = {
  portrait: { width: 1734, height: 2600 },
  landscape: { width: 2600, height: 1734 },
};

export default function GalleryGrid({
  items,
  filters,
}: {
  items: GalleryItem[];
  filters: GalleryFilter[];
}) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [downloadTarget, setDownloadTarget] = useState<GalleryDownloadTarget | null>(null);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  const activeFilterLabel = filters.find((f) => f.key === activeFilter)?.label ?? "All";

  useEffect(() => {
    if (!filterMenuOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(e.target as Node)) {
        setFilterMenuOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFilterMenuOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [filterMenuOpen]);

  const filteredItems = useMemo(
    () => (activeFilter === "all" ? items : items.filter((item) => item.eventKey === activeFilter)),
    [items, activeFilter],
  );

  const lightboxItems: LightboxItem[] = filteredItems.map((item) => ({
    src: item.largeSrc,
    alt: item.alt,
    ...LARGE_DIMS[item.orientation],
  }));

  return (
    <>
      {/* Filter dropdown (hidden when there's only one thing to show) */}
      {filters.length > 1 ? (
        <div className="mb-10">
          <div ref={filterMenuRef} className="relative inline-block">
            <button
              type="button"
              onClick={() => setFilterMenuOpen((o) => !o)}
              aria-haspopup="listbox"
              aria-expanded={filterMenuOpen}
              className="flex items-center gap-3 rounded-full border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] transition-colors"
              style={{ borderColor: EDITORIAL_RULE, color: EDITORIAL_INK, background: "transparent" }}
            >
              <span className="text-[10px] opacity-55">Showing</span>
              <span>{activeFilterLabel}</span>
              <ChevronDown
                className="h-4 w-4 transition-transform"
                style={{ transform: filterMenuOpen ? "rotate(180deg)" : "none", color: EDITORIAL_MUTED }}
                aria-hidden
              />
            </button>

            {filterMenuOpen ? (
              <div
                role="listbox"
                className="absolute left-0 top-full z-20 mt-2 min-w-[16rem] overflow-hidden rounded-2xl border shadow-[0_16px_40px_-16px_rgba(0,0,0,0.35)]"
                style={{ borderColor: EDITORIAL_RULE, background: EDITORIAL_BG }}
              >
                {filters.map((f) => {
                  const active = f.key === activeFilter;
                  return (
                    <button
                      key={f.key}
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => {
                        setActiveFilter(f.key);
                        setOpenIndex(null);
                        setFilterMenuOpen(false);
                      }}
                      className="flex w-full items-center justify-between gap-4 px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] transition-colors"
                      style={
                        active
                          ? { background: SURFACE_DARK, color: "#f1e9dc" }
                          : { background: "transparent", color: EDITORIAL_MUTED }
                      }
                    >
                      {f.label}
                      {active ? <span aria-hidden>✓</span> : null}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
          {activeFilter === "cannes-2026" ? (
            <p className="mt-3 text-xs" style={{ color: EDITORIAL_MUTED }}>
              Photography: Juan Woodbury (@djsd)
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {filteredItems.map((item, i) => (
          <Reveal
            as="figure"
            key={item.src}
            delay={(i % 3) * 90}
            y={28}
            className="mb-5 block break-inside-avoid overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={`Open ${item.alt} in full size`}
              className="group relative block w-full cursor-zoom-in overflow-hidden border-0 bg-transparent p-0 text-left"
              style={{ borderRadius: 16 }}
            >
              <BlurImage
                src={item.src}
                alt={item.alt}
                width={item.orientation === "portrait" ? 800 : 1200}
                height={item.orientation === "portrait" ? 1200 : 800}
                className="block w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                style={{ height: "auto" }}
                placeholder="blur"
                blurDataURL={blurForSrc(item.src)}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                unoptimized
              />
              {/* Caption overlay on hover */}
              <figcaption
                className="absolute inset-x-0 bottom-0 translate-y-full p-4 transition-transform duration-300 ease-out group-hover:translate-y-0"
                style={{ background: "rgba(28,26,23,0.88)" }}
              >
                <p className="m-0 text-xs font-semibold uppercase tracking-[0.15em] text-white">
                  {item.event}
                </p>
                <p className="m-0 text-xs text-white/60">{item.location}</p>
              </figcaption>
            </button>
          </Reveal>
        ))}
      </div>

      <Lightbox
        items={lightboxItems}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
        onDownloadRequest={(item) => setDownloadTarget({ src: item.src, alt: item.alt })}
      />

      <GalleryDownloadDialog target={downloadTarget} onClose={() => setDownloadTarget(null)} />
    </>
  );
}
