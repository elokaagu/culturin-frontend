import type { Metadata } from "next";
import Link from "next/link";

import { events } from "@/lib/eventsData";
import { blurForSrc } from "@/lib/culturinImages";
import {
  EDITORIAL_BG,
  EDITORIAL_INK,
  EDITORIAL_MUTED,
  EDITORIAL_RULE,
  EDITORIAL_ACCENT,
  SURFACE_DARK,
  ACCENT_ON_DARK,
  editorialScopeClass,
} from "@/lib/theme/culturinTokens";
import BlurImage from "./components/motion/BlurImage";
import Reveal from "./components/motion/Reveal";
import ParallaxReveal from "./components/motion/ParallaxReveal";
import EditorialStatement from "./components/EditorialStatement";
import HomeFooter from "./components/HomeFooter";
import CulturinMark from "./components/CulturinMark";

export const metadata: Metadata = {
  title: "Culturin | Events that matter, with the world's leading brands",
  description:
    "Culturin partners with the world's leading brands to build cultural events that matter — at Cannes Lions, the US Open, UNGA, and beyond.",
};

const BG = EDITORIAL_BG;
const INK = EDITORIAL_INK;
const INK_MUTED = EDITORIAL_MUTED;
const RULE = EDITORIAL_RULE;
const ACCENT = EDITORIAL_ACCENT;

const HERO_SRC = "/events/cannes-lions-2026/UNIKday1-70.jpg";
const CANNES_SRC = "/events/cannes-lions-2026/UNIKday1-2.jpg";
const PARTNER_SRC = "/events/cannes-lions-2026/UNIKday1-22.jpg";
const PARALLAX_SRC = "/events/cannes-lions-2026/UNIKday2-26.jpg";

const GALLERY_PREVIEW = [
  { src: "/events/cannes-lions-2026/UNIKday1-58.jpg", alt: "DJ under a disco ball at a Culturin night", span: "row-span-2" },
  { src: "/events/cannes-lions-2026/UNIKday1-62.jpg", alt: "Red-lit crowd on the dancefloor", span: "" },
  { src: "/events/cannes-lions-2026/UNIKday1-22.jpg", alt: "Guests gathered on a couch with champagne", span: "" },
  { src: "/events/cannes-lions-2026/UNIKday1-26.jpg", alt: "Disco balls above the crowd", span: "row-span-2" },
  { src: "/events/cannes-lions-2026/UNIKday1-54.jpg", alt: "Candid dancing at a Culturin evening", span: "" },
  { src: "/events/cannes-lions-2026/UNIKday2-34.jpg", alt: "Two guests laughing together late at night", span: "" },
];

const PILLARS = [
  {
    label: "Events that matter",
    body: "Intimate, culturally-grounded gatherings at the world's most important moments — where a brand's presence is felt, not just seen.",
  },
  {
    label: "The right room",
    body: "Founders, artists, athletes, diplomats, and cultural leaders. We curate the guest list so every introduction counts.",
  },
  {
    label: "Built with partners",
    body: "We co-create with the world's leading brands — from concept and guest curation to production and the morning-after story.",
  },
];

const featuredEvents = events.slice(0, 3);

/** Short city label pulled from a full location string, for Trippin-style tag chips. */
function cityTag(location: string): string {
  return location.split(",")[0]?.trim() ?? location;
}

