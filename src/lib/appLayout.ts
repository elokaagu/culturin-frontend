/**
 * Must stay in sync with the inner bar in `Header.tsx`:
 * `mx-auto … max-w-[1720px] … px-3 sm:px-5 md:px-8`
 * Use for page shells so content lines up with the logo and nav.
 */
export const appPageMaxWidthClass = "max-w-[1720px]";
export const appPageGutterXClass = "px-3 sm:px-5 md:px-8";
export const appPageContainerClass = `mx-auto w-full ${appPageMaxWidthClass} ${appPageGutterXClass}`;

/**
 * Place inside a padded `appPageContainerClass` to extend a horizontal rail to the viewport.
 * (Negative margin + width = twice the current horizontal padding.)
 */
export const appPageFullBleedClass =
  "relative -mx-3 w-[calc(100%+1.5rem)] min-w-0 sm:-mx-5 sm:w-[calc(100%+2.5rem)] md:-mx-8 md:w-[calc(100%+4rem)]";

export const appPageRailScrollPadClass = "scroll-pl-3 pl-3 pr-1 sm:pl-5 sm:pr-2 md:pl-8";

/**
 * "See all" CTA in home section headers — must not shrink in flex row or the label can clip.
 * Use with `header` that is `flex items-start justify-between gap-4`.
 */
export const homeSectionSeeAllClass =
  "shrink-0 self-center inline-flex min-h-[38px] min-w-[4.5rem] items-center justify-center rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-neutral-900 no-underline transition-colors hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 dark:border-white/20 dark:bg-white/[0.08] dark:text-white dark:hover:bg-white/[0.14]";
