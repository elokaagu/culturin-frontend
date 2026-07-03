import type { Metadata } from "next";
import Link from "next/link";

import {
  EDITORIAL_BG,
  EDITORIAL_INK,
  EDITORIAL_MUTED,
  EDITORIAL_RULE,
  EDITORIAL_ACCENT,
  SURFACE_DARK,
  editorialScopeClass,
} from "@/lib/theme/culturinTokens";
import { listGalleryImagesPublic } from "@/lib/cms/queries";
import { getCmsDbOrNull } from "@/lib/cms/server";
import GalleryGrid, { type GalleryFilter, type GalleryItem } from "./GalleryGrid";
import IslandNav from "../components/IslandNav";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery | Culturin",
  description: "Images from Culturin events, Cannes, New York, London, and beyond.",
};

const BG = EDITORIAL_BG;
const INK = EDITORIAL_INK;
const INK_MUTED = EDITORIAL_MUTED;
const RULE = EDITORIAL_RULE;
const ACCENT = EDITORIAL_ACCENT;

const asset = (folder: string, file: string) => `/events/${folder}/${file}`;
const assetLarge = (folder: string, file: string) => `/events/${folder}/large/${file}`;

/**
 * Static fallback shown only if the gallery_images table isn't reachable yet
 * (e.g. the 030_gallery_images.sql migration hasn't been run). Mirrors that
 * migration's seed rows so the page never renders empty.
 */
