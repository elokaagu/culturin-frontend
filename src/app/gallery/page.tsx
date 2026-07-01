import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { blurForSrc } from "@/lib/culturinImages";
import {
  EDITORIAL_BG,
  EDITORIAL_INK,
  EDITORIAL_MUTED,
  EDITORIAL_RULE,
  EDITORIAL_ACCENT,
  SURFACE_DARK,
  editorialScopeClass,
} from "@/lib/theme/culturinTokens";
import BlurImage from "../components/motion/BlurImage";
import Reveal from "../components/motion/Reveal";

export const metadata: Metadata = {
  title: "Gallery | Culturin",
  description: "Images from Culturin events — Cannes, New York, Lagos, and beyond.",
};

const BG = EDITORIAL_BG;
const INK = EDITORIAL_INK;
const INK_MUTED = EDITORIAL_MUTED;
const RULE = EDITORIAL_RULE;
const ACCENT = EDITORIAL_ACCENT;

const img = (file: string) => `/events/cannes-lions-2026/${file}`;

type Orientation = "portrait" | "landscape";

type GalleryItem = {
  src: string;
  alt: string;
  event: string;
  location: string;
  orientation: Orientation;
};

// Real photography from Culturin's Cannes Lions 2026 nights.
const GALLERY: GalleryItem[] = [
  { src: img("UNIKday1-2.jpg"), alt: "Guest in a tailored blazer against a deep red backdrop", event: "Opening Night", location: "Cannes", orientation: "portrait" },
  { src: img("UNIKday1-22.jpg"), alt: "Guests gathered on a couch with champagne", event: "The Room", location: "Cannes", orientation: "landscape" },
  { src: img("UNIKday1-58.jpg"), alt: "DJ performing under a disco ball in red light", event: "After Dark", location: "Cannes", orientation: "portrait" },
  { src: img("UNIKday1-38.jpg"), alt: "Four guests posing together at a Culturin evening", event: "The Room", location: "Cannes", orientation: "landscape" },
  { src: img("UNIKday1-26.jpg"), alt: "Disco balls above the crowd", event: "After Dark", location: "Cannes", orientation: "portrait" },
  { src: img("UNIKday1-62.jpg"), alt: "Red-lit crowd on the dancefloor", event: "After Dark", location: "Cannes", orientation: "landscape" },
  { src: img("UNIKday1-14.jpg"), alt: "Couple portrait against a red-lit backdrop", event: "Opening Night", location: "Cannes", orientation: "portrait" },
  { src: img("UNIKday1-54.jpg"), alt: "Candid dancing at a Culturin evening", event: "After Dark", location: "Cannes", orientation: "landscape" },
  { src: img("UNIKday1-34.jpg"), alt: "Two guests portrait at the party", event: "Opening Night", location: "Cannes", orientation: "portrait" },
  { src: img("UNIKday1-46.jpg"), alt: "Guests mingling in a warm-lit lounge", event: "The Room", location: "Cannes", orientation: "landscape" },
  { src: img("UNIKday2-4.jpg"), alt: "Guest in a yellow jersey lit by red smoke", event: "Night Two", location: "Cannes", orientation: "portrait" },
  { src: img("UNIKday2-22.jpg"), alt: "Couple posing at the branded wall", event: "Night Two", location: "Cannes", orientation: "portrait" },
  { src: img("UNIKday2-30.jpg"), alt: "Full dancefloor under disco balls late at night", event: "Night Two", location: "Cannes", orientation: "landscape" },
  { src: img("UNIKday2-12.jpg"), alt: "Group of guests at a Culturin gathering", event: "Night Two", location: "Cannes", orientation: "landscape" },
  { src: img("UNIKday2-34.jpg"), alt: "Two guests laughing together late at night", event: "Night Two", location: "Cannes", orientation: "portrait" },
  { src: img("UNIKday1-70.jpg"), alt: "Guests dancing under disco balls with phones raised", event: "After Dark", location: "Cannes", orientation: "landscape" },
];

