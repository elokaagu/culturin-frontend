"use client";

import { useEffect, useState, type ReactNode } from "react";

import { Marquee } from "@/components/ui/marquee";
import { appPageFullBleedClass } from "@/lib/appLayout";
import { cn } from "@/lib/utils";

const scrollRailClass =
  "flex gap-4 overflow-x-auto overscroll-x-contain pb-1 pt-0.5 [-webkit-overflow-scrolling:touch] [scrollbar-color:rgba(115,115,115,0.45)_transparent] [scrollbar-width:thin] dark:[scrollbar-color:rgba(255,255,255,0.22)_transparent] sm:gap-5 md:gap-6";

type MarqueeFadeRailProps = {
  children: ReactNode;
  /** Exposed on the outer wrapper for assistive tech. */
  ariaLabel: string;
  className?: string;
  /** Passed through to `Marquee` (e.g. duration, padding). */
  marqueeClassName?: string;
  pauseOnHover?: boolean;
  reverse?: boolean;
  /** Extend to viewport gutters (matches `TopVideosRail` full-bleed pattern). */
  fullBleed?: boolean;
};

/**
 * Infinite horizontal marquee with left/right fades into `background`.
 * Falls back to a normal horizontal scroller when `prefers-reduced-motion: reduce`.
 */
export default function MarqueeFadeRail({
  children,
  ariaLabel,
  className,
  marqueeClassName,
  pauseOnHover = true,
  reverse = false,
  fullBleed = false,
}: MarqueeFadeRailProps) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const fades = (
    <>
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-1/4 bg-gradient-to-r from-background to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-1/4 bg-gradient-to-l from-background to-transparent"
        aria-hidden
      />
    </>
  );

  const shell = cn(
    "relative w-full overflow-hidden",
    fullBleed && appPageFullBleedClass,
    className
  );

  if (reduceMotion) {
    return (
      <div className={shell} role="region" aria-label={ariaLabel}>
        <div
          className={cn(
            scrollRailClass,
            fullBleed && "scroll-pl-[var(--gutter-l)] pl-[var(--gutter-l)] pr-1 sm:pr-2"
          )}
        >
          {children}
        </div>
        {fades}
      </div>
    );
  }

  return (
    <div className={shell} role="region" aria-label={ariaLabel}>
      <Marquee
        pauseOnHover={pauseOnHover}
        reverse={reverse}
        className={cn(
          "p-0 [--gap:1rem] sm:[--gap:1.25rem] md:[--gap:1.5rem]",
          marqueeClassName
        )}
      >
        {children}
      </Marquee>
      {fades}
    </div>
  );
}
