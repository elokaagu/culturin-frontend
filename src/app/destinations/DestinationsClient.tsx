"use client";

import Image from "next/image";
import { Link } from "next-view-transitions";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import {
  destinations,
  destinationLetters,
  getDestinationBySlug,
  groupDestinationsByLetter,
} from "../../lib/destinationsData";
import { getDestinationContent } from "../../lib/destinationContent";
import { IMAGE_BLUR_DATA_URL } from "../../lib/imagePlaceholder";

const nameRowClass = (isActive: boolean) =>
  [
    "block w-full py-1.5 text-left text-2xl font-light tracking-tight no-underline transition-colors sm:py-2 sm:text-3xl md:text-4xl",
    isActive
      ? "text-white"
      : "text-white/45 hover:text-white/75",
  ].join(" ");

const stickyTop = "top-[calc(var(--header-offset)+0.5rem)]";

function DestinationPreviewImage({
  destination,
  className = "",
}: {
  destination: (typeof destinations)[0];
  className?: string;
}) {
  const content = getDestinationContent(destination.slug);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
  }, [destination.slug, destination.imageUrl]);

  return (
    <div
      className={`relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl bg-neutral-900 sm:max-w-md ${className}`}
    >
      <Image
        src={destination.imageUrl}
        alt={destination.imageAlt}
        fill
        className={cn(
          "object-cover transition-[opacity,filter] duration-500 ease-out will-change-[opacity,filter] motion-reduce:transition-none",
          ready ? "opacity-100 [filter:blur(0px)]" : "opacity-0 [filter:blur(6px)]",
          "motion-reduce:opacity-100 motion-reduce:[filter:blur(0px)]",
        )}
        sizes="(max-width: 1024px) 100vw, 32rem"
        loading="lazy"
        placeholder="blur"
        blurDataURL={IMAGE_BLUR_DATA_URL}
        onLoadingComplete={() => setReady(true)}
      />
      {destination.country ? (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-4 py-3">
          <p className="m-0 text-sm font-medium text-white">{destination.country}</p>
          {content?.vibe ? <p className="m-0 mt-1 text-xs text-white/75">{content.vibe}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

export default function DestinationsClient() {
  const byLetter = useMemo(() => groupDestinationsByLetter(destinations), []);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const sectionRefs = useRef<Partial<Record<string, HTMLElement | null>>>({});
  const [announce, setAnnounce] = useState("");

  const preview = useMemo(() => {
    if (!hoveredSlug) return destinations[0];
    return getDestinationBySlug(hoveredSlug) ?? destinations[0];
  }, [hoveredSlug]);

  const onHighlight = useCallback(
    (slug: string) => {
      setHoveredSlug(slug);
      const d = getDestinationBySlug(slug);
      if (d) setAnnounce(`Preview: ${d.name}${d.country ? `, ${d.country}` : ""}`);
    },
    [setAnnounce],
  );

  const clearHighlight = useCallback(() => {
    setHoveredSlug(null);
    setAnnounce("Showing default preview");
  }, []);

  return (
    <div
      className="flex w-full min-w-0 flex-col gap-8 lg:min-h-[70vh] lg:flex-row lg:gap-10"
      onMouseLeave={clearHighlight}
    >
      <p className="sr-only" role="status" aria-live="polite">
        {announce}
      </p>

      {/* A–Z jump: horizontal on small screens, sticky vertical on lg */}
      <nav
        className={`-mx-1 order-1 flex w-full flex-row flex-wrap content-start items-center gap-0.5 overflow-x-auto py-1 sm:-mx-0 sm:flex-wrap sm:content-start sm:gap-0.5 ${stickyTop} max-h-[4.5rem] shrink-0 sm:max-h-none lg:sticky lg:max-h-[min(100vh-8rem,40rem)] lg:w-10 lg:flex-col lg:items-stretch lg:overflow-y-auto lg:overflow-x-hidden lg:py-2 lg:pr-1`}
        aria-label="Jump to letter"
      >
        {destinationLetters.map((L) => (
          <button
            key={L}
            type="button"
            onClick={() =>
              sectionRefs.current[L]?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="min-w-[1.5rem] shrink-0 rounded px-1.5 py-0.5 text-center text-xs font-medium uppercase tracking-wider text-white/45 transition hover:text-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 lg:min-w-0 lg:px-0.5 lg:py-0.5 lg:text-left"
          >
            {L}
          </button>
        ))}
      </nav>

      {/* List */}
      <div className="order-3 min-w-0 flex-1 lg:order-2">
        {destinationLetters.map((L) => {
          const items = byLetter.get(L);
          if (!items?.length) return null;
          return (
            <div
              key={L}
              id={`dest-letter-${L}`}
              className="mb-12 scroll-mt-28"
              ref={(el) => {
                sectionRefs.current[L] = el;
              }}
            >
              <h2 className="m-0 mb-4 text-5xl font-extralight text-white/25 sm:text-6xl">
                {L}
              </h2>
              <ul className="m-0 list-none p-0" role="list">
                {items.map((d) => {
                  const isActive = hoveredSlug === d.slug;
                  return (
                    <li key={d.slug}>
                      <Link
                        href={`/destinations/${d.slug}`}
                        className={nameRowClass(isActive)}
                        onMouseEnter={() => onHighlight(d.slug)}
                        onFocus={() => onHighlight(d.slug)}
                        onTouchStart={() => onHighlight(d.slug)}
                      >
                        {d.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Preview: sticky on desktop, top on small screens */}
      <aside
        className={`order-2 w-full shrink-0 lg:order-3 lg:w-[min(40%,24rem)] lg:max-w-none ${stickyTop} lg:sticky lg:self-start`}
        aria-label="Destination preview"
      >
        {preview && (
          <div className="lg:pt-2">
            <DestinationPreviewImage
              key={preview.slug}
              destination={preview}
            />
            <p className="mt-2 text-sm text-white/55">
              {hoveredSlug
                ? `View ${preview.name} details`
                : "Hover a destination to preview it, then open the full guide"}
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