const FALLBACK_GALLERY: GalleryItem[] = [
  { src: asset("cannes-lions-2026", "UNIKday1-2.jpg"), largeSrc: assetLarge("cannes-lions-2026", "UNIKday1-2.jpg"), alt: "Guest in a tailored blazer against a deep red backdrop", event: "Opening Night", location: "Cannes", eventKey: "cannes-2026", orientation: "portrait" },
  { src: asset("cannes-lions-2026", "UNIKday1-22.jpg"), largeSrc: assetLarge("cannes-lions-2026", "UNIKday1-22.jpg"), alt: "Guests gathered on a couch with champagne", event: "The Room", location: "Cannes", eventKey: "cannes-2026", orientation: "landscape" },
  { src: asset("cannes-lions-2026", "UNIKday1-58.jpg"), largeSrc: assetLarge("cannes-lions-2026", "UNIKday1-58.jpg"), alt: "DJ performing under a disco ball in red light", event: "After Dark", location: "Cannes", eventKey: "cannes-2026", orientation: "portrait" },
  { src: asset("cannes-lions-2026", "UNIKday1-38.jpg"), largeSrc: assetLarge("cannes-lions-2026", "UNIKday1-38.jpg"), alt: "Four guests posing together at a Culturin evening", event: "The Room", location: "Cannes", eventKey: "cannes-2026", orientation: "landscape" },
  { src: asset("cannes-lions-2026", "UNIKday1-26.jpg"), largeSrc: assetLarge("cannes-lions-2026", "UNIKday1-26.jpg"), alt: "Disco balls above the crowd", event: "After Dark", location: "Cannes", eventKey: "cannes-2026", orientation: "portrait" },
  { src: asset("cannes-lions-2026", "UNIKday1-62.jpg"), largeSrc: assetLarge("cannes-lions-2026", "UNIKday1-62.jpg"), alt: "Red-lit crowd on the dancefloor", event: "After Dark", location: "Cannes", eventKey: "cannes-2026", orientation: "landscape" },
  { src: asset("cannes-lions-2026", "UNIKday1-14.jpg"), largeSrc: assetLarge("cannes-lions-2026", "UNIKday1-14.jpg"), alt: "Couple portrait against a red-lit backdrop", event: "Opening Night", location: "Cannes", eventKey: "cannes-2026", orientation: "portrait" },
  { src: asset("cannes-lions-2026", "UNIKday1-54.jpg"), largeSrc: assetLarge("cannes-lions-2026", "UNIKday1-54.jpg"), alt: "Candid dancing at a Culturin evening", event: "After Dark", location: "Cannes", eventKey: "cannes-2026", orientation: "landscape" },
  { src: asset("cannes-lions-2026", "UNIKday1-34.jpg"), largeSrc: assetLarge("cannes-lions-2026", "UNIKday1-34.jpg"), alt: "Two guests portrait at the party", event: "Opening Night", location: "Cannes", eventKey: "cannes-2026", orientation: "portrait" },
  { src: asset("cannes-lions-2026", "UNIKday1-46.jpg"), largeSrc: assetLarge("cannes-lions-2026", "UNIKday1-46.jpg"), alt: "Guests mingling in a warm-lit lounge", event: "The Room", location: "Cannes", eventKey: "cannes-2026", orientation: "landscape" },
  { src: asset("cannes-lions-2026", "UNIKday2-4.jpg"), largeSrc: assetLarge("cannes-lions-2026", "UNIKday2-4.jpg"), alt: "Guest in a yellow jersey lit by red smoke", event: "Night Two", location: "Cannes", eventKey: "cannes-2026", orientation: "portrait" },
  { src: asset("cannes-lions-2026", "UNIKday2-22.jpg"), largeSrc: assetLarge("cannes-lions-2026", "UNIKday2-22.jpg"), alt: "Couple posing at the branded wall", event: "Night Two", location: "Cannes", eventKey: "cannes-2026", orientation: "portrait" },
  { src: asset("cannes-lions-2026", "UNIKday2-30.jpg"), largeSrc: assetLarge("cannes-lions-2026", "UNIKday2-30.jpg"), alt: "Full dancefloor under disco balls late at night", event: "Night Two", location: "Cannes", eventKey: "cannes-2026", orientation: "landscape" },
  { src: asset("cannes-lions-2026", "UNIKday2-12.jpg"), largeSrc: assetLarge("cannes-lions-2026", "UNIKday2-12.jpg"), alt: "Group of guests at a Culturin gathering", event: "Night Two", location: "Cannes", eventKey: "cannes-2026", orientation: "landscape" },
  { src: asset("cannes-lions-2026", "UNIKday2-34.jpg"), largeSrc: assetLarge("cannes-lions-2026", "UNIKday2-34.jpg"), alt: "Two guests laughing together late at night", event: "Night Two", location: "Cannes", eventKey: "cannes-2026", orientation: "portrait" },
  { src: asset("cannes-lions-2026", "UNIKday1-70.jpg"), largeSrc: assetLarge("cannes-lions-2026", "UNIKday1-70.jpg"), alt: "Guests dancing under disco balls with phones raised", event: "After Dark", location: "Cannes", eventKey: "cannes-2026", orientation: "landscape" },
  { src: asset("notting-hill-carnival-2024", "nhc-1.jpg"), largeSrc: assetLarge("notting-hill-carnival-2024", "nhc-1.jpg"), alt: "DJ Tim Adé performing at the Carnival weekend after-party", event: "Carnival Weekend", location: "London", eventKey: "notting-hill-2024", orientation: "landscape" },
  { src: asset("notting-hill-carnival-2024", "nhc-2.jpg"), largeSrc: assetLarge("notting-hill-carnival-2024", "nhc-2.jpg"), alt: "Guests gathered in a warm-lit lounge", event: "Carnival Weekend", location: "London", eventKey: "notting-hill-2024", orientation: "landscape" },
  { src: asset("notting-hill-carnival-2024", "nhc-3.jpg"), largeSrc: assetLarge("notting-hill-carnival-2024", "nhc-3.jpg"), alt: "Guests dancing together at the after-party", event: "Carnival Weekend", location: "London", eventKey: "notting-hill-2024", orientation: "portrait" },
  { src: asset("notting-hill-carnival-2024", "nhc-4.jpg"), largeSrc: assetLarge("notting-hill-carnival-2024", "nhc-4.jpg"), alt: "Storefront signage for the venue at night", event: "Carnival Weekend", location: "London", eventKey: "notting-hill-2024", orientation: "landscape" },
  { src: asset("notting-hill-carnival-2024", "nhc-5.jpg"), largeSrc: assetLarge("notting-hill-carnival-2024", "nhc-5.jpg"), alt: "Guest in a colourful printed outfit", event: "Carnival Weekend", location: "London", eventKey: "notting-hill-2024", orientation: "portrait" },
  { src: asset("notting-hill-carnival-2024", "nhc-6.jpg"), largeSrc: assetLarge("notting-hill-carnival-2024", "nhc-6.jpg"), alt: "Group of four guests in colourful attire", event: "Carnival Weekend", location: "London", eventKey: "notting-hill-2024", orientation: "landscape" },
  { src: asset("notting-hill-carnival-2024", "nhc-7.jpg"), largeSrc: assetLarge("notting-hill-carnival-2024", "nhc-7.jpg"), alt: "A second DJ set at the after-party", event: "Carnival Weekend", location: "London", eventKey: "notting-hill-2024", orientation: "landscape" },
  { src: asset("notting-hill-carnival-2024", "nhc-8.jpg"), largeSrc: assetLarge("notting-hill-carnival-2024", "nhc-8.jpg"), alt: "Guests in elaborate carnival-inspired outfits", event: "Carnival Weekend", location: "London", eventKey: "notting-hill-2024", orientation: "portrait" },
  { src: asset("nyfw-2024", "nyfw-1.jpg"), largeSrc: assetLarge("nyfw-2024", "nyfw-1.jpg"), alt: "Models walking in a red-lit venue during Fashion Week", event: "NY Fashion Week", location: "New York", eventKey: "nyfw-2024", orientation: "landscape" },
  { src: asset("nyfw-2024", "nyfw-2.jpg"), largeSrc: assetLarge("nyfw-2024", "nyfw-2.jpg"), alt: "A performer on the mic during the night", event: "NY Fashion Week", location: "New York", eventKey: "nyfw-2024", orientation: "landscape" },
  { src: asset("nyfw-2024", "nyfw-3.jpg"), largeSrc: assetLarge("nyfw-2024", "nyfw-3.jpg"), alt: "DJ booth at a red-lit Fashion Week night", event: "NY Fashion Week", location: "New York", eventKey: "nyfw-2024", orientation: "landscape" },
  { src: asset("nyfw-2024", "nyfw-4.jpg"), largeSrc: assetLarge("nyfw-2024", "nyfw-4.jpg"), alt: "DJ mixing with hand raised", event: "NY Fashion Week", location: "New York", eventKey: "nyfw-2024", orientation: "landscape" },
  { src: asset("nyfw-2024", "nyfw-5.jpg"), largeSrc: assetLarge("nyfw-2024", "nyfw-5.jpg"), alt: "Group of guests at the bar", event: "NY Fashion Week", location: "New York", eventKey: "nyfw-2024", orientation: "landscape" },
  { src: asset("nyfw-2024", "nyfw-6.jpg"), largeSrc: assetLarge("nyfw-2024", "nyfw-6.jpg"), alt: "Guests by a red curtain", event: "NY Fashion Week", location: "New York", eventKey: "nyfw-2024", orientation: "landscape" },
  { src: asset("nyfw-2024", "nyfw-7.jpg"), largeSrc: assetLarge("nyfw-2024", "nyfw-7.jpg"), alt: "Group portrait of guests at the venue", event: "NY Fashion Week", location: "New York", eventKey: "nyfw-2024", orientation: "landscape" },
  { src: asset("nyfw-2024", "nyfw-8.jpg"), largeSrc: assetLarge("nyfw-2024", "nyfw-8.jpg"), alt: "Guests toasting with drinks", event: "NY Fashion Week", location: "New York", eventKey: "nyfw-2024", orientation: "landscape" },
];

