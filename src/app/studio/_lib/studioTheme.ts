/**
 * Shared Studio surfaces — warm cream/ink editorial tokens from the public site
 * (`.culturin-editorial` / `--c-*` in globals.css).
 */

/** Card / list panel sitting on the Studio canvas. */
export const studioPanelClass =
  "rounded-2xl border border-[color:var(--c-rule)] bg-[color:color-mix(in_srgb,var(--c-bg)_55%,white)] p-5 shadow-sm sm:p-6 dark:bg-[#1c1a17]/90 dark:shadow-[inset_0_1px_0_0_rgba(241,233,220,0.05)]";

/** Compact overview / metric card (no default padding override). */
export const studioCardClass =
  "rounded-2xl border border-[color:var(--c-rule)] bg-[color:color-mix(in_srgb,var(--c-bg)_55%,white)] shadow-sm transition hover:border-[color:var(--c-accent)] dark:bg-[#1c1a17]/90 dark:shadow-[inset_0_1px_0_0_rgba(241,233,220,0.05)]";

/** Uppercase micro-label (section eyebrows, table headers). */
export const studioEyebrowClass =
  "text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--c-accent)]";

export const studioMutedClass = "text-[color:var(--c-muted)]";

export const studioInkClass = "text-[color:var(--c-ink)]";

/** Standard text/select input. */
export const studioFieldInputClass =
  "rounded-xl border border-[color:var(--c-rule)] bg-[color:color-mix(in_srgb,var(--c-bg)_40%,white)] px-3.5 py-2.5 text-sm text-[color:var(--c-ink)] shadow-inner outline-none transition placeholder:text-[color:var(--c-muted)] focus-visible:border-[color:var(--c-accent)] focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_srgb,var(--c-accent)_35%,transparent)] dark:bg-black/35";

/** Secondary outline control (theme toggle, cancel, view site). */
export const studioGhostButtonClass =
  "inline-flex items-center justify-center rounded-full border border-[color:var(--c-rule)] bg-[color:color-mix(in_srgb,var(--c-bg)_40%,white)] text-[color:var(--c-ink)] transition hover:border-[color:var(--c-accent)] hover:bg-[color:color-mix(in_srgb,var(--c-accent)_12%,transparent)] dark:bg-white/[0.04]";

/** Native checkbox — copper checked/focus instead of browser blue. */
export const studioCheckboxClass =
  "mt-1 h-4 w-4 shrink-0 cursor-pointer appearance-auto rounded-[3px] border border-[color:var(--c-rule)] accent-culturin-500 outline-none transition checked:accent-culturin-500 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-culturin-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--c-bg)] dark:accent-culturin-400 dark:checked:accent-culturin-400 dark:focus-visible:ring-culturin-400";
