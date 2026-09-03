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
import MagneticButton from "./components/motion/MagneticButton";
import { getSiteImagesMap, resolveSiteImage, resolveEventHero, manifestDefault } from "@/lib/siteImages";
import { eventMediaUrl } from "@/lib/eventMedia";

/** Site images can change in Studio; revalidatePath("/") runs on update. */
export const revalidate = 120;

export const metadata: Metadata = {
  title: "Culturin | A House",
  description:
    "Culturin is a house of founders, operators, artists, and cultural leaders. Brands come to us for cultural marketing — launching in new territories, and connecting with cultural intelligence.",
};

const BG = EDITORIAL_BG;
const INK = EDITORIAL_INK;
const INK_MUTED = EDITORIAL_MUTED;
const RULE = EDITORIAL_RULE;
const ACCENT = EDITORIAL_ACCENT;


const PRESS_MENTIONS = [
  {
    publication: "Digiday",
    headline: "Meet the man behind Cannes Lions' most exclusive parties",
    description:
      "On Culturin, the house founded in 2024 that blends brand storytelling, cultural insight, and local knowledge across campaigns, content, and activations.",
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
    body: "Dinners, festivals, and gatherings at the year's cultural moments — Cannes, New York, London, and the nights in between.",
  },
  {
    label: "The stories",
    body: "Articles, video, and conversations with artists, musicians, founders, and operators, captured from the same rooms we build.",
  },
  {
    label: "Cultural marketing",
    body: "Brands come to the house to launch in new territories and connect with cultural intelligence. Write to us — we'll set up a call.",
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
      <IslandNav />

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section
        className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-8 text-center sm:px-14"
      >
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
        {/* Fade to the page background so the hero blends into the next section instead of cutting off hard. Light mode's bg is a pale cream, which turned this into a washed-out haze over the photo, so it's dark-mode only. */}
        <div
          className="absolute inset-x-0 bottom-0 hidden h-[14dvh] dark:block"
          style={{ background: `linear-gradient(180deg, transparent 0%, ${BG} 100%)` }}
        />
        <Reveal className="relative z-10 mx-auto flex max-w-3xl flex-col items-center" y={32}>
          <h1
            className="m-0 text-4xl font-medium leading-[1.08] text-white sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
          >
            Culturin is a house.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75">
            Founders, operators, artists, and cultural leaders who come together at significant cultural moments throughout the year. Brands come to the house for cultural marketing — launching in new territories, and connecting with cultural intelligence.
          </p>
          <MagneticButton strength={0.35} className="mt-8 w-fit">
            <Link
              href="/partner"
              className="inline-flex items-center rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-85"
              style={{ background: ACCENT, color: SURFACE_DARK }}
            >
              Book a call
            </Link>
          </MagneticButton>
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
                Culture is not just a state of being. It&apos;s{" "}
                <span className="rounded-sm px-1.5 py-0.5" style={{ backgroundColor: "#e08a5b" }}>
                  an action
                </span>
                .
              </h2>
            </Reveal>
            <Reveal as="div" delay={120} className="flex flex-col gap-6">
              <p className="m-0 text-base leading-loose" style={{ color: INK_MUTED }}>
                Culturin is a house. We put the right people in the same room — and we help brands enter new territories with cultural intelligence, through the rooms, the stories, and the marketing that holds them.
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
            eyebrow="Cultural marketing"
            headline={"Launch In A\nNew Territory\nWith The Room\nAlready Built."}
            body="Brands come to the house for cultural marketing — how to launch in a new territory, and how to connect with cultural intelligence. Write to us. We'll set up a call."
            image={eventMediaUrl("cannes-lions-2026/UNIKday1-83.jpg")}
            imageAlt="Guests filling a red-lit room beneath the disco balls in Cannes"
            imageSide="right"
            buttons={[
              { label: "Book a call", href: "/partner", variant: "solid" },
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
              { label: "Book a call", href: "/partner", variant: "text" },
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
              { label: "Book a call", href: "/partner", variant: "solid" },
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
                Cultural marketing
              </p>
              <h2
                className="m-0 text-4xl font-medium leading-[1.1] text-white sm:text-5xl lg:text-6xl"
                style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
              >
                Launch with cultural intelligence.
              </h2>
            </Reveal>
            <Reveal as="div" delay={120} className="flex flex-col justify-center gap-6">
              <p className="m-0 text-base leading-loose" style={{ color: "rgba(232,227,218,0.82)" }}>
                Brands come to the house when they need to launch in a new territory, or to connect with the people who already shape culture there. That is cultural marketing: intelligence, rooms, and introductions — not a campaign bolted onto a place.
              </p>
              <p className="m-0 text-base leading-loose" style={{ color: "rgba(232,227,218,0.82)" }}>
                Write to us. We&apos;ll set up a call.
              </p>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <MagneticButton strength={0.35} className="w-fit">
                  <Link
                    href="/partner"
                    className="inline-flex w-fit items-center rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-85"
                    style={{ background: ACCENT_ON_DARK, color: SURFACE_DARK }}
                  >
                    Book a call
                  </Link>
                </MagneticButton>
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
              They come from everywhere for the rooms we build.
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
                We launched with real conversations — artists, musicians, and founders in the same room. Since then we&apos;ve been building curated events, a growing library of stories, and the house that holds them.
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

      {/* ── Collaborators ──────────────────────────────────────── */}
      <section className="border-t px-8 sm:px-14" style={{ paddingTop: "8rem", paddingBottom: "8rem", borderColor: RULE }}>
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-12">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: INK_MUTED }}>
              Collaborators
            </p>
            <h2
              className="m-0 max-w-2xl text-4xl font-medium leading-[1.08] sm:text-5xl"
              style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
            >
              Editorial voices we&apos;re proud to feature.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <a
              href="https://www.instagram.com/pontoon_co/"
              target="_blank"
              rel="noopener noreferrer"
              className="group grid grid-cols-1 gap-8 rounded-2xl border p-8 no-underline transition-colors sm:grid-cols-[auto_1fr] sm:items-center sm:p-10"
              style={{ borderColor: RULE }}
            >
              <p
                className="m-0 text-3xl font-medium sm:text-4xl"
                style={{ fontFamily: "var(--font-display), 'Times New Roman', serif", color: INK }}
              >
                Pontoon
              </p>
              <div>
                <p className="m-0 text-sm leading-relaxed" style={{ color: INK_MUTED }}>
                  Pontoon is an editorial community built around women who move through the world on their own
                  terms — photographers, writers, explorers, and makers who find meaning in motion. Culturin is
                  proud to feature Pontoon&apos;s work as part of our curated editorial program.
                </p>
                <span
                  className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] transition-opacity group-hover:opacity-60"
                  style={{ color: INK }}
                >
                  @pontoon_co on Instagram →
                </span>
              </div>
            </a>
          </Reveal>
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
