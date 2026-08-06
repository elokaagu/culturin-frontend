"use client";

import type { ReactNode } from "react";

import type { StudioSortKey } from "@/app/studio/_lib/studioListShared";
import { STUDIO_SORT_OPTIONS } from "@/app/studio/_lib/studioListShared";
import {
  studioFieldInputClass,
  studioMutedClass,
  studioPanelClass,
} from "@/app/studio/_lib/studioTheme";
import { cn } from "@/lib/utils";

/** Primary “create” CTA used across Studio entity pages (matches Culturin copper + pill pattern). */
export const studioCreateButtonClass =
  "inline-flex min-h-11 items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--c-accent)_40%,transparent)] bg-[color:var(--c-ink)] px-6 py-2.5 text-sm font-semibold text-[color:var(--c-bg)] shadow-sm transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--c-accent)]";

/** Secondary cancel control beside expanded create forms. */
export const studioCancelButtonClass =
  "inline-flex h-8 items-center rounded-full border border-[color:var(--c-rule)] px-3 text-xs font-medium text-[color:var(--c-ink)] transition hover:border-[color:var(--c-accent)] hover:bg-[color:color-mix(in_srgb,var(--c-accent)_10%,transparent)]";

/** Panel wrapping an expanded “create” form. */
export const studioCreateFormShellClass = cn(
  studioPanelClass,
  "relative pt-4 ring-1 ring-[color:color-mix(in_srgb,var(--c-accent)_18%,transparent)]",
);

/** Muted label above search/sort (uppercase micro-label). */
const labelClass = `text-[0.7rem] font-medium uppercase tracking-[0.12em] ${studioMutedClass}`;

const inputClass = cn(studioFieldInputClass, "w-full");

/** Wrapper: inset copper bar on the left. */
const accentWrapClass =
  "rounded-xl border border-[color:var(--c-rule)] bg-[color:color-mix(in_srgb,var(--c-bg)_40%,white)] shadow-inner transition focus-within:border-[color:var(--c-accent)] focus-within:ring-2 focus-within:ring-[color:color-mix(in_srgb,var(--c-accent)_30%,transparent)] dark:bg-black/35 dark:shadow-[inset_3px_0_0_0_rgba(224,138,91,0.42)]";

type StudioCulturinListSectionProps = {
  title: string;
  countLabel: string;
  /** Search + sort row; omit when no items / no DB. */
  toolbar?: ReactNode;
  children: ReactNode;
};

/**
 * Editorial panel for Studio list views: Recoleta title, copper micro-labels.
 */
export function StudioCulturinListSection({ title, countLabel, toolbar, children }: StudioCulturinListSectionProps) {
  return (
    <section className={cn("mt-10", studioPanelClass)}>
      <div className="flex flex-wrap items-end justify-between gap-3 gap-y-2">
        <h2 className="m-0 font-display text-xl font-semibold tracking-tight text-[color:var(--c-ink)] sm:text-2xl">
          {title}
        </h2>
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--c-accent)]">
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
            className="w-full cursor-pointer appearance-none rounded-xl border-0 bg-transparent py-2.5 pl-3.5 pr-9 text-sm text-[color:var(--c-ink)] outline-none"
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

/** List row card — editorial panel. */
export const studioListRowClass =
  "rounded-xl border border-[color:var(--c-rule)] bg-[color:color-mix(in_srgb,var(--c-bg)_35%,white)] px-4 py-3.5 transition hover:border-[color:var(--c-accent)] dark:bg-white/[0.03]";

/** Inline text link button style for Edit links in lists. */
export const studioListEditLinkClass =
  "inline-flex h-8 shrink-0 items-center rounded-full border border-[color:var(--c-rule)] bg-[color:color-mix(in_srgb,var(--c-bg)_40%,white)] px-3 text-xs font-medium text-[color:var(--c-ink)] no-underline transition hover:border-[color:var(--c-accent)] hover:bg-[color:color-mix(in_srgb,var(--c-accent)_12%,transparent)] dark:bg-white/[0.04]";