const FILTER_LABELS: Record<string, string> = {
  "cannes-2026": "Cannes Lions 2026",
  "notting-hill-2024": "Notting Hill Carnival",
  "nyfw-2024": "NY Fashion Week",
};

function buildFilters(items: GalleryItem[]): GalleryFilter[] {
  const seen: string[] = [];
  for (const item of items) {
    if (!seen.includes(item.eventKey)) seen.push(item.eventKey);
  }
  if (seen.length <= 1) return [];
  return [
    { key: "all", label: "All" },
    ...seen.map((key) => ({ key, label: FILTER_LABELS[key] ?? key })),
  ];
}

async function loadGallery(): Promise<GalleryItem[]> {
  const db = getCmsDbOrNull();
  if (!db) return FALLBACK_GALLERY;
  const rows = await listGalleryImagesPublic(db);
  return rows.length > 0 ? rows : FALLBACK_GALLERY;
}

export default async function GalleryPage() {
  const GALLERY = await loadGallery();
  const FILTERS = buildFilters(GALLERY);

  return (
    <div style={{ background: BG, color: INK }} className={`${editorialScopeClass} font-sans antialiased`}>

      {/* ── Dynamic island nav ─────────────────────────────────── */}
      <IslandNav />

      {/* ── Page header ──────────────────────────────────────────── */}
      <div
        className="border-b px-8 sm:px-14"
        style={{ paddingTop: "8rem", paddingBottom: "5rem", borderColor: RULE }}
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
          Real rooms Culturin has actually been in, Cannes, Notting Hill Carnival, and New York Fashion Week.
        </p>
      </div>

      {/* ── Masonry grid ─────────────────────────────────────────── */}
      <div className="px-8 py-16 sm:px-14">
        <GalleryGrid items={GALLERY} filters={FILTERS} />
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
          className="inline-flex items-center gap-3 rounded-full px-10 py-4 text-xs font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-85"
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
