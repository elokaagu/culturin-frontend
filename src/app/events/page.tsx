import type { Metadata } from "next";
import Link from "next/link";

import { events } from "@/lib/eventsData";
import { blurForSrc } from "@/lib/culturinImages";
import {
  EDITORIAL_BG,
  EDITORIAL_INK,
  EDITORIAL_MUTED,
  EDITORIAL_RULE,
  editorialScopeClass,
} from "@/lib/theme/culturinTokens";
import BlurImage from "../components/motion/BlurImage";
import Reveal from "../components/motion/Reveal";
import CulturinMark from "../components/CulturinMark";

const BG = EDITORIAL_BG;
const INK = EDITORIAL_INK;
const INK_MUTED = EDITORIAL_MUTED;
const RULE = EDITORIAL_RULE;

export const metadata: Metadata = {
  title: "Events | Culturin",
  description:
    "Upcoming Culturin events — curated cultural experiences at the US Open, United Nations General Assembly, and beyond.",
};

export default function EventsPage() {
  return (
    <div style={{ background: BG, color: INK, minHeight: "100dvh" }} className={`${editorialScopeClass} font-sans antialiased`}>

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header
        className="flex items-center justify-between border-b px-8 sm:px-14"
        style={{ height: 56, borderColor: RULE }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] no-underline transition-opacity hover:opacity-60"
          style={{ color: INK }}
        >
          <CulturinMark size={16} />
          Culturin
        </Link>
        <Link
          href="/"
          className="text-xs no-underline transition-opacity hover:opacity-60"
          style={{ color: INK_MUTED }}
        >
          ← Back to site
        </Link>
      </header>

      {/* ── Page header ─────────────────────────────────────────── */}
      <Reveal
        as="div"
        className="border-b px-8 sm:px-14"
        // padding lives in an inner wrapper so the reveal transform is clean
      >
        <div style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
          <p
            className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em]"
            style={{ color: INK_MUTED }}
          >
            Upcoming Events
          </p>
          <h1
            className="m-0 max-w-2xl text-5xl font-medium leading-[1.08] sm:text-7xl"
            style={{ fontFamily: "var(--font-display), 'Times New Roman', serif", color: INK }}
          >
            Where we&apos;ll be next.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed" style={{ color: INK_MUTED }}>
            Creativity, sport, and diplomacy — Culturin builds rooms at the edges of the world&apos;s biggest gatherings, in partnership with the brands who want to be part of them. Every event is intimate, curated, and invitation-led.
          </p>
        </div>
      </Reveal>

      {/* ── Events list ─────────────────────────────────────────── */}
      <ol className="list-none m-0 p-0">
        {events.map((event, index) => {
          const flip = index % 2 === 1;
          return (
            <Reveal as="li" key={event.slug} className="block border-b" y={32}>
              <Link
                href={`/events/${event.slug}`}
                className="group flex flex-col no-underline lg:flex-row"
                style={{ color: INK, minHeight: 480, borderColor: RULE }}
              >
                {/* Image — alternates left / right */}
                <div
                  className={`relative w-full shrink-0 overflow-hidden lg:w-[48%] ${flip ? "lg:order-2" : ""}`}
                  style={{ minHeight: 320 }}
                >
                  <BlurImage
                    src={event.heroImage}
                    alt={event.heroImageAlt}
                    fill
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                    placeholder="blur"
                    blurDataURL={blurForSrc(event.heroImage)}
                    sizes="(max-width: 1024px) 100vw, 48vw"
                    unoptimized
                  />
                </div>

                {/* Details */}
                <div
                  className={`flex flex-1 flex-col justify-between px-8 py-10 sm:px-12 sm:py-14 ${flip ? "lg:order-1" : ""}`}
                >
                  <div>
                    {/* Category + index */}
                    <div className="mb-8 flex items-center gap-4">
                      <span
                        className="rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
                        style={{ borderColor: RULE, color: INK_MUTED }}
                      >
                        {event.category}
                      </span>
                      <span
                        className="text-[10px] font-semibold uppercase tracking-[0.2em]"
                        style={{ color: INK_MUTED }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Name */}
                    <h2
                      className="m-0 text-3xl font-medium leading-[1.1] sm:text-4xl"
                      style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
                    >
                      {event.name}
                    </h2>

                    {/* Short description */}
                    <p className="mt-5 max-w-sm text-sm leading-relaxed" style={{ color: INK_MUTED }}>
                      {event.shortDescription}
                    </p>
                  </div>

                  {/* Date / location / CTA */}
                  <div className="mt-10 flex flex-col gap-5">
                    <div className="flex flex-col gap-1">
                      <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: INK_MUTED }}>
                        {event.date}
                      </p>
                      <p className="m-0 text-xs uppercase tracking-[0.18em]" style={{ color: INK_MUTED }}>
                        {event.location}
                      </p>
                    </div>

                    <span
                      className="inline-flex w-fit items-center gap-2 border-b pb-0.5 text-sm font-semibold uppercase tracking-[0.15em] transition-gap duration-200 group-hover:gap-3"
                      style={{ borderColor: INK, color: INK }}
                    >
                      View event
                      <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </ol>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer
        className="flex items-center justify-between px-8 py-6 sm:px-14"
        style={{ borderTop: `1px solid ${RULE}` }}
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
