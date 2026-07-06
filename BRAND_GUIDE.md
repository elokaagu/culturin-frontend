# Culturin Brand Guide

Pulled directly from the live site's design tokens (`src/lib/theme/culturinTokens.ts`, `src/app/styles/globals.css`, `tailwind.config.js`, `src/app/layout.tsx`), so these are the exact values in production — safe to hand to an email designer or paste into an ESP template.

## Logo

| Variant | File | Use on |
|---|---|---|
| Wordmark, gold | `public/culturin_logo.svg` (`#FAC100`) | Dark backgrounds |
| Wordmark, dark ink | `public/culturin_logo_black.svg` (`#1c1a17`) | Light backgrounds |
| Icon mark, yellow | `public/culturin_icon_yellow.png` | Dark backgrounds |
| Icon mark, black | `public/culturin_icon_black.png` | Light backgrounds |

The wordmark is always set in the display serif (see Typography), all-caps, with a small "TM" superscript flush to the top-right of the type.

## Color Palette

### Core editorial palette (the site's actual light/dark theme)

| Token | Light mode | Dark mode | Used for |
|---|---|---|---|
| Background | `#e8e3da` (warm cream) | `#17130f` (near-black) | Page background |
| Ink (primary text) | `#1c1a17` | `#f1e9dc` (warm off-white) | Headlines, body text |
| Muted text | `#6b6456` | `#b9ab98` | Secondary copy, captions |
| Rule (borders/dividers) | `#cec7be` | `#3a332a` | Hairlines, card borders |
| Accent (CTA / links) | `#b5502e` (terracotta) | `#e08a5b` (light terracotta) | Buttons, links, highlights |

### Fixed "always-dark" surface

Used for sections meant to always read as dark regardless of site-wide light/dark toggle (e.g. footer) — good for an email's dark footer band or a dark hero:

- Surface: `#1c1a17`
- Text on surface: `#f1e9dc`
- Muted text on surface: `rgba(241, 233, 220, 0.65)`
- Accent on surface: `#e08a5b`

### Full terracotta accent scale

The site's one accent color, as a full 50–950 ramp (useful for hover/active states, tinted backgrounds, badges):

| Shade | Hex |
|---|---|
| 50 | `#fdf4ef` |
| 100 | `#fbe7dc` |
| 200 | `#f6cbb0` |
| 300 | `#f0ab85` |
| 400 | `#e08a5b` |
| 500 | `#cd6b3f` |
| 600 | `#b5502e` *(the light-mode accent)* |
| 700 | `#953f24` |
| 800 | `#7a341f` |
| 900 | `#642c1c` |
| 950 | `#36150c` |

**For email:** cream `#e8e3da` background with dark ink `#1c1a17` text is the primary light combo; terracotta `#b5502e` for buttons/links. Reserve the dark `#1c1a17`-surface treatment for a footer band or a single dark hero section, not the whole email — matches how the site itself uses it.

## Typography

- **Display / headlines:** Recoleta (serif). Loaded weights: Regular (400), Medium (500), SemiBold (600), Bold (700).
  - Email-safe fallback stack used by the site itself: `'Times New Roman', serif`
- **Body / UI text:** TWK Everett (sans-serif). Loaded weights: Light (300), Book/Regular (400), Medium (500), Bold (700).
  - Email-safe fallback stack used by the site itself: `ui-sans-serif, system-ui, -apple-system, sans-serif`

Neither font is web-safe, so most email clients will silently fall back — design emails assuming the fallback serif/sans-serif pairing above, not the custom fonts, unless you're embedding them as web fonts with a client that supports it (rare, unreliable for Recoleta especially).

**Voice cues from the UI:** headlines are set in serif sentence case (not all-caps); eyebrow labels/category tags/nav links are small, uppercase, letter-spaced (`tracking-[0.15em]` to `tracking-[0.3em]`) sans-serif — a good pattern for an email's preheader/section labels.

## Buttons / CTAs

- Shape: fully rounded pill (`border-radius: 9999px`)
- Label style: uppercase, semibold, letter-spaced (~`0.15em`–`0.18em`), small (11–13px)
- Primary button: terracotta background (`#b5502e` light / `#e08a5b` dark) with dark ink or cream text depending on contrast
- Secondary/outline button: 1px border in the Rule color, transparent background

## Quick reference for an email template

```
Background:      #e8e3da
Text:             #1c1a17
Muted/secondary:  #6b6456
Divider:          #cec7be
Button/link:      #b5502e
Button text:       #f1e9dc  (on terracotta, for contrast)
Footer band bg:   #1c1a17
Footer band text: #f1e9dc
Headline font:    Georgia / 'Times New Roman', serif
Body font:        -apple-system, Segoe UI, Helvetica, Arial, sans-serif
```
