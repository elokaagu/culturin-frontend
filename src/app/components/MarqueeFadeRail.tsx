"use client";

import type { ReactNode } from "react";

import { appPageFullBleedClass } from "@/lib/appLayout";
import { cn } from "@/lib/utils";

const scrollRailClass =
  "flex gap-4 overflow-x-auto overscroll-x-contain pb-1 pt-0.5 [-webkit-overflow-scrolling:touch] [scrollbar-color:rgba(115,115,115,0.45)_transparent] [scrollbar-width:thin] dark:[scrollbar-color:rgba(255,255,255,0.22)_transparent] sm:gap-5 md:gap-6";

type MarqueeFadeRailProps = {
  children: ReactNode;
  /** Exposed on the outer wrapper for assistive tech. */
  ariaLabel: string;
  className?: string;
  /** Extra classes on the horizontal scroll row (padding, gutters, gap tweaks). */
  marqueeClassName?: string;
  /** Extend to viewport gutters (matches `TopVideosRail` full-bleed pattern). */
  fullBleed?: boolean;
  /** Set on the scroll row when children use `role="listitem"` (e.g. country cards). */
  scrollRowRole?: React.AriaRole;
};

/**
 * Horizontal rail with left/right edge fades. Scroll is manual only (no auto-scroll).
 */
export default function MarqueeFadeRail({
  children,
  ariaLabel,
  className,
  marqueeClassName,
  fullBleed = false,
  scrollRowRole,
}: MarqueeFadeRailProps) {
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

  return (
    <div className={shell} role="region" aria-label={ariaLabel}>
      <div
        role={scrollRowRole}
        className={cn(
          scrollRailClass,
          fullBleed && "scroll-pl-[var(--gutter-l)] pl-[var(--gutter-l)] pr-1 sm:pr-2",
          marqueeClassName
        )}
      >
        {children}
      </div>
      {fades}
    </div>
  );
}
