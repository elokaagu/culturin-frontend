import type { Metadata } from "next";
import Link from "next/link";

import { blurForSrc } from "@/lib/culturinImages";
import { EDITORIAL_BG, EDITORIAL_INK, EDITORIAL_MUTED, EDITORIAL_RULE, EDITORIAL_ACCENT, SURFACE_DARK, editorialScopeClass } from "@/lib/theme/culturinTokens";
import BlurImage from "@/app/components/motion/BlurImage";
import Reveal from "@/app/components/motion/Reveal";
import IslandNav from "@/app/components/IslandNav";
import HomeFooter from "@/app/components/HomeFooter";

const BG = EDITORIAL_BG;
const INK = EDITORIAL_INK;
const INK_MUTED = EDITORIAL_MUTED;
const RULE = EDITORIAL_RULE;
const ACCENT = EDITORIAL_ACCENT;

export const metadata: Metadata = {
  title: "Nice & Cannes for Business Travelers | Culturin",
  description:
    "A Culturin travel guide to Nice and Cannes for business travelers: getting around, where to stay and work, and how to experience the real local culture between meetings.",
};

const HERO_SRC = "/events/cannes-lions-2026/UNIKday1-22.jpg";

const GETTING_AROUND = [
  {
    label: "Landing",
    body: "Nice Côte d'Azur (NCE) is the region's airport, a 20 to 25 minute drive from central Nice and around 30 to 40 minutes from Cannes depending on traffic. It's the second-busiest airport in France, with direct connections to most major European and several long-haul hubs.",
  },
  {
    label: "Nice to Cannes",
    body: "The regional TER train runs along the coast between Nice and Cannes in about 35 to 40 minutes, with departures roughly every 15 to 30 minutes. It's often faster and cheaper than driving during festival weeks, when the coast road backs up badly.",
  },
  {
    label: "Getting around",
    body: "Both cities are walkable at their core. Taxis and ride-hailing apps work well but get scarce and expensive during Cannes Lions and festival season. If you're commuting between the two cities daily, the train is the more reliable choice.",
  },
];

const WHERE_TO_BASE = [
  {
    label: "Basing in Cannes",
    body: "If your meetings are at the Palais des Festivals or along the Croisette, staying in Cannes saves you the commute. Expect higher rates and full hotels during Cannes Lions and the Film Festival; book early or look slightly inland around Le Suquet and Le Cannet for better value.",
  },
  {
    label: "Basing in Nice",
    body: "Nice is quieter, generally more affordable, and has a stronger everyday food and culture scene once the workday ends. The train commute to Cannes is short enough to make this a genuinely practical option, not just a budget compromise.",
  },
];

const CULTURE = [
  {
    label: "Vieux Nice",
    body: "The old town's narrow lanes are where the city's real character lives: independent galleries, family-run bakeries, and the daily Cours Saleya market. Go early, before the tour groups arrive.",
  },
  {
    label: "Boulevard de la Croisette",
    body: "Cannes's waterfront promenade is part business district, part people-watching theater. Dress smart-casual here; it's genuinely part of how the street reads you.",
  },
  {
    label: "Îles de Lérins",
    body: "A 15-minute boat ride from Cannes's old port, these two small islands are quieter than the mainland beaches and make an easy half-day reset between meetings.",
  },
  {
    label: "Marché Forville",
    body: "Cannes's real working market, a few streets back from the Croisette. Local produce, fish, and flowers, with none of the tourist markup.",
  },
];

const FOOD = [
  { name: "Socca", note: "A Niçoise chickpea pancake, best eaten street-side and hot from the pan." },
  { name: "Salade niçoise", note: "The genuine version has no cooked vegetables: tomato, egg, olives, anchovy, tuna." },
  { name: "Pan bagnat", note: "Essentially a salade niçoise pressed into a sandwich; the classic portable lunch." },
  { name: "Bouillabaisse", note: "A Provençal fish stew, worth booking ahead at a proper seafood address in Cannes." },
];

const PRACTICAL_TIPS = [
  "French business meetings often start with a few minutes of small talk before getting to business; skipping it can read as brusque.",
  "Lunch is a real break in this region, often 90 minutes or more. Don't schedule a meeting through it.",
  "Restaurants fill fast during Cannes Lions and festival weeks. Book your evenings before you land.",
  "Beaches along this coast are pebble, not sand. Pack accordingly if you're extending the trip.",
  "A smart-casual layer goes further than a full suit once you're off the conference floor.",
];

