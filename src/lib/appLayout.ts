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
