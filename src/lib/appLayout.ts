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