export default function HomePage() {
  return (
    <div style={{ background: BG, color: INK }} className={`${editorialScopeClass} font-sans antialiased`}>

      {/* ── Sticky nav ─────────────────────────────────────────── */}
      <nav
        className="fixed inset-x-0 top-0 z-50 flex items-stretch border-b backdrop-blur-md"
        style={{ height: 48, borderColor: RULE, background: "rgba(232,227,218,0.82)" }}
      >
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 px-6 text-xs font-semibold uppercase tracking-[0.28em] no-underline transition-opacity hover:opacity-70"
          style={{ color: INK }}
        >
          <CulturinMark size={18} />
          Culturin
        </Link>
        <div className="flex flex-1 items-stretch" style={{ borderLeft: `1px solid ${RULE}` }}>
          {[
            { label: "Events", href: "/events" },
            { label: "Partners", href: "#partners" },
            { label: "Gallery", href: "/gallery" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="hidden flex-1 items-center justify-center text-[11px] font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-60 sm:flex"
              style={{ color: INK, borderRight: `1px solid ${RULE}` }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="#partners"
            className="flex shrink-0 items-center px-6 text-[11px] font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-85"
            style={{ background: ACCENT, color: SURFACE_DARK }}
          >
            Partner with us
          </Link>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section
        className="relative flex min-h-dvh flex-col justify-end overflow-hidden pb-20 pl-8 sm:pl-14"
        style={{ paddingTop: 48 }}
      >
        <BlurImage
          src={HERO_SRC}
          alt="Guests dancing under disco balls at a Culturin night in Cannes"
          fill
          priority
          className="object-cover"
          placeholder="blur"
          blurDataURL={blurForSrc(HERO_SRC)}
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.32) 55%, rgba(0,0,0,0.08) 100%)",
          }}
        />
        <Reveal className="relative z-10 max-w-4xl" y={32}>
          <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/70">
            More than events. This is a movement.
          </p>
          <h1
            className="m-0 text-5xl font-medium leading-[1.02] text-white sm:text-7xl lg:text-[7.5rem]"
            style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
          >
            Events that matter, with the brands that make them.
          </h1>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-white/75">
            We build cultural events at the world&apos;s most important moments — and partner with the brands who want to be part of them.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/55">
            <span>Cannes</span>
            <span>New York</span>
            <span>London</span>
            <span>Beyond</span>
          </div>
        </Reveal>
      </section>

      {/* ── Mission ────────────────────────────────────────────── */}
      <section
        id="mission"
        className="border-b px-8 sm:px-14"
        style={{ paddingTop: "8rem", paddingBottom: "8rem", borderColor: RULE }}
      >
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="mb-10 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: INK_MUTED }}>
              What we do
            </p>
          </Reveal>
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
            <Reveal as="div">
              <h2
                className="m-0 text-4xl font-medium leading-[1.1] sm:text-5xl"
                style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
              >
                Culture is the most valuable room a brand can be in.
              </h2>
            </Reveal>
            <Reveal as="div" delay={120} className="flex flex-col gap-6">
              <p className="m-0 text-base leading-loose" style={{ color: INK_MUTED }}>
                Culturin is a cultural events company. We build the rooms — dinners, salons, live nights — at the edges of the world&apos;s most important gatherings, where founders, artists, athletes, diplomats, and cultural leaders actually meet.
              </p>
              <p className="m-0 text-base leading-loose" style={{ color: INK_MUTED }}>
                And we build them with partners. For brands who understand that showing up in culture — authentically, at the right moment — is worth more than any billboard.
              </p>
            </Reveal>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-px sm:grid-cols-3" style={{ background: RULE }}>
            {PILLARS.map((p, i) => (
              <Reveal key={p.label} as="div" delay={i * 120}>
                <div className="h-full px-8 py-10" style={{ background: BG }}>
                  <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.25em]" style={{ color: INK_MUTED }}>
                    {p.label}
                  </p>
                  <p className="m-0 text-sm leading-relaxed" style={{ color: INK_MUTED }}>
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Editorial statements (OPUS-style alternating narrative) ── */}
      <section className="px-8 sm:px-14" style={{ paddingTop: "8rem", paddingBottom: "8rem" }}>
        <div className="mx-auto flex max-w-6xl flex-col gap-28">
          <EditorialStatement
            eyebrow="Moments"
            headline={"The Bold.\nThe Curious.\nThe Culture-First."}
            body="A collective bound by spirit, not sector. Like the salons that shaped a renaissance, the dinners that moved diplomacy forward, and the nights that turned a festival into a movement."
            image="/events/cannes-lions-2026/UNIKday1-14.jpg"
            imageAlt="Two guests in an intimate moment at a Culturin evening"
            imageSide="right"
            buttons={[
              { label: "Our events", href: "/events", variant: "solid" },
              { label: "See the room", href: "/gallery", variant: "text" },
            ]}
          />
          <EditorialStatement
            eyebrow="Partners"
            headline={"Brands, Builders\nAnd The Culture\nThey Create."}
            body="Different mediums. Same instinct — to show up, to matter, to be remembered. The brands we work with don't sponsor culture. They become part of it."
            image="/events/cannes-lions-2026/UNIKday1-46.jpg"
            imageAlt="Guests mingling in a warm-lit lounge at a Culturin evening"
            imageSide="left"
            buttons={[
              { label: "Become a partner", href: "#partners", variant: "solid" },
              { label: "How we work", href: "#partners", variant: "text" },
            ]}
          />
          <EditorialStatement
            eyebrow="Movement"
            headline={"This Is\nCulturin."}
            body="We exist to convene the people shaping culture next — founders, artists, diplomats, brand builders. This is where a night becomes a relationship, and a relationship becomes a movement."
            image="/events/cannes-lions-2026/UNIKday2-10.jpg"
            imageAlt="Elegantly dressed couple at a Culturin reception"
            imageSide="right"
            buttons={[
              { label: "Join the room", href: "/events", variant: "solid" },
              { label: "Meet the team", href: "/about", variant: "text" },
            ]}
          />
        </div>
      </section>

      {/* ── Parallax movement break (Goals House-style pinned scroll) ── */}
      <ParallaxReveal
        src={PARALLAX_SRC}
        alt="Guests on the dancefloor at a late-night Culturin reception"
        blurDataURL={blurForSrc(PARALLAX_SRC)}
        eyebrow="The Movement"
        headline="Culture doesn't wait for permission."
        body="Every room we build is a bet that people showing up for each other, in person, still matters more than any feed."
      />

      {/* ── Upcoming events ────────────────────────────────────── */}
      <section
        id="events"
        className="px-8 sm:px-14"
        style={{ paddingTop: "8rem", paddingBottom: "4rem" }}
      >
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-12 flex items-end justify-between gap-6">
            <div>
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: INK_MUTED }}>
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
          </Reveal>

          <div className="grid grid-cols-1 gap-px sm:grid-cols-3" style={{ background: RULE }}>
            {featuredEvents.map((event, i) => (
              <Reveal key={event.slug} as="div" delay={i * 120}>
                <Link
                  href={`/events/${event.slug}`}
                  className="group relative flex h-full flex-col no-underline"
                  style={{ background: BG, color: INK }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <BlurImage
                      src={event.heroImage}
                      alt={event.heroImageAlt}
                      fill
                      className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                      placeholder="blur"
                      blurDataURL={blurForSrc(event.heroImage)}
                      sizes="(max-width: 640px) 100vw, 33vw"
                      unoptimized
                    />
                    {/* Trippin-style tag chips overlaid on the image */}
                    <div className="absolute left-3 top-3 z-[1] flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-medium text-neutral-900">
                        {cityTag(event.location)}
                      </span>
                      <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-medium text-neutral-900">
                        {event.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
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
                      <span className="text-xs font-semibold transition-transform duration-200 group-hover:translate-x-1" style={{ color: INK }}>
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
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
          <Reveal>
            <p className="mb-10 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: INK_MUTED }}>
              Culturin Cannes Lions
            </p>
          </Reveal>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal as="div" className="relative aspect-[3/4] overflow-hidden lg:aspect-auto lg:min-h-[520px]">
              <BlurImage
                src={CANNES_SRC}
                alt="Guest in a tailored blazer at a Culturin night in Cannes"
                fill
                className="object-cover"
                placeholder="blur"
                blurDataURL={blurForSrc(CANNES_SRC)}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </Reveal>
            <Reveal as="div" delay={120} className="flex flex-col justify-center">
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
                Culturin builds those nights. Curated guest lists, live music, warm rooms, and brand partnerships woven in with intention. Cannes, without the noise.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <Link
                  href="/events/cannes-lions-2026"
                  className="inline-flex items-center px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-85"
                  style={{ background: ACCENT, color: SURFACE_DARK }}
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
            </Reveal>
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
          <Reveal className="mb-12 flex items-end justify-between gap-6">
            <div>
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: INK_MUTED }}>
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
          </Reveal>

          <Reveal>
            <div className="grid grid-cols-3 gap-5" style={{ gridTemplateRows: "240px 240px" }}>
              {GALLERY_PREVIEW.map((item, i) => (
                <Link
                  key={i}
                  href="/gallery"
                  className={`group relative block overflow-hidden no-underline ${item.span}`}
                  style={{ borderRadius: 2 }}
                >
                  <BlurImage
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                    placeholder="blur"
                    blurDataURL={blurForSrc(item.src)}
                    sizes="(max-width: 640px) 50vw, 33vw"
                    unoptimized
                  />
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Partners ───────────────────────────────────────────── */}
      <section
        id="partners"
        className="relative overflow-hidden border-t px-8 sm:px-14"
        style={{ paddingTop: "9rem", paddingBottom: "9rem", borderColor: RULE, background: SURFACE_DARK }}
      >
        <BlurImage
          src={PARTNER_SRC}
          alt="Guests gathered at a Culturin partner evening"
          fill
          className="object-cover opacity-25"
          placeholder="blur"
          blurDataURL={blurForSrc(PARTNER_SRC)}
          sizes="100vw"
        />
        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
            <Reveal as="div">
              <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: "rgba(232,227,218,0.6)" }}>
                For partners
              </p>
              <h2
                className="m-0 text-4xl font-medium leading-[1.1] text-white sm:text-5xl lg:text-6xl"
                style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
              >
                Let&apos;s build something that matters.
              </h2>
            </Reveal>
            <Reveal as="div" delay={120} className="flex flex-col justify-center gap-6">
              <p className="m-0 text-base leading-loose" style={{ color: "rgba(232,227,218,0.82)" }}>
                We partner with the world&apos;s leading brands to create cultural events with genuine gravity — from concept and guest curation to production and the story that outlives the night.
              </p>
              <p className="m-0 text-base leading-loose" style={{ color: "rgba(232,227,218,0.82)" }}>
                If you want to show up in culture in a way people actually remember, we should talk.
              </p>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <a
                  href="mailto:partners@culturin.com?subject=Partnering%20with%20Culturin"
                  className="inline-flex w-fit items-center px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-85"
                  style={{ background: ACCENT_ON_DARK, color: SURFACE_DARK }}
                >
                  Become a partner
                </a>
                <Link
                  href="/events"
                  className="text-xs font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-70"
                  style={{ color: "rgba(232,227,218,0.85)" }}
                >
                  See our events →
                </Link>
              </div>
            </Reveal>
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
            <Reveal as="div">
              <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: INK_MUTED }}>
                What we&apos;re building
              </p>
              <h2
                className="m-0 text-4xl font-medium leading-[1.1] sm:text-5xl"
                style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
              >
                A platform for culture, in time.
              </h2>
            </Reveal>
            <Reveal as="div" delay={120} className="flex flex-col justify-center gap-6">
              <p className="m-0 text-base leading-loose" style={{ color: INK_MUTED }}>
                Behind the events, we are building Culturin as a platform — a cultural intelligence layer for brands, institutions, and travellers who want to move through the world with more depth and less noise.
              </p>
              <p className="m-0 text-base leading-loose" style={{ color: INK_MUTED }}>
                For now, everything starts with the room. Come be in one.
              </p>
              <Link
                href="/events"
                className="mt-2 inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-60"
                style={{ color: INK }}
              >
                Explore upcoming events →
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <HomeFooter />
    </div>
  );
}
