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
import IslandNav from "./components/IslandNav";
import LogoTicker, { type LogoTickerItem } from "./components/LogoTicker";
import AttendeeOriginMap from "./components/AttendeeOriginMap";

export const metadata: Metadata = {
  title: "Culturin | Where Inspiration Meets Exploration",
  description:
    "Culturin is a curated travel & culture company, with stories, curated events, and cultural education for people who want to experience the world with more depth.",
};

const BG = EDITORIAL_BG;
const INK = EDITORIAL_INK;
const INK_MUTED = EDITORIAL_MUTED;
const RULE = EDITORIAL_RULE;
const ACCENT = EDITORIAL_ACCENT;

const HERO_SRC = "/events/cannes-lions-2026/UNIKday1-71.jpg";
const CANNES_SRC = "/events/cannes-lions-2026/UNIKday1-2.jpg";
const PARALLAX_SRC = "/events/cannes-lions-2026/UNIKday1-54.jpg";

const PRESS_MENTIONS = [
  {
    publication: "Digiday",
    headline: "Meet the man behind Cannes Lions' most exclusive parties",
    description:
      "On Culturin, the media and travel company founded in 2024 that blends brand storytelling, cultural insight, and local knowledge across campaigns, content, and activations.",
    href: "https://digiday.com/marketing/meet-the-man-behind-cannes-lions-most-exclusive-parties/",
  },
  {
    publication: "CNBC Africa",
    headline: "Resolving Africa's geopolitics to unlock global opportunities",
    description:
      "Culturin founder Unik Ernest on diplomatic engagement, corruption, and unlocking economic opportunity across the continent.",
    href: "https://www.cnbcafrica.com/media/7756747595504/resolving-africas-geopolitics-to-unlock-global-opportunities-",
  },
  {
    publication: "CEO Weekly",
    headline: "Unik Ernest's Culturin Afterparty Series Celebrates Culture, Community, and Philanthropy",
    description:
      "“The world needs more beautiful stories,” Ernest said of the series, which showcased diverse entertainment experiences across five nights in Cannes.",
    href: "https://ceoweekly.com/unik-ernests-culturin-afterparty-series/",
  },
  {
    publication: "News Diary",
    headline: "Cannes Lions: Unik Ernest to host Culturin afterparty",
    description:
      "Business strategist and cultural architect Unik Ernest hosted the Culturin Afterparty Series during the Cannes Lions International Festival of Creativity.",
    href: "https://newsdiaryonline.com/cannes-lions-unik-ernest-to-host-culturin-afterparty-5-all-star-events/",
  },
] as const;

const GALLERY_PREVIEW = [
  { src: "/events/cannes-lions-2026/UNIKday1-34.jpg", alt: "Two guests portrait at a Culturin night in Cannes", span: "row-span-2" },
  { src: "/events/cannes-lions-2026/UNIKday1-41.jpg", alt: "Guests gathered together in a red-lit lounge in Cannes", span: "" },
  { src: "/events/cannes-lions-2026/UNIKday1-48.jpg", alt: "Guests laughing together in a red-lit lounge in Cannes", span: "" },
  { src: "/events/cannes-lions-2026/UNIKday1-26.jpg", alt: "Disco balls above the crowd in Cannes", span: "" },
  { src: "/events/cannes-lions-2026/UNIKday1-38.jpg", alt: "Guests posing together at a Culturin evening in Cannes", span: "" },
];

const PILLARS = [
  {
    label: "Content & culture",
    body: "Articles, video, and live conversations with artists, musicians, and cultural leaders about travel and identity.",
  },
  {
    label: "Curated events",
    body: "Dinners, festivals, and gatherings distributed across global locales, from Cannes to New York and beyond.",
  },
  {
    label: "Education",
    body: "Cultural literacy programming that goes beyond the trip, helping travelers understand, not just visit, the places they explore.",
  },
  {
    label: "Brand credibility",
    body: "Built by a team with production history at the Super Bowl, the Oscars, Davos, Cannes, and the UN Assembly.",
  },
];

const PRODUCTION_HISTORY: LogoTickerItem[] = [
  { name: "Super Bowl", logoSrc: "/partners/super-bowl.webp" },
  { name: "Davos", logoSrc: "/partners/davos-logo.svg" },
  { name: "UN Assembly", logoSrc: "/partners/unga-logo.png" },
  { name: "Nike", logoSrc: "/partners/nike-logo.svg" },
  { name: "Virgin", logoSrc: "/partners/virgin-logo.webp" },
  { name: "Microsoft", logoSrc: "/partners/microsoft.webp" },
];

const featuredEvents = events.filter((e) => !e.isPast).slice(0, 3);