export default function NiceAndCannesGuidePage() {
  return (
    <div style={{ background: BG, color: INK }} className={`${editorialScopeClass} font-sans antialiased`}>
      <IslandNav />

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative flex min-h-[70dvh] flex-col items-center justify-center overflow-hidden px-8 pt-24 text-center sm:px-14">
        <BlurImage
          src={HERO_SRC}
          alt="Guests at a Culturin evening in Cannes"
          fill
          priority
          className="object-cover"
          placeholder="blur"
          blurDataURL={blurForSrc(HERO_SRC)}
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.5) 100%)" }}
        />
        <Reveal className="relative z-10 mx-auto flex max-w-2xl flex-col items-center" y={28}>
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/70">
            Business Travel Guide
          </p>
          <h1
            className="m-0 text-4xl font-medium leading-[1.08] text-white sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
          >
            Nice &amp; Cannes, Done Right.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/75">
            For travelers coming for the meetings, the panels, or Cannes Lions itself, here is how to get the most out of the French Riviera without wasting the trip on logistics.
          </p>
        </Reveal>
      </section>

      {/* ── Getting around ────────────────────────────────────── */}
      <section className="border-b px-8 sm:px-14" style={{ paddingTop: "7rem", paddingBottom: "7rem", borderColor: RULE }}>
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: INK_MUTED }}>
              Getting there and around
            </p>
            <h2
              className="m-0 max-w-2xl text-3xl font-medium leading-[1.15] sm:text-4xl"
              style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
            >
              The logistics, so you don&apos;t have to think about them twice.
            </h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-px sm:grid-cols-3" style={{ background: RULE }}>
            {GETTING_AROUND.map((item, i) => (
              <Reveal key={item.label} as="div" delay={i * 120}>
                <div className="h-full px-8 py-10" style={{ background: BG }}>
                  <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.25em]" style={{ color: INK_MUTED }}>
                    {item.label}
                  </p>
                  <p className="m-0 text-sm leading-relaxed" style={{ color: INK_MUTED }}>
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Where to base yourself ────────────────────────────── */}
      <section className="border-b px-8 sm:px-14" style={{ paddingTop: "7rem", paddingBottom: "7rem", borderColor: RULE }}>
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: INK_MUTED }}>
              Where to base yourself
            </p>
            <h2
              className="m-0 max-w-2xl text-3xl font-medium leading-[1.15] sm:text-4xl"
              style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
            >
              Cannes for proximity. Nice for everything after 6pm.
            </h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20">
            {WHERE_TO_BASE.map((item, i) => (
              <Reveal key={item.label} as="div" delay={i * 120}>
                <h3
                  className="m-0 text-xl font-medium"
                  style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
                >
                  {item.label}
                </h3>
                <p className="mt-4 text-base leading-loose" style={{ color: INK_MUTED }}>
                  {item.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Local culture ─────────────────────────────────────── */}
      <section className="border-b px-8 sm:px-14" style={{ paddingTop: "7rem", paddingBottom: "7rem", borderColor: RULE }}>
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: INK_MUTED }}>
              Beyond the conference floor
            </p>
            <h2
              className="m-0 max-w-2xl text-3xl font-medium leading-[1.15] sm:text-4xl"
              style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
            >
              The culture that makes the trip worth extending.
            </h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4" style={{ background: RULE }}>
            {CULTURE.map((item, i) => (
              <Reveal key={item.label} as="div" delay={i * 100}>
                <div className="h-full px-6 py-8" style={{ background: BG }}>
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: INK_MUTED }}>
                    {item.label}
                  </p>
                  <p className="m-0 text-sm leading-relaxed" style={{ color: INK_MUTED }}>
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Food ───────────────────────────────────────────────── */}
      <section className="border-b px-8 sm:px-14" style={{ paddingTop: "7rem", paddingBottom: "7rem", borderColor: RULE }}>
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: INK_MUTED }}>
              What to eat
            </p>
            <h2
              className="m-0 max-w-2xl text-3xl font-medium leading-[1.15] sm:text-4xl"
              style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
            >
              Four dishes worth the detour.
            </h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {FOOD.map((item, i) => (
              <Reveal key={item.name} as="div" delay={i * 100}>
                <div className="flex flex-col gap-2 border-b pb-6 sm:flex-row sm:items-start sm:gap-4" style={{ borderColor: RULE }}>
                  <h3
                    className="m-0 shrink-0 text-lg font-medium sm:w-32"
                    style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
                  >
                    {item.name}
                  </h3>
                  <p className="m-0 text-sm leading-relaxed" style={{ color: INK_MUTED }}>
                    {item.note}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Practical tips ─────────────────────────────────────── */}
      <section className="border-b px-8 sm:px-14" style={{ paddingTop: "7rem", paddingBottom: "7rem", borderColor: RULE }}>
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: INK_MUTED }}>
              Good to know
            </p>
            <h2
              className="m-0 text-3xl font-medium leading-[1.15] sm:text-4xl"
              style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
            >
              Small things that make the trip smoother.
            </h2>
          </Reveal>
          <ul className="mt-10 flex list-none flex-col gap-5 p-0">
            {PRACTICAL_TIPS.map((tip, i) => (
              <Reveal key={tip} as="li" delay={i * 80} className="flex items-start gap-4">
                <span
                  className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold"
                  style={{ background: ACCENT, color: SURFACE_DARK }}
                >
                  {i + 1}
                </span>
                <p className="m-0 text-base leading-relaxed" style={{ color: INK_MUTED }}>
                  {tip}
                </p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Partner CTA ──────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden px-8 py-24 text-center sm:px-14"
        style={{ background: SURFACE_DARK }}
      >
        <Reveal className="mx-auto max-w-2xl">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: "rgba(232,227,218,0.6)" }}>
            For brands &amp; corporate teams
          </p>
          <h2
            className="m-0 text-3xl font-medium leading-[1.15] text-white sm:text-4xl"
            style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
          >
            Planning an experience on the Riviera? We consult on that.
          </h2>
          <p className="mt-5 text-base leading-relaxed" style={{ color: "rgba(232,227,218,0.82)" }}>
            Culturin partners with brands and companies on cultural programming, hospitality, and activations during
            marquee moments like Cannes Lions — curated guest lists, the room, the nights. If you&apos;re building
            something here and want a team that&apos;s actually been in those rooms, we should talk.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/partner"
              className="inline-flex items-center rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-85"
              style={{ background: ACCENT, color: SURFACE_DARK }}
            >
              Let&apos;s talk
            </Link>
            <Link
              href="/events/cannes-lions-2026"
              className="text-xs font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-70"
              style={{ color: "rgba(232,227,218,0.85)" }}
            >
              See how we showed up at Cannes →
            </Link>
          </div>
        </Reveal>
      </section>

      <HomeFooter />
    </div>
  );
}
