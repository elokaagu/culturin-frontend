import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { events } from "@/lib/eventsData";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imagePlaceholder";

export const metadata: Metadata = {
  title: "Culturin | Culture at the world's biggest rooms",
  description:
    "Culturin builds curated cultural experiences at the world's most important gatherings — Cannes, the US Open, UNGA, and beyond.",
};

const BG = "#e8e3da";
const INK = "#1c1a17";
const INK_MUTED = "#6b6456";
const RULE = "#cec7be";

const HERO_SRC = "/events/cannes-lions-2026/UNIKday1-70.jpg";

const CANNES_SRC = "/events/cannes-lions-2026/UNIKday1-2.jpg";

const GALLERY_PREVIEW = [
  {
    src: "/events/cannes-lions-2026/UNIKday1-58.jpg",
    alt: "DJ under a disco ball at a Culturin night in Cannes",
    span: "row-span-2",
  },
  {
    src: "/events/cannes-lions-2026/UNIKday1-62.jpg",
    alt: "Red-lit crowd on the dancefloor",
    span: "",
  },
  {
    src: "/events/cannes-lions-2026/UNIKday1-22.jpg",
    alt: "Guests gathered on a couch with champagne",
    span: "",
  },
  {
    src: "/events/cannes-lions-2026/UNIKday1-26.jpg",
    alt: "Disco balls above the crowd",
    span: "row-span-2",
  },
  {
    src: "/events/cannes-lions-2026/UNIKday1-54.jpg",
    alt: "Candid dancing at a Culturin evening",
    span: "",
  },
  {
    src: "/events/cannes-lions-2026/UNIKday2-34.jpg",
    alt: "Two guests laughing together late at night",
    span: "",
  },
];

const PILLARS = [
  {
    label: "Events",
    body: "Intimate, curated gatherings at the world's most important moments — film festivals, sporting finals, diplomatic summits.",
  },
  {
    label: "Community",
    body: "A network of founders, artists, diplomats, and cultural leaders who move between cities and make things happen.",
  },
  {
    label: "Platform",
    body: "A cultural intelligence layer for travellers and institutions — destinations, stories, and local access, coming soon.",
  },
];

const featuredEvents = events.slice(0, 3);

