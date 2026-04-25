"use client";

import Image from "next/image";
import { Link } from "next-view-transitions";
import {
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { NEARBY_RADIUS_KM, nearbySpots } from "../../lib/nearbySpotsData";
import { IMAGE_BLUR_DATA_URL } from "../../lib/imagePlaceholder";

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

const pillClass =
  "rounded-full border border-white/90 bg-black/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm backdrop-blur-sm sm:text-[11px]";

const moreBtnClass =
  "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/80 text-white/95 backdrop-blur-sm transition hover:bg-white/10";

/**
 * Header-attached "Nearby" dropdown: compact controls + horizontal place cards.
 */
export default function NearByPanel({ open, onClose }: NearByPanelProps) {
  const [radius, setRadius] = useState<number>(5);
  const titleId = useId();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

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

  if (!open) return null;

  return (
    <div
      id="nearby-experience-panel"
      className="fixed inset-x-0 top-[var(--header-bar-height)] z-[1320] px-2 pt-2 sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div ref={rootRef} className="mx-auto w-full max-w-[1760px] rounded-xl border border-white/10 bg-black/95 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.85)] backdrop-blur">
        <div className="grid min-h-12 shrink-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-3 pt-2 sm:px-5">
          <h2
            id={titleId}
            className="m-0 w-max min-w-0 pl-0.5 text-sm font-medium tracking-tight text-white sm:text-base"
          >
            Nearby
          </h2>

          <div className="flex min-w-0 justify-center px-1 text-xs text-white/95 sm:px-2 sm:text-sm">
            <label
              className="flex min-w-0 max-w-full flex-wrap items-baseline justify-center gap-x-0.5"
              htmlFor="nearby-radius"
            >
              <span className="hidden pr-0.5 sm:inline">Spots </span>
              <span className="whitespace-nowrap">within</span>{" "}
              <span className="relative inline-flex shrink-0 items-center">
                <select
                  id="nearby-radius"
                  className="max-w-[3.5rem] cursor-pointer appearance-none border-0 border-b border-white/50 bg-transparent py-0.5 pl-0.5 pr-4 text-sm font-semibold text-white outline-none focus:ring-0 sm:max-w-[4rem] sm:pr-5"
                  value={String(radius)}
                  onChange={(e) => setRadius(Number(e.target.value))}
                >
                  {NEARBY_RADIUS_KM.map((km) => (
                    <option key={km} value={String(km)} className="text-black">
                      {km}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2">
                  <ChevronDown className="h-3.5 w-3.5 text-white" />
                </span>
              </span>
              <span className="pl-0.5 font-medium text-white/80"> km</span>
            </label>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center justify-self-end rounded-full text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
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
            className="flex w-full min-h-0 gap-3 overflow-x-auto overflow-y-hidden scroll-smooth px-3 py-2 pb-4 [scrollbar-color:rgba(255,255,255,0.25)_transparent] [scrollbar-width:thin] sm:gap-4 sm:px-5 sm:pb-5"
            style={{ WebkitOverflowScrolling: "touch" }}
            aria-describedby={listId}
          >
            {nearbySpots.map((spot) => (
              <Link
                key={spot.title + spot.href}
                href={spot.href}
                className="group flex w-[min(11rem,42vw)] shrink-0 flex-col sm:w-[11.6rem]"
                onClick={onClose}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 bg-white/5">
                  <Image
                    src={spot.imageUrl}
                    alt=""
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 42vw, 11.6rem"
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR_DATA_URL}
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent"
                    aria-hidden
                  />
                  <div className="absolute bottom-2.5 left-2 right-2 flex flex-wrap items-center gap-1">
                    <span className={pillClass}>{spot.city}</span>
                    <span className={pillClass}>{spot.category}</span>
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
                <p className="m-0 mt-2 min-h-[2.2rem] text-left text-[0.98rem] font-medium leading-tight text-white">
                  {spot.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
