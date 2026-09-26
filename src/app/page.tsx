import type { Metadata } from "next";
import Link from "next/link";

import { galleryHrefForEvent } from "@/lib/eventsData";
import { getEvents } from "@/lib/events/eventsStore";
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
import WordReveal from "./components/motion/WordReveal";
import HomeFooter from "./components/HomeFooter";
import SiteHeader from "./components/SiteHeader";
import LogoTicker, { type LogoTickerItem } from "./components/LogoTicker";
import HeroSlideshow, { type HeroSlide } from "./components/HeroSlideshow";
import AttendeeOriginMap from "./components/AttendeeOriginMap";
import MagneticButton from "./components/motion/MagneticButton";
import { getSiteImagesMap, resolveSiteImage, resolveEventHero, manifestDefault } from "@/lib/siteImages";
import { largeEventMediaSrc } from "@/lib/eventMedia";
import { getCmsDbOrNull } from "@/lib/cms/server";
import { listBlogs } from "@/lib/cms/queries";
import { cmsImageUnoptimized, resolveContentImageSrc } from "@/lib/imagePlaceholder";
import SafeContentImage from "./components/SafeContentImage";
import { SERVICES } from "@/lib/services";

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

const HERO_SLIDE_SLOTS = ["homepage-hero", "homepage-hero-2", "homepage-hero-3", "homepage-hero-4"] as const;

const PRODUCTION_HISTORY: LogoTickerItem[] = [
  { name: "Super Bowl", logoSrc: "/partners/super-bowl.webp" },
  { name: "UN Assembly", logoSrc: "/partners/unga-logo.png" },
  { name: "Nike", logoSrc: "/partners/nike-logo.svg", heightClass: "h-6" },
  { name: "Virgin", logoSrc: "/partners/virgin-logo.webp" },
  { name: "Microsoft", logoSrc: "/partners/microsoft.webp", heightClass: "h-14" },
  { name: "Aman", logoSrc: "/partners/aman-logo.png", heightClass: "h-5" },
];

const PROOF_STATS = [
  { value: "500+", label: "Guests at Culturin × Cannes Lions 2026" },
  { value: "12", label: "Countries in the room" },
  { value: "4", label: "Cities: Cannes, New York, London, Miami" },
  { value: "Super Bowl · Oscars · Davos · UNGA", label: "Where our team has produced cultural moments", small: true },
] as const;