export default function HomePage() {
  return (
    <div style={{ background: BG, color: INK }} className="font-sans antialiased">

      {/* ── Sticky nav ─────────────────────────────────────────── */}
      <nav
        className="fixed inset-x-0 top-0 z-50 flex items-stretch border-b"
        style={{ height: 48, borderColor: RULE, background: BG }}
      >
        <Link
          href="/"
          className="flex shrink-0 items-center px-6 text-xs font-semibold uppercase tracking-[0.22em] no-underline"
          style={{ color: INK }}
        >
          Culturin
        </Link>
        <div className="flex flex-1 items-stretch" style={{ borderLeft: `1px solid ${RULE}` }}>
          {[
            { label: "Events", href: "/events" },
            { label: "Cannes", href: "#cannes" },
            { label: "Gallery", href: "/gallery" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-1 items-center justify-center text-[11px] font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-60"
              style={{ color: INK, borderRight: `1px solid ${RULE}` }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/events"
            className="flex shrink-0 items-center px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-white no-underline transition-opacity hover:opacity-85"
            style={{ background: "#5c7a6b" }}
          >
            Apply
          </Link>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section
        className="relative flex min-h-dvh flex-col justify-end overflow-hidden pb-20 pl-8 sm:pl-14"
        style={{ paddingTop: 48 }}
      >
        <Image
          src={HERO_SRC}
          alt="Guests dancing under disco balls at a Culturin night in Cannes"
          fill
          priority
          className="object-cover"
          placeholder="blur"
          blurDataURL={IMAGE_BLUR_DATA_URL}
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.30) 55%, rgba(0,0,0,0.05) 100%)",
          }}
        />
        <div className="relative z-10 max-w-4xl">
          <h1
            className="m-0 text-6xl font-medium leading-[1.0] text-white sm:text-8xl lg:text-[8.5rem]"
            style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
          >
            We bring culture to the world&apos;s biggest rooms.
          </h1>
          <p className="mt-8 text-sm font-medium uppercase tracking-[0.25em] text-white/60">
            Cannes&nbsp;&nbsp;·&nbsp;&nbsp;New York&nbsp;&nbsp;·&nbsp;&nbsp;Lagos&nbsp;&nbsp;·&nbsp;&nbsp;Beyond
          </p>
        </div>
      </section>

      {/* ── Mission ────────────────────────────────────────────── */}
      <section
        id="mission"
        className="border-b px-8 sm:px-14"
        style={{ paddingTop: "8rem", paddingBottom: "8rem", borderColor: RULE }}
      >
        <div className="mx-auto max-w-6xl">
          <p
            className="mb-10 text-[10px] font-semibold uppercase tracking-[0.3em]"
            style={{ color: INK_MUTED }}
          >
            What we are
          </p>
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
            <h2
              className="m-0 text-4xl font-medium leading-[1.1] sm:text-5xl"
              style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
            >
              Culture is the access that matters most.
            </h2>
            <div className="flex flex-col gap-6">
              <p className="m-0 text-base leading-loose" style={{ color: INK_MUTED }}>
                Culturin is a cultural experiences company. We build the rooms — dinners, salons, receptions — at the edges of the world&apos;s most important gatherings, where founders, artists, diplomats, and cultural leaders actually meet.
              </p>
              <p className="m-0 text-base leading-loose" style={{ color: INK_MUTED }}>
                We are not a conference. We are not a travel company. We are the cultural layer that makes the world&apos;s biggest moments meaningful.
              </p>
            </div>
          </div>

          <div
            className="mt-20 grid grid-cols-1 gap-px sm:grid-cols-3"
            style={{ background: RULE }}
          >
            {PILLARS.map((p) => (
              <div key={p.label} className="px-8 py-10" style={{ background: BG }}>
                <p
                  className="mb-4 text-[10px] font-semibold uppercase tracking-[0.25em]"
                  style={{ color: INK_MUTED }}
                >
                  {p.label}
                </p>
                <p className="m-0 text-sm leading-relaxed" style={{ color: INK_MUTED }}>
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Upcoming events ────────────────────────────────────── */}
      <section
        id="events"
        className="px-8 sm:px-14"
        style={{ paddingTop: "8rem", paddingBottom: "4rem" }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <p
                className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em]"
                style={{ color: INK_MUTED }}
              >
                Where we&apos;ll be
              </p>
              <h2
                className="m-0 text-4xl font-medium leading-[1.08] sm:text-5xl"
                style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
              >
                Upcoming events
              </h2>
            </div>
            <Link
              href="/events"
              className="shrink-0 text-xs font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-60"
              style={{ color: INK }}
            >
              All events →
            </Link>
          </div>

          <div
            className="grid grid-cols-1 gap-px sm:grid-cols-3"
            style={{ background: RULE }}
          >
            {featuredEvents.map((event) => (
              <Link
                key={event.slug}
                href={`/events/${event.slug}`}
                className="group relative flex flex-col no-underline"
                style={{ background: BG, color: INK }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={event.heroImage}
                    alt={event.heroImageAlt}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR_DATA_URL}
                    sizes="(max-width: 640px) 100vw, 33vw"
                    unoptimized
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <p
                      className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em]"
                      style={{ color: INK_MUTED }}
                    >
                      {event.category}
                    </p>
                    <h3
                      className="m-0 text-xl font-medium leading-[1.15]"
                      style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
                    >
                      {event.name}
                    </h3>
                  </div>
                  <div className="mt-6 flex items-end justify-between gap-2">
                    <div>
                      <p className="m-0 text-xs" style={{ color: INK_MUTED }}>{event.date}</p>
                      <p className="m-0 text-xs" style={{ color: INK_MUTED }}>{event.location}</p>
                    </div>
                    <span
                      className="text-xs font-semibold transition-opacity group-hover:opacity-60"
                      style={{ color: INK }}
                    >
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cannes ─────────────────────────────────────────────── */}
      <section
        id="cannes"
        className="border-y px-8 sm:px-14"
        style={{ paddingTop: "8rem", paddingBottom: "8rem", borderColor: RULE }}
      >
        <div className="mx-auto max-w-6xl">
          <p
            className="mb-10 text-[10px] font-semibold uppercase tracking-[0.3em]"
            style={{ color: INK_MUTED }}
          >
            Culturin Cannes
          </p>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="relative aspect-[3/4] overflow-hidden lg:aspect-auto lg:min-h-[520px]">
              <Image
                src={CANNES_SRC}
                alt="Guest in a tailored blazer at a Culturin night in Cannes"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h2
                className="m-0 text-4xl font-medium leading-[1.1] sm:text-5xl lg:text-6xl"
                style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
              >
                La Croisette.<br />Our way.
              </h2>
              <p className="mt-7 text-base leading-loose" style={{ color: INK_MUTED }}>
                Every June, the world&apos;s creative industry — CMOs, agency founders, artists, and brand builders — descends on a small city on the French Riviera for Cannes Lions. By day it&apos;s awards and panels. The real conversations happen after dark.
              </p>
              <p className="mt-5 text-base leading-loose" style={{ color: INK_MUTED }}>
                Culturin builds those nights. Curated guest lists, live music, warm rooms, and a late-night close that keeps going long after the awards do. Cannes, without the noise.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <Link
                  href="/events/cannes-lions-2026"
                  className="inline-flex items-center px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white no-underline transition-opacity hover:opacity-85"
                  style={{ background: INK }}
                >
                  View Cannes programming
                </Link>
                <Link
                  href="/events/cannes-lions-2026#rsvp"
                  className="text-xs font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-60"
                  style={{ color: INK }}
                >
                  Request access →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Gallery preview ────────────────────────────────────── */}
      <section
        id="gallery"
        className="px-8 sm:px-14"
        style={{ paddingTop: "8rem", paddingBottom: "8rem" }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <p
                className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em]"
                style={{ color: INK_MUTED }}
              >
                From the field
              </p>
              <h2
                className="m-0 text-4xl font-medium leading-[1.08] sm:text-5xl"
                style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
              >
                Life inside the rooms.
              </h2>
            </div>
            <Link
              href="/gallery"
              className="shrink-0 text-xs font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-60"
              style={{ color: INK }}
            >
              Full gallery →
            </Link>
          </div>

          <div
            className="grid grid-cols-3 gap-2"
            style={{ gridTemplateRows: "240px 240px" }}
          >
            {GALLERY_PREVIEW.map((item, i) => (
              <Link
                key={i}
                href="/gallery"
                className={`group relative block overflow-hidden no-underline ${item.span}`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                  sizes="(max-width: 640px) 50vw, 33vw"
                  unoptimized
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── What we're building ────────────────────────────────── */}
      <section
        className="border-t px-8 sm:px-14"
        style={{ paddingTop: "8rem", paddingBottom: "8rem", borderColor: RULE }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
            <div>
              <p
                className="mb-6 text-[10px] font-semibold uppercase tracking-[0.3em]"
                style={{ color: INK_MUTED }}
              >
                What we&apos;re building
              </p>
              <h2
                className="m-0 text-4xl font-medium leading-[1.1] sm:text-5xl"
                style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
              >
                The platform is coming.
              </h2>
            </div>
            <div className="flex flex-col justify-center gap-6">
              <p className="m-0 text-base leading-loose" style={{ color: INK_MUTED }}>
                Behind the events, we are building Culturin as a platform — a cultural intelligence layer for travellers, institutions, and brands who want to move through the world with more depth and less noise.
              </p>
              <p className="m-0 text-base leading-loose" style={{ color: INK_MUTED }}>
                Curated destinations. Local context. Stories from the people who actually live there. Coming soon.
              </p>
              <Link
                href="/events"
                className="mt-2 inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-60"
                style={{ color: INK }}
              >
                In the meantime, join an event →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t px-8 sm:px-14" style={{ borderColor: RULE }}>
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-10 py-12 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: INK }}>
                Culturin
              </p>
              <p className="mt-2 max-w-xs text-xs leading-relaxed" style={{ color: INK_MUTED }}>
                Culture at the world&apos;s biggest rooms.
              </p>
            </div>
            <nav className="flex flex-col gap-3 sm:flex-row sm:gap-8">
              {[
                { label: "Events", href: "/events" },
                { label: "Gallery", href: "/gallery" },
                { label: "Cannes", href: "#cannes" },
                { label: "Sign in", href: "/sign-in" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-xs no-underline transition-opacity hover:opacity-60"
                  style={{ color: INK_MUTED }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div
            className="flex items-center justify-between border-t py-5"
            style={{ borderColor: RULE }}
          >
            <span className="text-[11px]" style={{ color: INK_MUTED }}>
              © {new Date().getFullYear()} Culturin
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
