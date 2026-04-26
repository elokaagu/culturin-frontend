/**
 * Must stay in sync with the inner bar in `Header.tsx` and `globals.css` (`--gutter-l` / `--gutter-r`).
 * Gutter max() keeps content clear of notches in landscape. Use for page shells with the logo and nav.
 */
export const appPageMaxWidthClass = "max-w-[1720px]";
export const appPageGutterXClass = "pl-[var(--gutter-l)] pr-[var(--gutter-r)]";
export const appPageContainerClass = `mx-auto w-full min-w-0 ${appPageMaxWidthClass} ${appPageGutterXClass}`;

/**
 * Place inside a padded `appPageContainerClass` to extend a horizontal rail to the viewport.
 * (Negative margin + width = current horizontal padding from CSS variables.)
 */
export const appPageFullBleedClass =
  "relative -ml-[var(--gutter-l)] -mr-[var(--gutter-r)] w-[calc(100%_+_var(--gutter-l)_+_var(--gutter-r))] min-w-0";

export const appPageRailScrollPadClass =
  "scroll-pl-[var(--gutter-l)] pl-[var(--gutter-l)] pr-1 sm:pr-2";

/**
 * "See all" CTA in home section headers — must not shrink in flex row or the label can clip.
 * Use with `header` that is `flex items-start justify-between gap-4`.
 */
export const homeSectionSeeAllClass =
  "shrink-0 self-center inline-flex min-h-[38px] min-w-[4.5rem] items-center justify-center rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-neutral-900 no-underline transition-colors hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 dark:border-white/20 dark:bg-white/[0.08] dark:text-white dark:hover:bg-white/[0.14]";