const EVENT_GRID_COLS: Record<number, string> = { 1: "sm:grid-cols-1", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3" };

/** Short city label pulled from a full location string, for Trippin-style tag chips. */
function cityTag(location: string): string {
  return location.split(",")[0]?.trim() ?? location;
}

export default async function HomePage() {
  const events = await getEvents();
  const featuredEvents = events.filter((e) => !e.isPast).slice(0, 3);
  const cannesRecapEvent = events.find((e) => e.slug === "cannes-lions-2026");
  const siteImages = await getSiteImagesMap();
  const heroSlides: HeroSlide[] = HERO_SLIDE_SLOTS.map((key) => {
    const image = resolveSiteImage(siteImages, key, manifestDefault(key));
    return {
      ...image,
      src: largeEventMediaSrc(image.src),
      fallbackSrc: image.src,
      caption: image.alt,
      blurDataURL: blurForSrc(image.src),
    };
  }).filter((slide) => slide.src);
  const cannesSection = resolveSiteImage(siteImages, "homepage-cannes-section", manifestDefault("homepage-cannes-section"));
  const services = SERVICES.map((s) => ({
    ...s,
    image: resolveSiteImage(siteImages, `homepage-service-${s.slug}`, manifestDefault(`homepage-service-${s.slug}`)),
  }));
  const db = getCmsDbOrNull();
  const latestStories = db
    ? (await listBlogs(db)).filter((a) => a.currentSlug?.trim()).slice(0, 3)
    : [];

  return (
    <div style={{ background: BG, color: INK }} className={`${editorialScopeClass} font-sans antialiased`}>

      {/* ── Dynamic island nav ─────────────────────────────────── */}
      <SiteHeader />

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="px-3 pb-3 pt-[4.75rem] sm:px-4 sm:pb-4 sm:pt-20">
        <HeroSlideshow
          slides={heroSlides}
          left={
            <Reveal y={32}>
              <h1
                className="m-0 max-w-2xl text-4xl font-medium leading-[1.05] text-white sm:text-5xl lg:text-6xl"
                style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
              >
                We connect the world through Culture.
              </h1>
            </Reveal>
          }
          right={
            <Reveal y={24} delay={120} className="flex flex-col items-start md:items-end">
              <p className="m-0 max-w-sm text-sm leading-relaxed text-white/80 sm:text-base">
                Culturin brings leaders of industry together to create culturally significant experiences, and equip brands with the intelligence to win.
              </p>
              <MagneticButton strength={0.35} className="mt-6 w-fit">
                <Link
                  href="/reports/the-irl-advantage"
                  className="inline-flex items-center rounded-full px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-85"
                  style={{ background: ACCENT, color: SURFACE_DARK }}
                >
                  Download our briefing
                </Link>
              </MagneticButton>
            </Reveal>
          }
        />
      </section>

      {/* ── Client logos ───────────────────────────────────────── */}
      <section
        className="flex flex-col gap-4 px-8 py-8 sm:flex-row sm:items-center sm:gap-10 sm:px-14 sm:py-10"
        aria-label="Trusted by"
      >
        <p
          className="m-0 shrink-0 text-[10px] font-semibold uppercase tracking-[0.25em]"
          style={{ color: INK_MUTED }}
        >
          Trusted by
        </p>
        <div className="min-w-0 flex-1">
          <LogoTicker items={PRODUCTION_HISTORY} ink={INK_MUTED} />
        </div>
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
            <WordReveal
              className="m-0 text-4xl font-medium leading-[1.1] sm:text-5xl"
              style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
              accent={ACCENT}
              segments={[
                { text: "We create" },
                { text: "iconic moments", highlight: true },
                { text: "at the pinnacle of culture." },
              ]}
            />
            <div className="flex flex-col gap-6">
              <Reveal delay={450} y={32}>
                <p className="m-0 text-base leading-loose" style={{ color: INK_MUTED }}>
                  We put the right people in the same room, and help brands enter new territories with cultural intelligence, through the rooms, the stories, and the marketing that holds them.
                </p>
              </Reveal>
              <Reveal delay={650} y={32}>
                <p className="m-0 text-base leading-loose" style={{ color: INK_MUTED }}>
                  Our team has produced cultural moments at the Super Bowl, the Oscars, Davos, the Cannes Film Festival, and the UN Assembly. We bring that same care to every room we build, for our community, and for the partners who build alongside us.
                </p>
              </Reveal>
            </div>
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
          <Reveal className="mb-12 flex items-end justify-between gap-6">
            <div>
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: INK_MUTED }}>
                Where we&apos;ll be
              </p>
              <h2
                className="m-0 text-4xl font-medium leading-[1.08] sm:text-5xl"
                style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
              >
                Upcoming experiences
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

          <div className={`grid grid-cols-1 gap-px ${EVENT_GRID_COLS[featuredEvents.length] ?? "sm:grid-cols-3"}`} style={{ background: RULE }}>
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

      {/* ── Services ───────────────────────────────────────────── */}
      <section
        id="services"
        className="px-8 sm:px-14"
        style={{ paddingTop: "8rem", paddingBottom: "8rem" }}
      >
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: INK_MUTED }}>
                How brands work with us
              </p>
              <h2
                className="m-0 text-4xl font-medium leading-[1.08] sm:text-5xl"
                style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
              >
                Three ways to work with Culturin.
              </h2>
            </div>
            <p className="m-0 max-w-sm text-base leading-relaxed" style={{ color: INK_MUTED }}>
              Launch in a new territory with the room already built. Not every brand needs all three. Most start with one.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.slug} as="div" delay={i * 140} y={48} className="h-full">
                <Link
                  href={`/services/${s.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border no-underline transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_28px_56px_-28px_rgba(0,0,0,0.6)]"
                  style={{ borderColor: RULE, background: `color-mix(in srgb, ${INK} 4%, ${BG})`, color: INK }}
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <BlurImage
                      src={s.image.src}
                      alt={s.image.alt}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-[1200ms] ease-out group-hover:!scale-[1.06]"
                      placeholder="blur"
                      blurDataURL={blurForSrc(s.image.src)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/70">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <h3
                        className="m-0 mt-2 text-3xl font-medium text-white"
                        style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
                      >
                        {s.label}
                      </h3>
                      <p className="m-0 mt-2 text-sm leading-relaxed text-white/85">{s.promise}</p>
                    </div>
                  </div>
                  <div className="flex flex-1 items-center px-6 pb-6 pt-5">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] transition-transform duration-300 group-hover:translate-x-1" style={{ color: INK }}>
                      Explore {s.label} →
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Latest stories ─────────────────────────────────────── */}
      {latestStories.length > 0 ? (
        <section
          id="stories"
          className="border-t px-8 sm:px-14"
          style={{ paddingTop: "8rem", paddingBottom: "8rem", borderColor: RULE }}
        >
          <div className="mx-auto max-w-6xl">
            <Reveal className="mb-12 flex items-end justify-between gap-6">
              <div>
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: INK_MUTED }}>
                  Stories
                </p>
                <h2
                  className="m-0 text-4xl font-medium leading-[1.08] sm:text-5xl"
                  style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
                >
                  Stories from the room.
                </h2>
              </div>
              <Link
                href="/articles"
                className="shrink-0 text-xs font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-60"
                style={{ color: INK }}
              >
                All stories →
              </Link>
            </Reveal>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {latestStories.map((story, i) => {
                const src = resolveContentImageSrc(story.titleImageUrl);
                return (
                  <Reveal key={story.currentSlug} as="div" delay={i * 120} className="h-full">
                    <Link href={`/articles/${story.currentSlug}`} className="group flex h-full flex-col no-underline" style={{ color: INK }}>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-900">
                        <SafeContentImage
                          src={src}
                          alt={story.title}
                          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                          sizes="(min-width: 768px) 33vw, 100vw"
                          blurDataURL={blurForSrc(src)}
                          unoptimized={cmsImageUnoptimized(src)}
                        />
                      </div>
                      <h3
                        className="m-0 mt-5 line-clamp-2 text-xl font-medium leading-snug"
                        style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
                      >
                        {story.title}
                      </h3>
                      {story.summary?.trim() ? (
                        <p className="m-0 mt-2 line-clamp-2 text-sm leading-relaxed" style={{ color: INK_MUTED }}>
                          {story.summary}
                        </p>
                      ) : null}
                      <span className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] transition-transform duration-200 group-hover:translate-x-1" style={{ color: INK }}>
                        Read →
                      </span>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Proof in numbers ───────────────────────────────────── */}
      <section className="border-t px-8 sm:px-14" style={{ borderColor: RULE }}>
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px lg:grid-cols-4" style={{ background: RULE }}>
          {PROOF_STATS.map((stat, i) => (
            <Reveal key={stat.label} as="div" delay={i * 100} className="h-full">
              <div className="flex h-full flex-col justify-between gap-4 px-6 py-12" style={{ background: BG }}>
                <p
                  className={`m-0 font-medium leading-[1.05] ${"small" in stat ? "text-xl sm:text-2xl" : "text-5xl sm:text-6xl"}`}
                  style={{ fontFamily: "var(--font-display), 'Times New Roman', serif", color: INK }}
                >
                  {stat.value}
                </p>
                <p className="m-0 text-xs leading-relaxed" style={{ color: INK_MUTED }}>
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
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
              Event recap · Culturin at Cannes Lions 2026
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
