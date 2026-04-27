"use client";

import { Link } from "next-view-transitions";
import {
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { Check } from "lucide-react";

import { NEARBY_RADIUS_KM, nearbySpots } from "../../lib/nearbySpotsData";
import { cmsImageUnoptimized, IMAGE_BLUR_DATA_URL, resolveContentImageSrc } from "../../lib/imagePlaceholder";
import SafeContentImage from "./SafeContentImage";

type NearByPanelProps = {
  open: boolean;
  onClose: () => void;
};

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden width={16} height={16}>
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Pills sit on the image with a bottom gradient; keep high contrast on both themes. */
const pillClass =
  "rounded-full border border-white/90 bg-black/35 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm backdrop-blur-sm sm:text-[11px]";

const moreBtnClass =
  "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/80 text-white/95 backdrop-blur-sm transition hover:bg-white/20";

/**
 * Header-attached "Nearby" dropdown: compact controls + horizontal place cards.
 */
export default function NearByPanel({ open, onClose }: NearByPanelProps) {
  const [radius, setRadius] = useState<number>(5);
  const [radiusOpen, setRadiusOpen] = useState(false);
  const titleId = useId();
  const listId = useId();
  const radiusListId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const radiusRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const onPointerDown = (event: PointerEvent) => {
      const node = event.target as Node;
      if (rootRef.current?.contains(node)) return;
      onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !radiusOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      const node = event.target as Node;
      if (radiusRef.current?.contains(node)) return;
      setRadiusOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [open, radiusOpen]);

  useEffect(() => {
    if (!open) setRadiusOpen(false);
  }, [open]);

  const filteredSpots = nearbySpots.filter((spot) => spot.distanceKm <= radius);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-x-0 bottom-0 top-[var(--header-total-height)] z-[1310] animate-in fade-in duration-300 ease-out"
        style={{ animationDuration: "280ms" }}
        aria-hidden
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity dark:bg-black/60" />
      </div>
      <div
        id="nearby-experience-panel"
        className="fixed inset-x-0 top-[var(--header-total-height)] z-[1320] pl-[max(0.5rem,env(safe-area-inset-left,0px))] pr-[max(0.5rem,env(safe-area-inset-right,0px))] pt-2 sm:pl-4 sm:pr-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div
          ref={rootRef}
          className="mx-auto w-full max-w-[1760px] animate-in fade-in slide-in-from-top-3 zoom-in-95 rounded-xl border border-neutral-200/90 bg-white/95 text-neutral-900 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.12)] backdrop-blur duration-300 ease-out fill-mode-both dark:border-white/10 dark:bg-black/95 dark:text-white dark:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.85)]"
          style={{ animationDuration: "360ms", animationDelay: "40ms" }}
        >
        <div className="grid min-h-12 shrink-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 border-b border-neutral-200/90 px-3 pt-2 dark:border-white/10 sm:px-5">
          <h2
            id={titleId}
            className="m-0 w-max min-w-0 pl-0.5 text-sm font-medium tracking-tight text-neutral-900 dark:text-white sm:text-base"
          >
            Nearby
          </h2>

          <div className="flex min-w-0 justify-center px-1 text-xs text-neutral-800 dark:text-white/95 sm:px-2 sm:text-sm">
            <label
              className="flex min-w-0 max-w-full flex-wrap items-baseline justify-center gap-x-0.5"
              htmlFor="nearby-radius"
            >
              <span className="hidden pr-0.5 sm:inline">Spots </span>
              <span className="whitespace-nowrap">within</span>{" "}
              <span ref={radiusRef} className="relative inline-flex shrink-0 items-center">
                <button
                  id="nearby-radius"
                  type="button"
                  role="combobox"
                  aria-expanded={radiusOpen}
                  aria-controls={radiusListId}
                  aria-haspopup="listbox"
                  onClick={() => setRadiusOpen((v) => !v)}
                  className="inline-flex min-w-[2.5rem] items-center justify-center gap-1 rounded-full border border-neutral-300 bg-neutral-100 px-2 py-0.5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500/60 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/15 dark:focus-visible:outline-white/80"
                >
                  <span>{radius}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-neutral-600 dark:text-white/85" />
                </button>
                {radiusOpen ? (
                  <ul
                    id={radiusListId}
                    role="listbox"
                    className="absolute left-1/2 top-[calc(100%+0.35rem)] z-[1330] min-w-[4.5rem] -translate-x-1/2 overflow-hidden rounded-2xl border border-neutral-200/90 bg-white/95 p-1 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.35)] backdrop-blur dark:border-white/10 dark:bg-neutral-950/95"
                  >
                    {NEARBY_RADIUS_KM.map((km) => (
                      <li key={km} role="presentation">
                        <button
                          type="button"
                          role="option"
                          aria-selected={km === radius}
                          onClick={() => {
                            setRadius(km);
                            setRadiusOpen(false);
                          }}
                          className="flex w-full items-center justify-between rounded-xl px-2 py-1.5 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-100 dark:text-white/90 dark:hover:bg-white/10"
                        >
                          <span>{km}</span>
                          <Check className={km === radius ? "h-3.5 w-3.5 text-amber-500" : "h-3.5 w-3.5 opacity-0"} />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </span>
              <span className="pl-0.5 font-medium text-neutral-500 dark:text-white/80"> km</span>
            </label>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center justify-self-end rounded-full text-neutral-600 transition hover:bg-neutral-200/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500/60 dark:text-white dark:hover:bg-white/10 dark:focus-visible:outline-white/80"
            aria-label="Close nearby"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="mt-1 min-h-0 sm:pt-0">
          <p id={listId} className="sr-only">
            Spots around you within {radius} kilometres, scroll horizontally.
          </p>
          <div
            className="flex w-full min-h-0 gap-3 overflow-x-auto overflow-y-hidden scroll-smooth px-3 py-2 pb-4 [scrollbar-color:rgba(0,0,0,0.25)_transparent] [scrollbar-width:thin] sm:gap-4 sm:px-5 sm:pb-5 dark:[scrollbar-color:rgba(255,255,255,0.25)_transparent]"
            style={{ WebkitOverflowScrolling: "touch" }}
            aria-describedby={listId}
          >
            {filteredSpots.map((spot, index) => {
              const imageSrc = resolveContentImageSrc(spot.imageUrl);
              return (
              <Link
                key={spot.title + spot.href}
                href={spot.href}
                className="group flex w-[min(11rem,42vw)] shrink-0 flex-col animate-in fade-in slide-in-from-bottom-2 fill-mode-both sm:w-[11.6rem]"
                style={{ animationDuration: "420ms", animationDelay: `${120 + index * 55}ms` }}
                onClick={onClose}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-neutral-200/90 bg-neutral-100/50 dark:border-white/10 dark:bg-white/5">
                  <SafeContentImage
                    src={imageSrc}
                    alt={spot.imageAlt}
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 42vw, 11.6rem"
                    blurDataURL={IMAGE_BLUR_DATA_URL}
                    unoptimized={cmsImageUnoptimized(imageSrc)}
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent"
                    aria-hidden
                  />
                  <div className="absolute bottom-2.5 left-2 right-2 flex flex-wrap items-center gap-1">
                    <span className={pillClass}>{spot.city}</span>
                    <span className={pillClass}>{spot.category}</span>
                    <span className={pillClass}>{`${spot.distanceKm.toFixed(1)} km`}</span>
                    {spot.showMore ? (
                      <span
                        className={moreBtnClass}
                        aria-label={`More about ${spot.title}`}
                      >
                        <span className="text-sm leading-none text-white" aria-hidden>
                          …
                        </span>
                      </span>
                    ) : null}
                  </div>
                </div>
                <p className="m-0 mt-2 min-h-[2.2rem] text-left text-[0.98rem] font-medium leading-tight text-neutral-900 dark:text-white">
                  {spot.title}
                </p>
              </Link>
              );
            })}
            {filteredSpots.length === 0 ? (
              <div className="flex min-h-[8rem] w-full min-w-[15rem] items-center justify-center rounded-xl border border-dashed border-neutral-300 px-4 text-center text-sm text-neutral-600 dark:border-white/15 dark:text-white/70">
                No spots found within {radius} km yet. Try increasing the distance.
              </div>
            ) : null}
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
