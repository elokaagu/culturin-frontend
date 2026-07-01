/**
 * Shared color tokens for the "editorial" marketing surface (home, events,
 * gallery). Values are CSS custom properties so they respond live to the
 * app's existing light/dark toggle (`.dark` on <html>) — see the
 * `.culturin-editorial` scope defined in globals.css for the actual light
 * and dark values.
 *
 * SURFACE_DARK is intentionally a literal, non-reactive hex: sections like
 * the Partners band and the footer are meant to always read as "the room
 * at night," in both light and dark site-wide mode.
 */
export const EDITORIAL_BG = "var(--c-bg)";
export const EDITORIAL_INK = "var(--c-ink)";
export const EDITORIAL_MUTED = "var(--c-muted)";
export const EDITORIAL_RULE = "var(--c-rule)";
export const EDITORIAL_ACCENT = "var(--c-accent)";

/** Fixed dark surface for always-nocturnal accent sections (Partners, footer). */
export const SURFACE_DARK = "#1c1a17";
/** Warm off-white used for text sitting on SURFACE_DARK. */
export const ON_DARK_TEXT = "#f1e9dc";
/** Muted warm text on SURFACE_DARK. */
export const ON_DARK_MUTED = "rgba(241,233,220,0.65)";
/**
 * Fixed (non-theme-reactive) terracotta for use on SURFACE_DARK sections —
 * same value as the dark-mode `--c-accent`, since those sections never
 * change brightness with the site-wide toggle.
 */
export const ACCENT_ON_DARK = "#e08a5b";

/** className that scopes the CSS variables above to light/dark values. */
export const editorialScopeClass = "culturin-editorial";