/** Short city label pulled from a full location string, for Trippin-style tag chips. */
function cityTag(location: string): string {
  return location.split(",")[0]?.trim() ?? location;
}

export default function HomePage() {
  return (
    <div style={{ background: BG, color: INK }} className={`${editorialScopeClass} font-sans antialiased`}>

      {/* ── Dynamic island nav ─────────────────────────────────── */}
      <IslandNav />

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section
        className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-8 text-center sm:px-14"
      >
        <BlurImage
          src={HERO_SRC}
          alt="A packed room at a Culturin night, red lighting and neon signage"
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
              "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.6) 100%)",
          }}
        />
        <Reveal className="relative z-10 mx-auto flex max-w-2xl flex-col items-center" y={32}>
          <h1
            className="m-0 text-4xl font-medium leading-[1.08] text-white sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
          >
            Where inspiration meets exploration.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/75">
            Culturin is a curated travel &amp; culture company, with stories, curated events, and cultural education for people who want to experience the world with more depth.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/55">
            <span>Cannes</span>
            <span>New York</span>
            <span>London</span>
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
                Culture is not just a state of being. It&apos;s an action.
              </h2>
            </Reveal>
            <Reveal as="div" delay={120} className="flex flex-col gap-6">
              <p className="m-0 text-base leading-loose" style={{ color: INK_MUTED }}>
                Culturin is a curated travel &amp; education company. Our goal is to help people learn and embody the art of culture, through stories, curated events, and experiences that go beyond the postcard version of a place.
              </p>
              <p className="m-0 text-base leading-loose" style={{ color: INK_MUTED }}>
                Our team has produced culture at the Super Bowl, the Oscars, Davos, the Cannes Film Festival, and the UN Assembly. We bring that same care to every room we build, for our community, and for the partners who build alongside us.
              </p>
            </Reveal>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4" style={{ background: RULE }}>
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

          {/* Production history: team credentials, not claimed active sponsorships */}
          <div className="mt-16 border-t pt-10" style={{ borderColor: RULE }}>
            <Reveal delay={200}>
              <p className="mb-10 text-center text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: INK_MUTED }}>
                Our team&apos;s production history includes
              </p>
              <LogoTicker items={PRODUCTION_HISTORY} ink={INK_MUTED} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Editorial statements (OPUS-style alternating narrative) ── */}
      <section className="px-8 sm:px-14" style={{ paddingTop: "8rem", paddingBottom: "8rem" }}>
        <div className="mx-auto flex max-w-6xl flex-col gap-28">
          <EditorialStatement
            eyebrow="Education"
            headline={"Culture Is\nSomething You\nLearn, Not Just\nSee."}
            body="Most travel platforms show you a destination. Culturin teaches you how to actually engage with it: the history, the etiquette, and the stories beneath the surface, before you ever board a flight."
            image="/events/cannes-lions-2026/UNIKday1-83.jpg"
            imageAlt="Guests filling a red-lit room beneath the disco balls in Cannes"
            imageSide="right"
            buttons={[
              { label: "Explore travel guides", href: "/travel-guides/nice-and-cannes", variant: "solid" },
              { label: "Partner with us", href: "/partner", variant: "text" },
            ]}
          />
          <EditorialStatement
            eyebrow="Content"
            headline={"Stories From\nThe Room."}
            body="Articles and video from artists, musicians, and entrepreneurs about travel, identity, and culture, captured from the same rooms Culturin builds."
            image="/events/cannes-lions-2026/UNIKday2-24.jpg"
            imageAlt="Couple posing together at a branded photo wall in Cannes"
            imageSide="left"
            buttons={[
              { label: "See upcoming events", href: "/events", variant: "solid" },
              { label: "Partner with us", href: "/partner", variant: "text" },
            ]}
          />
          <EditorialStatement
            eyebrow="Credibility"
            headline={"Built By People\nWho've Done\nThis Before."}
            body="Our founding team has produced culture at the Super Bowl, the Oscars, Davos, the Cannes Film Festival, and the UN Assembly, and built relationships with Nike, Virgin, and Microsoft along the way."
            image="/events/cannes-lions-2026/UNIKday1-42.jpg"
            imageAlt="Guest at a Culturin evening in Cannes"
            imageSide="right"
            buttons={[
              { label: "Partner with us", href: "/partner", variant: "solid" },
              { label: "See upcoming events", href: "/events", variant: "text" },
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
                  <div
                    className="relative aspect-[4/3] overflow-hidden"
                    style={{ background: event.heroImage ? undefined : SURFACE_DARK }}
                  >
                    {event.heroImage ? (
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
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="m-0 px-6 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
                          Photos coming soon
                        </p>
                      </div>
                    )}
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
              Culturin at Cannes Lions 2026
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
                This June, the world&apos;s creative industry, CMOs, agency founders, artists, and brand builders, descended on a small city on the French Riviera for Cannes Lions. By day it was awards and panels. The real conversations happened after dark.
              </p>
              <p className="mt-5 text-base leading-loose" style={{ color: INK_MUTED }}>
                Culturin built those nights. Curated guest lists, live music, warm rooms, and brand partnerships woven in with intention. Cannes, without the noise.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <Link
                  href="/events/cannes-lions-2026"
                  className="inline-flex items-center rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-85"
                  style={{ background: ACCENT, color: SURFACE_DARK }}
                >
                  View the recap
                </Link>
                <Link
                  href="/gallery"
                  className="text-xs font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-60"
                  style={{ color: INK }}
                >
                  See the gallery →
                </Link>
              </div>
              <Link
                href="/travel-guides/nice-and-cannes"
                className="mt-6 inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-60"
                style={{ color: INK_MUTED }}
              >
                Business travel guide to Nice &amp; Cannes →
              </Link>
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
                  style={{ borderRadius: 16 }}
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
                We partner with the world&apos;s leading consumer and lifestyle brands on cultural programming built around marquee moments, Cannes Lions, the US Open, the UN General Assembly, and beyond. Every room we build delivers a curated, high-caliber audience: high-net-worth individuals, senior executives, and cultural tastemakers who actually show up.
              </p>
              <p className="m-0 text-base leading-loose" style={{ color: "rgba(232,227,218,0.82)" }}>
                If you want your brand in the room where the real conversations happen, not just a name on a step-and-repeat, we should talk.
              </p>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <Link
                  href="/partner"
                  className="inline-flex w-fit items-center rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-85"
                  style={{ background: ACCENT_ON_DARK, color: SURFACE_DARK }}
                >
                  Become a partner
                </Link>
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

      {/* ── Where our community comes from ────────────────────── */}
      <section
        className="border-t px-8 sm:px-14"
        style={{ paddingTop: "8rem", paddingBottom: "8rem", borderColor: RULE, background: SURFACE_DARK }}
      >
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-12 text-center">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: "rgba(232,227,218,0.6)" }}>
              A global room
            </p>
            <h2
              className="m-0 text-4xl font-medium leading-[1.08] text-white sm:text-5xl"
              style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
            >
              People travel for the rooms we build.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <AttendeeOriginMap />
          </Reveal>
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
                What&apos;s next
              </p>
              <h2
                className="m-0 text-4xl font-medium leading-[1.1] sm:text-5xl"
                style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
              >
                From real conversations to a global festival.
              </h2>
            </Reveal>
            <Reveal as="div" delay={120} className="flex flex-col justify-center gap-6">
              <p className="m-0 text-base leading-loose" style={{ color: INK_MUTED }}>
                We launched with real conversations, artists, musicians, and entrepreneurs talking about travel and culture. Since then we&apos;ve been building out curated events, a growing content library, and the beginning of a real marketplace.
              </p>
              <p className="m-0 text-base leading-loose" style={{ color: INK_MUTED }}>
                Next: certified cultural training programs, a first Culturin festival, and a production company built for cultural programming at the scale our team already knows, the Super Bowl, the Oscars, the UN Assembly.
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

      {/* ── Press ──────────────────────────────────────────────── */}
      <section
        id="press"
        className="border-t px-8 sm:px-14"
        style={{ paddingTop: "8rem", paddingBottom: "8rem", borderColor: RULE }}
      >
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-12">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: INK_MUTED }}>
              In the press
            </p>
            <h2
              className="m-0 text-4xl font-medium leading-[1.08] sm:text-5xl"
              style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
            >
              What people are saying.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2">
            {PRESS_MENTIONS.map((item, i) => (
              <Reveal key={item.href} delay={(i % 2) * 90}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block border-t pt-6 no-underline"
                  style={{ borderColor: RULE }}
                >
                  <p
                    className="m-0 text-[10px] font-semibold uppercase tracking-[0.2em] transition-opacity group-hover:opacity-70"
                    style={{ color: ACCENT }}
                  >
                    {item.publication}
                  </p>
                  <h3
                    className="m-0 mt-3 text-xl font-medium leading-snug sm:text-2xl"
                    style={{ color: INK, fontFamily: "var(--font-display), 'Times New Roman', serif" }}
                  >
                    {item.headline}
                  </h3>
                  <p className="m-0 mt-3 text-sm leading-relaxed" style={{ color: INK_MUTED }}>
                    {item.description}
                  </p>
                  <span
                    className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] transition-opacity group-hover:opacity-60"
                    style={{ color: INK }}
                  >
                    Read the piece →
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <HomeFooter />
    </div>
  );
}
