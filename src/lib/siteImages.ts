import { getCmsDbOrNull } from "@/lib/cms/server";

export type SiteImageSlot = {
  key: string;
  label: string;
  /** Fallback used until a Studio admin sets/replaces this slot, and if the DB is unreachable. */
  defaultSrc: string;
  defaultAlt: string;
};

/**
 * Canonical list of every hardcoded image "slot" on the public site that
 * Studio can replace. Adding a new slot here is what makes it show up (and
 * become editable) on /studio/site-images — the public page must also be
 * updated to call `getSiteImage(slotKey)` instead of a literal path.
 */
export const SITE_IMAGE_SLOTS: SiteImageSlot[] = [
  {
    key: "homepage-hero",
    label: "Homepage — Hero background",
    defaultSrc: "/events/cannes-lions-2026/UNIKday1-71.jpg",
    defaultAlt: "A packed room at a Culturin night, red lighting and neon signage",
  },
  {
    key: "homepage-cannes-section",
    label: "Homepage — Cannes Lions section photo",
    defaultSrc: "/events/cannes-lions-2026/UNIKday1-2.jpg",
    defaultAlt: "Guest in a tailored blazer at a Culturin night in Cannes",
  },
  {
    key: "homepage-parallax",
    label: "Homepage — \"Culture doesn't wait\" parallax photo",
    defaultSrc: "/events/cannes-lions-2026/UNIKday1-54.jpg",
    defaultAlt: "Guests on the dancefloor at a late-night Culturin reception",
  },
  {
    key: "homepage-preview-1",
    label: "Homepage — Gallery preview photo 1 (tall, left)",
    defaultSrc: "/events/cannes-lions-2026/UNIKday1-34.jpg",
    defaultAlt: "Two guests portrait at a Culturin night in Cannes",
  },
  {
    key: "homepage-preview-2",
    label: "Homepage — Gallery preview photo 2",
    defaultSrc: "/events/cannes-lions-2026/UNIKday1-41.jpg",
    defaultAlt: "Guests gathered together in a red-lit lounge in Cannes",
  },
  {
    key: "homepage-preview-3",
    label: "Homepage — Gallery preview photo 3",
    defaultSrc: "/events/cannes-lions-2026/UNIKday1-48.jpg",
    defaultAlt: "Guests laughing together in a red-lit lounge in Cannes",
  },
  {
    key: "homepage-preview-4",
    label: "Homepage — Gallery preview photo 4",
    defaultSrc: "/events/cannes-lions-2026/UNIKday1-26.jpg",
    defaultAlt: "Disco balls above the crowd in Cannes",
  },
  {
    key: "homepage-preview-5",
    label: "Homepage — Gallery preview photo 5",
    defaultSrc: "/events/cannes-lions-2026/UNIKday1-38.jpg",
    defaultAlt: "Guests posing together at a Culturin evening in Cannes",
  },
  {
    key: "event-hero-cannes-lions-2026",
    label: "Event hero — Culturin at Cannes Lions",
    defaultSrc: "/events/cannes-lions-2026/UNIKday2-14.jpg",
    defaultAlt: "Guests laughing together beneath the disco balls in Cannes",
  },
  {
    key: "event-hero-us-open-2026",
    label: "Event hero — Culturin at the US Open",
    defaultSrc: "/events/cannes-lions-2026/WelcomParty-0060.jpg",
    defaultAlt: "Guests mingling in a warm-lit room at a Culturin welcome party",
  },
  {
    key: "event-hero-unga-2026",
    label: "Event hero — Culturin at UNGA",
    defaultSrc: "/events/cannes-lions-2026/UNIKday1-106.jpg",
    defaultAlt: "Guest smiling against a branded backdrop",
  },
];

export type SiteImage = { src: string; alt: string };

/** Server-side: fetch every configured slot as a lookup map, keyed by slot_key. */
export async function getSiteImagesMap(): Promise<Record<string, SiteImage>> {
  const db = getCmsDbOrNull();
  if (!db) return {};

  const { data, error } = await db.from("site_images").select("slot_key, src, alt");
  if (error || !data) return {};

  return Object.fromEntries((data as Array<{ slot_key: string; src: string; alt: string }>).map((row) => [row.slot_key, { src: row.src, alt: row.alt }]));
}

/**
 * Resolve one slot against a pre-fetched map. `fallback` should always be the
 * call site's own known-good value (e.g. `event.heroImage`) rather than the
 * manifest default — that way a slug/slot that's missing from
 * SITE_IMAGE_SLOTS (a new event added without updating the manifest) still
 * renders correctly instead of going blank.
 */
export function resolveSiteImage(map: Record<string, SiteImage>, slotKey: string, fallback: SiteImage): SiteImage {
  const row = map[slotKey];
  if (!row || !row.src) return fallback;
  return { src: row.src, alt: row.alt || fallback.alt };
}

/** Manifest-only fallback, for the Studio admin UI when no DB row exists yet for a known slot. */
export function manifestDefault(slotKey: string): SiteImage {
  const slot = SITE_IMAGE_SLOTS.find((s) => s.key === slotKey);
  return { src: slot?.defaultSrc ?? "", alt: slot?.defaultAlt ?? "" };
}
