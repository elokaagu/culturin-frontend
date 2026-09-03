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
    "Invite-only Culturin Card membership — early access to rooms, events, and curated cultural programming.",
};

const BENEFITS = [
  {
    label: "Invite-only access",
    body: "Membership is issued by Culturin. Claim links come from Studio after an invitation or nomination — not a public signup form.",
  },
  {
    label: "Rooms and events first",
    body: "Card members get earlier notice for Culturin nights, partner programming, and cultural gatherings we produce.",
  },
  {
    label: "A curated network",
    body: "Stay close to hosts, advisors, and partners who share Culturin’s standard for the rooms we build.",
  },
] as const;

export default function CulturinCardPage() {
  return (
    <div style={{ background: BG, color: INK }} className={`${editorialScopeClass} font-sans antialiased`}>
      <IslandNav />

      <section
        className="relative overflow-hidden border-b px-8 sm:px-14"
        style={{ paddingTop: "8rem", paddingBottom: "6rem", borderColor: RULE, background: SURFACE_DARK }}
      >
        <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <Reveal as="div">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: ON_DARK_MUTED }}>
              Invite-only membership
            </p>
            <h1
              className="m-0 text-5xl font-medium leading-[1.05] sm:text-6xl"
              style={{ fontFamily: "var(--font-display), 'Times New Roman', serif", color: ON_DARK_TEXT }}
            >
              Culturin Card.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed" style={{ color: ON_DARK_MUTED }}>
              A membership flag for people already in the Culturin orbit — early access to rooms we build, not a
              points program or public waitlist storefront.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href="/partner"
                className="inline-flex w-fit items-center rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-85"
                style={{ background: ACCENT_ON_DARK, color: SURFACE_DARK }}
              >
                Book a call
              </Link>
              <Link
                href="/events"
                className="text-xs font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-70"
                style={{ color: ON_DARK_MUTED }}
              >
                See upcoming events →
              </Link>
            </div>
          </Reveal>

          <Reveal as="div" delay={140}>
            <div
              className="relative mx-auto aspect-[16/10] w-full max-w-md overflow-hidden rounded-[1.75rem] border p-8"
              style={{ borderColor: "rgba(241,233,220,0.14)" }}
            >
              <ShineBorder shineColor={["#b5502e", "#e08a5b", "#f0ab85"]} />
              <div
                className="absolute inset-0"
                style={{ background: "radial-gradient(120% 120% at 100% 0%, rgba(224,138,91,0.16) 0%, transparent 55%)" }}
              />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.28em]" style={{ color: "#e08a5b" }}>
                    Membership
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
                    Activated by personal invite.
                  </p>
                </div>
                <div className="flex items-center gap-10">
                  <div>
                    <p className="m-0 text-[10px] uppercase tracking-[0.15em]" style={{ color: ON_DARK_MUTED }}>
                      Status
                    </p>
                    <p className="m-0 mt-1 text-base font-semibold" style={{ color: ON_DARK_TEXT }}>
                      Invite only
                    </p>
                  </div>
                  <div>
                    <p className="m-0 text-[10px] uppercase tracking-[0.15em]" style={{ color: ON_DARK_MUTED }}>
                      Issued by
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

      <section className="border-b px-8 sm:px-14" style={{ borderColor: RULE, paddingTop: "6rem", paddingBottom: "6rem" }}>
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: INK_MUTED }}>
              What it is
            </p>
            <h2
              className="m-0 max-w-xl text-3xl font-medium leading-[1.15] sm:text-4xl"
              style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
            >
              A membership mark — not a rewards ledger.
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

          <Reveal delay={280} className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3">
            <Link
              href="/join-us/advisors"
              className="inline-flex w-fit items-center rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-85"
              style={{ background: "#b5502e", color: "#f1e9dc" }}
            >
              Apply as an advisor
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
