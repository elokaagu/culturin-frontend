import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { IMAGE_BLUR_DATA_URL } from "@/lib/imagePlaceholder";

export const metadata: Metadata = {
  title: "Gallery | Culturin",
  description: "Images from Culturin events — Cannes, New York, Lagos, and beyond.",
};

const BG = "#e8e3da";
const INK = "#1c1a17";
const INK_MUTED = "#6b6456";
const RULE = "#cec7be";

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

type GalleryItem = {
  src: string;
  alt: string;
  event: string;
  location: string;
};

const GALLERY: GalleryItem[] = [
  {
    src: u("1459749411175-04bf5292ceea"),
    alt: "Crowd at a live Afrobeat concert with stage lights",
    event: "Amafrobeat Experience",
    location: "Lagos",
  },
  {
    src: u("1517248135467-4c7edcad34c4"),
    alt: "Guests around a long communal dinner table",
    event: "Culturin Dinner",
    location: "New York",
  },
  {
    src: u("1475721027785-f74eccf877e2"),
    alt: "Panel discussion on stage at a Culturin salon",
    event: "Culturin Salon",
    location: "New York",
  },
  {
    src: u("1514525253161-7a46d19cd819"),
    alt: "DJ set on a rooftop at golden hour",
    event: "Rooftop Close",
    location: "New York",
  },
  {
    src: u("1555396273-367ea4eb4db5"),
    alt: "Outdoor evening dining in a lantern-lit courtyard",
    event: "Terrace Dinner",
    location: "Cannes",
  },
  {
    src: u("1469854523086-cc02fe5d8800"),
    alt: "Sunlit coastal road along the French Riviera",
    event: "Cannes Film Festival",
    location: "Cannes",
  },
  {
    src: u("1460661419201-fd4cecdf8a8b"),
    alt: "Guests at a contemporary art installation",
    event: "Art & Culture Night",
    location: "Lagos",
  },
  {
    src: u("1480714378408-67cf0d13bc1f"),
    alt: "Cultural neighbourhood walk through a vibrant city street",
    event: "City Walk",
    location: "Lagos",
  },
  {
    src: u("1511578314322-379afb476865"),
    alt: "Makers market with creative vendors and visitors",
    event: "Culturin Market",
    location: "Accra",
  },
  {
    src: u("1511379938547-c1f69419868d"),
    alt: "Musicians performing in an intimate candlelit venue",
    event: "Listening Session",
    location: "Lagos",
  },
  {
    src: u("1509042239860-f550ce710b93"),
    alt: "Warm drinks and conversation at a private gathering",
    event: "Opening Reception",
    location: "New York",
  },
  {
    src: u("1558642452-9d2a7deb7f62"),
    alt: "Mosaic sculpture and architecture in afternoon light",
    event: "Cultural Walk",
    location: "Barcelona",
  },
];

export default function GalleryPage() {
  return (
    <div style={{ background: BG, color: INK }} className="font-sans antialiased">

      {/* ── Top bar ──────────────────────────────────────────────── */}
      <header
        className="flex items-center justify-between border-b px-8 sm:px-14"
        style={{ height: 48, borderColor: RULE, background: BG }}
      >
        <Link
          href="/"
          className="text-xs font-semibold uppercase tracking-[0.22em] no-underline transition-opacity hover:opacity-60"
          style={{ color: INK }}
        >
          Culturin
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
          Images from Culturin events across Cannes, New York, Lagos, Accra, and Barcelona.
          Every photo is a room we built.
        </p>
      </div>

      {/* ── Masonry grid ─────────────────────────────────────────── */}
      <div className="px-8 py-16 sm:px-14">
        <div className="columns-1 gap-3 sm:columns-2 lg:columns-3">
          {GALLERY.map((item) => (
            <figure
              key={item.src}
              className="mb-3 break-inside-avoid overflow-hidden"
              style={{ margin: 0, borderRadius: 2 }}
            >
              <div className="group relative overflow-hidden">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={900}
                  height={600}
                  className="block w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
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
            </figure>
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
          className="inline-flex items-center gap-3 px-10 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white no-underline transition-opacity hover:opacity-85"
          style={{ background: INK }}
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
