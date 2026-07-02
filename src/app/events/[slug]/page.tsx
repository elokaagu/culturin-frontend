import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getEventBySlug, events } from "@/lib/eventsData";
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
import BlurImage from "@/app/components/motion/BlurImage";
import Reveal from "@/app/components/motion/Reveal";
import RSVPForm from "./RSVPForm";

const BG = EDITORIAL_BG;
const INK = EDITORIAL_INK;
const INK_MUTED = EDITORIAL_MUTED;
const RULE = EDITORIAL_RULE;
const ACCENT = EDITORIAL_ACCENT;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return {};
  return {
    title: `${event.name} | Culturin`,
    description: event.subtagline,
  };
}

export default async function EventLandingPage({ params }: Props) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();

  const navItems = [
    { label: "VIBE", href: "#vibe" },
    { label: "WHO", href: "#who" },
    { label: "NUMBERS", href: "#numbers" },
    { label: "SIGNAL", href: "#signal" },
  ];

  return (
    <div style={{ background: BG, color: INK }} className={`${editorialScopeClass} min-h-dvh font-sans antialiased`}>

      {/* ── Sticky nav ───────────────────────────────────────────── */}
      <nav
        className="fixed inset-x-0 top-0 z-50 flex items-stretch"
        style={{ height: 44 }}
        aria-label="Event sections"
      >
        {/* Brand anchor */}
        <a
          href="#home"
          className="flex shrink-0 items-center px-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white no-underline"
          style={{ background: SURFACE_DARK }}
        >
          {event.navLabel}
        </a>

        {/* Section links */}
        <div className="flex flex-1 items-stretch border-b" style={{ borderColor: RULE }}>
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex flex-1 items-center justify-center text-[11px] font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-60"
              style={{ color: INK, borderRight: `1px solid ${RULE}` }}
            >
              {item.label}
            </a>
          ))}

          {/* RSVP CTA */}
          <a
            href="#rsvp"
            className="flex shrink-0 items-center px-6 text-[11px] font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-85"
            style={{ background: ACCENT, color: SURFACE_DARK }}
          >
            RSVP
          </a>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section
        id="home"
        className="relative flex min-h-dvh flex-col justify-end overflow-hidden pb-16 pl-8 sm:pl-14"
        style={{ paddingTop: 44 }}
      >
        <BlurImage
          src={event.heroImage}
          alt={event.heroImageAlt}
          fill
          priority
          className="object-cover"
          placeholder="blur"
          blurDataURL={blurForSrc(event.heroImage)}
          sizes="100vw"
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.1) 100%)" }}
        />

        <div className="relative z-10 max-w-3xl">
          {/* Culturin wordmark */}
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
            Culturin
          </p>
          <h1
            className="font-display m-0 whitespace-pre-line text-6xl font-semibold leading-[1.0] text-white sm:text-8xl"
            style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
          >
            {event.tagline}
          </h1>
          <p className="mt-5 text-sm font-medium uppercase tracking-[0.22em] text-white/70">
            {event.subtagline}
          </p>
          <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/50">
            Culture&nbsp;&nbsp;·&nbsp;&nbsp;Connection&nbsp;&nbsp;·&nbsp;&nbsp;Community
          </p>
        </div>
      </section>

      {/* ── Narrative sections (scattered photo layout) ───────────── */}
      {event.sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="relative overflow-visible px-8 sm:px-14"
          style={{ paddingTop: "12rem", paddingBottom: "12rem" }}
        >
          {/* Scattered photos — absolute within the tall section */}
          {section.photos.map((photo, i) => (
            <Reveal
              key={i}
              as="div"
              y={40}
              delay={i * 120}
              className={`absolute hidden lg:block ${photo.position}`}
            >
              <div className="overflow-hidden shadow-xl" style={{ borderRadius: 16 }}>
                <BlurImage
                  src={photo.src}
                  alt={photo.alt}
                  width={400}
                  height={520}
                  className="block object-cover"
                  style={{ width: "100%", height: "auto" }}
                  placeholder="blur"
                  blurDataURL={blurForSrc(photo.src)}
                  sizes="400px"
                  unoptimized
                />
              </div>
            </Reveal>
          ))}

          {/* Text content — sits in the center of the wide canvas */}
          <Reveal className="relative z-10 mx-auto max-w-xl text-center lg:text-left">
            <p
              className="mb-6 text-[10px] font-semibold uppercase tracking-[0.3em]"
              style={{ color: INK_MUTED }}
            >
              {section.label}
            </p>
            <h2
              className="m-0 text-4xl font-medium leading-[1.12] sm:text-5xl"
              style={{ fontFamily: "var(--font-display), 'Times New Roman', serif", color: INK }}
            >
              {section.headline}
            </h2>
            <p className="mt-7 max-w-sm text-base leading-relaxed" style={{ color: INK_MUTED }}>
              {section.body}
            </p>
          </Reveal>
        </section>
      ))}

      {/* ── Numbers ───────────────────────────────────────────────── */}
      <section
        id="numbers"
        className="border-y px-8 sm:px-14"
        style={{ borderColor: RULE, paddingTop: "7rem", paddingBottom: "7rem" }}
      >
        <p
          className="mb-12 text-center text-[10px] font-semibold uppercase tracking-[0.3em]"
          style={{ color: INK_MUTED }}
        >
          BY THE NUMBERS
        </p>
        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-12 sm:grid-cols-4">
          {event.stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 100} className="text-center">
              <p
                className="m-0 text-5xl font-light sm:text-6xl"
                style={{ fontFamily: "var(--font-display), 'Times New Roman', serif", color: INK }}
              >
                {stat.value}
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.18em]" style={{ color: INK_MUTED }}>
                {stat.label}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Signal / What to expect ───────────────────────────────── */}
      <section
        id="signal"
        className="px-8 sm:px-14"
        style={{ paddingTop: "10rem", paddingBottom: "10rem" }}
      >
        <Reveal className="mx-auto max-w-2xl">
          <p
            className="mb-6 text-[10px] font-semibold uppercase tracking-[0.3em]"
            style={{ color: INK_MUTED }}
          >
            SIGNAL
          </p>
          <h2
            className="m-0 text-4xl font-medium leading-[1.12] sm:text-5xl"
            style={{ fontFamily: "var(--font-display), 'Times New Roman', serif", color: INK }}
          >
            {event.signalHeadline}
          </h2>
          <p className="mt-8 text-base leading-loose" style={{ color: INK_MUTED }}>
            {event.signalBody}
          </p>
        </Reveal>
      </section>

      {/* ── RSVP ─────────────────────────────────────────────────── */}
      <section
        id="rsvp"
        className="border-t px-8 sm:px-14"
        style={{ borderColor: RULE, paddingTop: "10rem", paddingBottom: "10rem" }}
      >
        <Reveal className="mx-auto max-w-2xl">
          <p
            className="mb-6 text-[10px] font-semibold uppercase tracking-[0.3em]"
            style={{ color: INK_MUTED }}
          >
            RSVP
          </p>
          <h2
            className="m-0 text-4xl font-medium leading-[1.1] sm:text-6xl"
            style={{ fontFamily: "var(--font-display), 'Times New Roman', serif", color: INK }}
          >
            {event.rsvpHeadline}
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed" style={{ color: INK_MUTED }}>
            {event.rsvpSubtext}
          </p>
          <RSVPForm />
        </Reveal>
      </section>

      {/* ── Minimal footer ───────────────────────────────────────── */}
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
