"use client";

import type { ReactNode } from "react";

import type { StudioSortKey } from "@/app/studio/_lib/studioListShared";
import { STUDIO_SORT_OPTIONS } from "@/app/studio/_lib/studioListShared";
import { cn } from "@/lib/utils";

/** Primary “create” CTA used across Studio entity pages (matches Culturin gold + pill pattern). */
export const studioCreateButtonClass =
  "inline-flex min-h-11 items-center justify-center rounded-full border border-amber-700/25 bg-white px-6 py-2.5 text-sm font-semibold text-neutral-900 shadow-sm transition hover:border-amber-600/40 hover:bg-amber-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500/80 dark:border-amber-400/40 dark:bg-white dark:text-black dark:hover:bg-amber-100 dark:hover:text-black";

/** Secondary cancel control beside expanded create forms. */
export const studioCancelButtonClass =
  "inline-flex h-8 items-center rounded-full border border-neutral-300 px-3 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-white/20 dark:text-white/85 dark:hover:bg-white/10";

/** Panel wrapping an expanded “create” form. */
export const studioCreateFormShellClass =
  "relative rounded-2xl border border-neutral-200 bg-neutral-50/90 p-5 pt-4 dark:border-white/12 dark:bg-black/40 dark:ring-1 dark:ring-amber-400/15";

/** Muted label above search/sort (uppercase micro-label). */
const labelClass =
  "text-[0.7rem] font-medium uppercase tracking-[0.12em] text-neutral-500 dark:text-white/45";

const inputClass =
  "w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 shadow-inner shadow-neutral-900/5 outline-none transition placeholder:text-neutral-400 focus-visible:border-amber-500/60 focus-visible:ring-2 focus-visible:ring-amber-400/25 dark:border-white/12 dark:bg-black/60 dark:text-white dark:shadow-black/40 dark:placeholder:text-white/35 dark:focus-visible:border-amber-400/55 dark:focus-visible:ring-amber-400/20";

/** Wrapper: inset amber bar on the left in dark mode (Culturin accent). */
const accentWrapClass =
  "rounded-xl border border-neutral-300 bg-white shadow-inner shadow-neutral-900/5 transition focus-within:border-amber-500/55 focus-within:ring-2 focus-within:ring-amber-400/20 dark:border-white/12 dark:bg-black/60 dark:shadow-[inset_3px_0_0_0_rgba(251,191,36,0.42)] dark:shadow-black/40 dark:focus-within:border-amber-400/45 dark:focus-within:ring-amber-400/15";

type StudioCulturinListSectionProps = {
  title: string;
  countLabel: string;
  /** Search + sort row; omit when no items / no DB. */
  toolbar?: ReactNode;
  children: ReactNode;
};

/**
 * Dark “Culturin” panel for Studio list views: serif title, amber micro-labels, black inputs on dark.
 */
export function StudioCulturinListSection({ title, countLabel, toolbar, children }: StudioCulturinListSectionProps) {
  return (
    <section
      className={cn(
        "mt-10 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6",
        "dark:border-white/10 dark:bg-black dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]",
      )}
    >
      <div className="flex flex-wrap items-end justify-between gap-3 gap-y-2">
        <h2 className="m-0 font-display text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl dark:text-white">
          {title}
        </h2>
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-amber-800 dark:text-amber-300/90">
          {countLabel}
        </span>
      </div>
      {toolbar ? <div className="mt-5">{toolbar}</div> : null}
      <div className={toolbar ? "mt-6" : "mt-5"}>{children}</div>
    </section>
  );
}

type StudioCulturinSearchSortRowProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  sortValue: StudioSortKey;
  onSortChange: (value: StudioSortKey) => void;
};

export function StudioCulturinSearchSortRow({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  sortValue,
  onSortChange,
}: StudioCulturinSearchSortRowProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <label className="flex min-w-0 flex-1 flex-col gap-2 sm:max-w-xl">
        <span className={labelClass}>Search</span>
        <input
          type="search"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          autoComplete="off"
          className={inputClass}
        />
      </label>
      <label className="flex w-full flex-col gap-2 sm:w-52 md:w-56">
        <span className={labelClass}>Sort</span>
        <div className={accentWrapClass}>
          <select
            value={sortValue}
            onChange={(e) => onSortChange(e.target.value as StudioSortKey)}
            className="w-full cursor-pointer appearance-none rounded-xl border-0 bg-transparent py-2.5 pl-3.5 pr-9 text-sm text-neutral-900 outline-none dark:text-white"
          >
            {STUDIO_SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </label>
    </div>
  );
}

/** List row card — Culturin rail / editorial panel. */
export const studioListRowClass =
  "rounded-xl border border-neutral-200 bg-white px-4 py-3.5 transition dark:border-white/12 dark:bg-white/[0.04] dark:hover:border-amber-400/25";

/** Inline text link button style for Edit links in lists. */
export const studioListEditLinkClass =
  "inline-flex h-8 shrink-0 items-center rounded-full border border-neutral-300 bg-white px-3 text-xs font-medium text-neutral-800 no-underline transition hover:border-amber-500/35 hover:bg-amber-50 dark:border-white/18 dark:bg-white/[0.06] dark:text-white dark:hover:border-amber-400/40 dark:hover:bg-white/10";
