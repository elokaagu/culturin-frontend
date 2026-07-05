import type { Metadata } from "next";
import Link from "next/link";

import {
  EDITORIAL_BG,
  EDITORIAL_INK,
  EDITORIAL_MUTED,
  EDITORIAL_RULE,
  SURFACE_DARK,
  ON_DARK_TEXT,
  ON_DARK_MUTED,
  ACCENT_ON_DARK,
  editorialScopeClass,
} from "@/lib/theme/culturinTokens";
import IslandNav from "@/app/components/IslandNav";
import HomeFooter from "@/app/components/HomeFooter";
import Reveal from "@/app/components/motion/Reveal";
import { ShineBorder } from "@/components/ui/shine-border";

const BG = EDITORIAL_BG;
const INK = EDITORIAL_INK;
const INK_MUTED = EDITORIAL_MUTED;
const RULE = EDITORIAL_RULE;

export const metadata: Metadata = {
  title: "Culturin Card | Culturin",
  description:
    "A travel rewards membership for Culturin members — earn points and unlock perks across countries, events, and curated experiences.",
};

const BENEFITS = [
  {
    label: "Rewards across countries",
    body: "Earn points when you book experiences, attend Culturin events, or buy through partner locations in different cities.",
  },
  {
    label: "Travel perks that unlock as you go",
    body: "Use points for priority booking windows, complimentary upgrades, airport lounge day passes, and local welcome credits.",
  },
  {
    label: "Culture-first partner network",
    body: "Access discounts at vetted restaurants, creative spaces, and neighborhood hosts who align with Culturin values.",
  },
] as const;

const TIERS = [
  { tier: "Explorer", rule: "Join free with your Culturin account", perk: "Starter rewards + partner offers" },
  { tier: "Voyager", rule: "Earn through travel and event activity", perk: "Faster points + early access drops" },
  { tier: "Insider", rule: "High activity across multiple countries", perk: "Top-tier perks + concierge support" },
] as const;

export default function CulturinCardPage() {
  return (
    <div style={{ background: BG, color: INK }} className={`${editorialScopeClass} font-sans antialiased`}>
      <IslandNav />

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden border-b px-8 sm:px-14"
        style={{ paddingTop: "8rem", paddingBottom: "6rem", borderColor: RULE, background: SURFACE_DARK }}
      >
        <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <Reveal as="div">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: ON_DARK_MUTED }}>
              Member rewards
            </p>
            <h1
              className="m-0 text-5xl font-medium leading-[1.05] sm:text-6xl"
              style={{ fontFamily: "var(--font-display), 'Times New Roman', serif", color: ON_DARK_TEXT }}
            >
              Culturin Card.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed" style={{ color: ON_DARK_MUTED }}>
              A travel rewards membership for people who explore with intention. Earn points across Culturin
              events and bookings, and redeem them at partner destinations in cities around the world.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href="/join-us/advisors"
                className="inline-flex w-fit items-center rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-85"
                style={{ background: ACCENT_ON_DARK, color: SURFACE_DARK }}
              >
                Join the waitlist
              </Link>
              <Link
                href="/travel-guides"
                className="text-xs font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-70"
                style={{ color: ON_DARK_MUTED }}
              >
                See eligible experiences →
              </Link>
            </div>
          </Reveal>

          <Reveal as="div" delay={140}>
            <div className="relative mx-auto aspect-[16/10] w-full max-w-md overflow-hidden rounded-[1.75rem] border p-8" style={{ borderColor: "rgba(241,233,220,0.14)" }}>
              <ShineBorder shineColor={["#b5502e", "#e08a5b", "#f0ab85"]} />
              <div
                className="absolute inset-0"
                style={{ background: "radial-gradient(120% 120% at 100% 0%, rgba(224,138,91,0.16) 0%, transparent 55%)" }}
              />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.28em]" style={{ color: "#e08a5b" }}>
                    Member rewards
                  </p>
                  <div
                    className="h-8 w-11 rounded-[6px]"
                    style={{ background: "linear-gradient(135deg, #e0b482, #b5502e)" }}
                    aria-hidden
                  />
                </div>
                <div>
                  <p
                    className="m-0 text-3xl font-medium tracking-tight"
                    style={{ fontFamily: "var(--font-display), 'Times New Roman', serif", color: ON_DARK_TEXT }}
                  >
                    Culturin Card
                  </p>
                  <p className="m-0 mt-1.5 text-sm" style={{ color: ON_DARK_MUTED }}>
                    Culture-first perks across destinations.
                  </p>
                </div>
                <div className="flex items-center gap-10">
                  <div>
                    <p className="m-0 text-[10px] uppercase tracking-[0.15em]" style={{ color: ON_DARK_MUTED }}>
                      Valid thru
                    </p>
                    <p className="m-0 mt-1 text-base font-semibold" style={{ color: ON_DARK_TEXT }}>
                      12 / 31
                    </p>
                  </div>
                  <div>
                    <p className="m-0 text-[10px] uppercase tracking-[0.15em]" style={{ color: ON_DARK_MUTED }}>
                      Member
                    </p>
                    <p className="m-0 mt-1 text-base font-semibold" style={{ color: ON_DARK_TEXT }}>
                      Culturin
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Benefits ───────────────────────────────────────────── */}
      <section className="border-b px-8 sm:px-14" style={{ borderColor: RULE, paddingTop: "6rem", paddingBottom: "6rem" }}>
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: INK_MUTED }}>
              Why join
            </p>
            <h2
              className="m-0 max-w-xl text-3xl font-medium leading-[1.15] sm:text-4xl"
              style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
            >
              Built for people who travel with intention.
            </h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-10 border-t pt-14 sm:grid-cols-3" style={{ borderColor: RULE }}>
            {BENEFITS.map((item, i) => (
              <Reveal key={item.label} delay={i * 100}>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em]" style={{ color: INK_MUTED }}>
                  {item.label}
                </p>
                <p className="m-0 text-sm leading-relaxed" style={{ color: INK_MUTED }}>
                  {item.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tiers ──────────────────────────────────────────────── */}
      <section className="px-8 sm:px-14" style={{ paddingTop: "6rem", paddingBottom: "8rem" }}>
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: INK_MUTED }}>
              How tiers work
            </p>
            <h2
              className="m-0 max-w-xl text-3xl font-medium leading-[1.15] sm:text-4xl"
              style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
            >
              Your status scales with activity.
            </h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-px sm:grid-cols-3" style={{ background: RULE }}>
            {TIERS.map((t, i) => (
              <Reveal key={t.tier} as="div" delay={i * 100} className="bg-[var(--c-bg)] p-8">
                <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.25em]" style={{ color: "#b5502e" }}>
                  {t.tier}
                </p>
                <p className="m-0 mt-3 text-base font-medium" style={{ color: INK }}>
                  {t.rule}
                </p>
                <p className="m-0 mt-2 text-sm leading-relaxed" style={{ color: INK_MUTED }}>
                  {t.perk}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={300} className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3">
            <Link
              href="/join-us/advisors"
              className="inline-flex w-fit items-center rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-85"
              style={{ background: "#b5502e", color: "#f1e9dc" }}
            >
              Join the waitlist
            </Link>
            <Link
              href="/"
              className="text-xs font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-60"
              style={{ color: INK }}
            >
              Back to Culturin →
            </Link>
          </Reveal>
        </div>
      </section>

      <HomeFooter />
    </div>
  );
}