export default function GalleryPage() {
  return (
    <div style={{ background: BG, color: INK }} className={`${editorialScopeClass} font-sans antialiased`}>

      {/* ── Top bar ──────────────────────────────────────────────── */}
      <header
        className="flex items-center justify-between border-b px-8 sm:px-14"
        style={{ height: 48, borderColor: RULE, background: BG }}
      >
        <Link
          href="/"
          className="flex items-center no-underline opacity-95 transition-opacity hover:opacity-100"
          aria-label="Culturin home"
        >
          <Image
            src="/culturin_logo.svg"
            alt="Culturin"
            width={84}
            height={18}
            className="h-4 w-auto max-w-[5.75rem]"
            unoptimized
          />
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/events"
            className="text-xs no-underline transition-opacity hover:opacity-60"
            style={{ color: INK_MUTED }}
          >
            Events
          </Link>
          <Link
            href="/"
            className="text-xs no-underline transition-opacity hover:opacity-60"
            style={{ color: INK_MUTED }}
          >
            ← Back
          </Link>
        </div>
      </header>

      {/* ── Page header ──────────────────────────────────────────── */}
      <div
        className="border-b px-8 sm:px-14"
        style={{ paddingTop: "5rem", paddingBottom: "5rem", borderColor: RULE }}
      >
        <p
          className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em]"
          style={{ color: INK_MUTED }}
        >
          From the field
        </p>
        <h1
          className="m-0 text-5xl font-medium leading-[1.08] sm:text-7xl"
          style={{ fontFamily: "var(--font-display), 'Times New Roman', serif", color: INK }}
        >
          Life inside the rooms.
        </h1>
        <p className="mt-6 max-w-lg text-base leading-relaxed" style={{ color: INK_MUTED }}>
          Two nights from Culturin at Cannes Lions 2026 — the guests, the music,
          and the late hours. Every photo is a room we built.
        </p>
      </div>

      {/* ── Masonry grid ─────────────────────────────────────────── */}
      <div className="px-8 py-16 sm:px-14">
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {GALLERY.map((item, i) => (
            <Reveal
              as="figure"
              key={item.src}
              delay={(i % 3) * 90}
              y={28}
              className="mb-5 block break-inside-avoid overflow-hidden"
            >
              <div className="group relative overflow-hidden" style={{ borderRadius: 2 }}>
                <BlurImage
                  src={item.src}
                  alt={item.alt}
                  width={item.orientation === "portrait" ? 800 : 1200}
                  height={item.orientation === "portrait" ? 1200 : 800}
                  className="block w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                  style={{ height: "auto" }}
                  placeholder="blur"
                  blurDataURL={blurForSrc(item.src)}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  unoptimized
                />
                {/* Caption overlay on hover */}
                <figcaption
                  className="absolute inset-x-0 bottom-0 translate-y-full p-4 transition-transform duration-300 ease-out group-hover:translate-y-0"
                  style={{ background: "rgba(28,26,23,0.88)" }}
                >
                  <p className="m-0 text-xs font-semibold uppercase tracking-[0.15em] text-white">
                    {item.event}
                  </p>
                  <p className="m-0 text-xs text-white/60">{item.location}</p>
                </figcaption>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ── CTA strip ────────────────────────────────────────────── */}
      <div
        className="border-t px-8 py-16 text-center sm:px-14"
        style={{ borderColor: RULE }}
      >
        <p
          className="mb-6 text-[10px] font-semibold uppercase tracking-[0.3em]"
          style={{ color: INK_MUTED }}
        >
          Want to be in the room?
        </p>
        <Link
          href="/events"
          className="inline-flex items-center gap-3 px-10 py-4 text-xs font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-85"
          style={{ background: ACCENT, color: SURFACE_DARK }}
        >
          View upcoming events →
        </Link>
      </div>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer
        className="flex items-center justify-between border-t px-8 py-6 sm:px-14"
        style={{ borderColor: RULE }}
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: INK_MUTED }}>
          Culturin
        </span>
        <span className="text-[11px]" style={{ color: INK_MUTED }}>
          © {new Date().getFullYear()}
        </span>
      </footer>
    </div>
  );
}
