import type { Metadata } from "next";
import Link from "next/link";

import { events, galleryHrefForEvent } from "@/lib/eventsData";
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
import BlurImage from "./components/motion/BlurImage";
import Reveal from "./components/motion/Reveal";
import ParallaxReveal from "./components/motion/ParallaxReveal";
import EditorialStatement from "./components/EditorialStatement";
import HomeFooter from "./components/HomeFooter";
import SiteHeader from "./components/SiteHeader";
import LogoTicker, { type LogoTickerItem } from "./components/LogoTicker";
import AttendeeOriginMap from "./components/AttendeeOriginMap";
import MagneticButton from "./components/motion/MagneticButton";
import { getSiteImagesMap, resolveSiteImage, resolveEventHero, manifestDefault } from "@/lib/siteImages";
import { eventMediaUrl } from "@/lib/eventMedia";

/** Site images can change in Admin; revalidatePath("/") runs on update. */
export const revalidate = 120;

export const metadata: Metadata = {
  title: "Culturin | Cultural Marketing",
  description:
    "Culturin is a network of founders, operators, artists, and cultural leaders. Brands come to us for cultural marketing: launching in new territories, and connecting with cultural intelligence.",
};

const BG = EDITORIAL_BG;
const INK = EDITORIAL_INK;
const INK_MUTED = EDITORIAL_MUTED;
const RULE = EDITORIAL_RULE;
const ACCENT = EDITORIAL_ACCENT;

const GALLERY_PREVIEW_SLOTS = [
  { key: "homepage-preview-1", span: "row-span-2" },
  { key: "homepage-preview-2", span: "" },
  { key: "homepage-preview-3", span: "" },
  { key: "homepage-preview-4", span: "" },
  { key: "homepage-preview-5", span: "" },
] as const;

