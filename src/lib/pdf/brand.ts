import "server-only";

import path from "node:path";

import { Font } from "@react-pdf/renderer";

/** Brand fonts and logos for server-rendered PDFs. Files are read from disk, so routes using this need them in `outputFileTracingIncludes`. */
const FONTS = path.join(process.cwd(), "src/app/styles/fonts");

export const LOGO_WHITE = path.join(process.cwd(), "public/culturin_logotype_white.png");
export const LOGO_BLACK = path.join(process.cwd(), "public/culturin_logotype_black.png");

let registered = false;

export function registerBrandFonts() {
  if (registered) return;
  registered = true;
  Font.register({
    family: "NewSpirit",
    fonts: [
      { src: path.join(FONTS, "NewSpirit-Regular-Condensed.otf"), fontWeight: 400 },
      { src: path.join(FONTS, "NewSpirit-SemiBold-Condensed.otf"), fontWeight: 600 },
    ],
  });
  Font.register({
    family: "Maison",
    fonts: [
      { src: path.join(FONTS, "MaisonNeue-Book.otf"), fontWeight: 400 },
      { src: path.join(FONTS, "MaisonNeue-Medium.otf"), fontWeight: 500 },
      { src: path.join(FONTS, "MaisonNeue-Demi.otf"), fontWeight: 600 },
    ],
  });
  // Never hyphenate, but let long unbroken strings (email addresses, URLs) wrap inside table cells.
  Font.registerHyphenationCallback((word) => (word.length > 20 ? word.match(/.{1,16}/g) ?? [word] : [word]));
}

export const PDF_COLORS = {
  bg: "#f6f1ea",
  card: "#fffdf9",
  ink: "#1c1a17",
  muted: "#6f675d",
  rule: "#e4dccf",
  accent: "#cd6b3f",
  head: "#0e0b08",
  dark: "#1c1a17",
  onDark: "#f1e9dc",
  onDarkMuted: "#b9ab98",
  accentOnDark: "#e08a5b",
  warn: "#c2413b",
} as const;