const PILLARS = [
  {
    label: "The rooms",
    body: "Dinners, festivals, and gatherings at the year's cultural moments: Cannes, New York, London, and the nights in between.",
  },
  {
    label: "The stories",
    body: "Articles, video, and conversations with artists, musicians, founders, and operators, captured from the same rooms we build.",
  },
  {
    label: "Cultural marketing",
    body: "Brands come to Culturin to launch in new territories and connect with cultural intelligence. Write to us and we'll set up a call.",
  },
  {
    label: "The record",
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

const SERVICES = [
  {
    label: "Intelligence",
    body: "An ongoing read on what's moving in culture, and what it means for your brand: monthly reports, competitor monitoring, and quarterly strategy sessions.",
    price: "From £3,000 / month",
    cta: "Talk to us about Intelligence",
  },
  {
    label: "Programming",
    body: "Culturin becomes your external cultural programming partner for the year: strategy, curation, and a season of rooms built around your brand.",
    price: "£50,000–£150,000+ / year",
    cta: "Talk to us about Programming",
  },
  {
    label: "Moments",
    body: "Sponsor a room already built: Cannes, Frieze, Basel, and the nights in between, with your brand woven in with intention.",
    price: "From £20,000",
    cta: "Talk to us about Moments",
  },
] as const;

const featuredEvents = events.filter((e) => !e.isPast).slice(0, 3);
const cannesRecapEvent = events.find((e) => e.slug === "cannes-lions-2026");

/** Short city label pulled from a full location string, for Trippin-style tag chips. */
function cityTag(location: string): string {
  return location.split(",")[0]?.trim() ?? location;
}

export default async function HomePage() {
  const siteImages = await getSiteImagesMap();
  const hero = resolveSiteImage(siteImages, "homepage-hero", manifestDefault("homepage-hero"));
  const cannesSection = resolveSiteImage(siteImages, "homepage-cannes-section", manifestDefault("homepage-cannes-section"));
  const parallax = resolveSiteImage(siteImages, "homepage-parallax", manifestDefault("homepage-parallax"));
  const galleryPreview = GALLERY_PREVIEW_SLOTS.map((slot) => ({
    ...resolveSiteImage(siteImages, slot.key, manifestDefault(slot.key)),
    span: slot.span,
  }));

  return (
    <div style={{ background: BG, color: INK }} className={`${editorialScopeClass} font-sans antialiased`}>

      {/* ── Dynamic island nav ─────────────────────────────────── */}
      <SiteHeader />

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="px-3 pb-3 pt-[4.75rem] sm:px-4 sm:pb-4 sm:pt-20">
        <div className="relative flex min-h-[calc(100dvh-5.5rem)] flex-col items-center justify-center overflow-hidden rounded-3xl px-8 text-center sm:min-h-[calc(100dvh-6.5rem)] sm:rounded-[2rem] sm:px-14">
          <BlurImage
            src={hero.src}
            alt={hero.alt}
            fill
            priority
            className="object-cover"
            placeholder="blur"
            blurDataURL={blurForSrc(hero.src)}
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.6) 100%)",
            }}
          />
          <Reveal className="relative z-10 mx-auto flex max-w-3xl flex-col items-center" y={32}>
            <h1
              className="m-0 text-4xl font-medium leading-[1.08] text-white sm:text-5xl lg:text-6xl"
              style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
            >
              We connect the world through Culture.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75">
              Culturin brings leaders of industry together to create culturally significant experiences, and equip brands with the intelligence to win.
            </p>
            <MagneticButton strength={0.35} className="mt-8 w-fit">
              <Link
                href="/partner"
                className="inline-flex items-center rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-85"
                style={{ background: ACCENT, color: SURFACE_DARK }}
              >
                Create an experience
              </Link>
            </MagneticButton>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/55">
              <span>Cannes</span>
              <span>New York</span>
              <span>London</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Client logos ───────────────────────────────────────── */}
      <section className="px-8 py-8 sm:px-14 sm:py-10" aria-label="Production history">
        <LogoTicker items={PRODUCTION_HISTORY} ink={INK_MUTED} />
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
                We create iconic moments at the pinnacle of culture.
              </h2>
            </Reveal>
            <Reveal as="div" delay={120} className="flex flex-col gap-6">
              <p className="m-0 text-base leading-loose" style={{ color: INK_MUTED }}>
                We put the right people in the same room, and help brands enter new territories with cultural intelligence, through the rooms, the stories, and the marketing that holds them.
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
        </div>
      </section>

      {/* ── Editorial statements (OPUS-style alternating narrative) ── */}
      <section className="px-8 sm:px-14" style={{ paddingTop: "8rem", paddingBottom: "8rem" }}>
        <div className="mx-auto flex max-w-6xl flex-col gap-28">
          <EditorialStatement
            eyebrow="Cultural marketing"
            headline={"Launch In A\nNew Territory\nWith The Room\nAlready Built."}
            body="Brands come to Culturin for cultural marketing: how to launch in a new territory, and how to connect with cultural intelligence. Write to us. We'll set up a call."
            image={eventMediaUrl("cannes-lions-2026/UNIKday1-83.jpg")}
            imageAlt="Guests filling a red-lit room beneath the disco balls in Cannes"
            imageSide="right"
            buttons={[
              { label: "Create an experience", href: "/partner", variant: "solid" },
              { label: "See upcoming events", href: "/events", variant: "text" },
            ]}
          />
          <EditorialStatement
            eyebrow="Stories"
            headline={"Stories From\nThe Room."}
            body="Articles and video from artists, musicians, and founders, captured from the same rooms Culturin builds."
            image={eventMediaUrl("cannes-lions-2026/UNIKday2-24.jpg")}
            imageAlt="Couple posing together at a branded photo wall in Cannes"
            imageSide="left"
            buttons={[
              { label: "See upcoming events", href: "/events", variant: "solid" },
              { label: "Create an experience", href: "/partner", variant: "text" },
            ]}
          />
          <EditorialStatement
            eyebrow="Credibility"
            headline={"Built By People\nWho've Done\nThis Before."}
            body="Our founding team has produced culture at the Super Bowl, the Oscars, Davos, the Cannes Film Festival, and the UN Assembly, and built relationships with Nike, Virgin, and Microsoft along the way."
            image={eventMediaUrl("cannes-lions-2026/UNIKday1-42.jpg")}
            imageAlt="Guest at a Culturin evening in Cannes"
            imageSide="right"
            buttons={[
              { label: "Create an experience", href: "/partner", variant: "solid" },
              { label: "See upcoming events", href: "/events", variant: "text" },
            ]}
          />
        </div>
      </section>

      {/* ── Parallax movement break (Goals House-style pinned scroll) ── */}
      <ParallaxReveal
        src={parallax.src}
        alt={parallax.alt}
        blurDataURL={blurForSrc(parallax.src)}
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
            {featuredEvents.map((event, i) => {
              const eventHero = resolveEventHero(siteImages, event);
              return (
              <Reveal key={event.slug} as="div" delay={i * 120}>
                <Link
                  href={`/events/${event.slug}`}
                  className="group relative flex h-full flex-col no-underline"
                  style={{ background: BG, color: INK }}
                >
                  <div
                    className="relative aspect-[4/3] overflow-hidden"
                    style={{ background: eventHero ? undefined : SURFACE_DARK }}
                  >
                    {eventHero ? (
                      <BlurImage
                        src={eventHero.src}
                        alt={eventHero.alt}
                        fill
                        className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                        placeholder="blur"
                        blurDataURL={blurForSrc(eventHero.src)}
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
              );
            })}
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
                src={cannesSection.src}
                alt={cannesSection.alt}
                fill
                className="object-cover"
                placeholder="blur"
                blurDataURL={blurForSrc(cannesSection.src)}
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
                  href={cannesRecapEvent ? galleryHrefForEvent(cannesRecapEvent) : "/gallery"}
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
                  Notes for Cannes →
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
              {galleryPreview.map((item, i) => (
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

      {/* ── Services (three ways to work with us) ─────────────── */}
      <section
        id="services"
        className="border-b px-8 sm:px-14"
        style={{ paddingTop: "8rem", paddingBottom: "8rem", borderColor: RULE }}
      >
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-16 max-w-2xl">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: INK_MUTED }}>
              How brands work with us
            </p>
            <h2
              className="m-0 text-4xl font-medium leading-[1.08] sm:text-5xl"
              style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
            >
              Intelligence. Programming. Moments.
            </h2>
            <p className="m-0 mt-6 text-base leading-relaxed" style={{ color: INK_MUTED }}>
              Not every brand needs all three. Most start with one.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 gap-px sm:grid-cols-3" style={{ background: RULE }}>
            {SERVICES.map((s, i) => (
              <Reveal key={s.label} as="div" delay={i * 120}>
                <div className="flex h-full flex-col px-8 py-10" style={{ background: BG }}>
                  <p
                    className="m-0 text-2xl font-medium"
                    style={{ fontFamily: "var(--font-display), 'Times New Roman', serif", color: INK }}
                  >
                    {s.label}
                  </p>
                  <p className="m-0 mt-4 flex-1 text-sm leading-relaxed" style={{ color: INK_MUTED }}>
                    {s.body}
                  </p>
                  <Link
                    href="/partner"
                    className="mt-6 inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] no-underline transition-opacity hover:opacity-60"
                    style={{ color: INK }}
                  >
                    {s.cta} →
                  </Link>
                </div>
              </Reveal>
            ))}
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
              They come from everywhere for the rooms we build.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <AttendeeOriginMap />
          </Reveal>
        </div>
      </section>

      <HomeFooter />
    </div>
  );
}
