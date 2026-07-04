import type { Metadata } from "next";
import Link from "next/link";

import { EDITORIAL_BG, EDITORIAL_INK, EDITORIAL_MUTED, EDITORIAL_RULE, editorialScopeClass } from "@/lib/theme/culturinTokens";
import IslandNav from "@/app/components/IslandNav";
import HomeFooter from "@/app/components/HomeFooter";

const BG = EDITORIAL_BG;
const INK = EDITORIAL_INK;
const INK_MUTED = EDITORIAL_MUTED;
const RULE = EDITORIAL_RULE;

export const metadata: Metadata = {
  title: "Our Mission | Culturin",
  description: "Culture is not just a state of being. It's an action — here's what Culturin is building toward.",
};

const PILLARS = [
  {
    label: "Depth over highlights",
    body: "We help people learn and embody the art of culture — through stories, curated events, and experiences that go beyond the postcard version of a place.",
  },
  {
    label: "Rooms that matter",
    body: "We build cultural programming around marquee moments — Cannes Lions, the US Open, the UN General Assembly, and beyond — where the real conversations happen, not just a name on a step-and-repeat.",
  },
  {
    label: "An audience that shows up",
    body: "Every room we build delivers a curated, high-caliber audience: high-net-worth individuals, senior executives, and cultural tastemakers who actually show up.",
  },
] as const;

export default function OurMissionPage() {
  return (
    <div style={{ background: BG, color: INK }} className={`${editorialScopeClass} font-sans antialiased`}>
      <IslandNav />

      <div className="mx-auto max-w-4xl px-8 pb-24 sm:px-14" style={{ paddingTop: "8rem" }}>
        <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: INK_MUTED }}>
          Our mission
        </p>
        <h1
          className="m-0 max-w-2xl text-5xl font-medium leading-[1.08] sm:text-6xl"
          style={{ fontFamily: "var(--font-display), 'Times New Roman', serif", color: INK }}
        >
          Culture is not just a state of being. It&apos;s an action.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed" style={{ color: INK_MUTED }}>
          Culturin is a curated travel &amp; culture company built by a team with production history at the Super
          Bowl, the Oscars, Davos, the Cannes Film Festival, and the UN Assembly. We bring that same care to every
          room we build — for our community, and for the partners who build alongside us.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-10 border-t pt-16 sm:grid-cols-3" style={{ borderColor: RULE }}>
          {PILLARS.map((pillar) => (
            <div key={pillar.label}>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em]" style={{ color: INK_MUTED }}>
                {pillar.label}
              </p>
              <p className="m-0 text-sm leading-relaxed" style={{ color: INK_MUTED }}>
                {pillar.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t pt-16" style={{ borderColor: RULE }}>
          <h2
            className="m-0 max-w-xl text-3xl font-medium leading-[1.15] sm:text-4xl"
            style={{ fontFamily: "var(--font-display), 'Times New Roman', serif", color: INK }}
          >
            From real conversations to a global festival.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed" style={{ color: INK_MUTED }}>
            We launched with real conversations — artists, musicians, and entrepreneurs talking about travel and
            culture. Since then we&apos;ve been building out curated events, a growing content library, and the
            beginning of a real marketplace. Next: certified cultural training programs, a first Culturin
            festival, and a production company built for cultural programming at the scale our team already
            knows.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
            <Link
              href="/events"
              className="inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-60"
              style={{ color: INK }}
            >
              See our events →
            </Link>
            <Link
              href="/partner"
              className="inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-60"
              style={{ color: INK }}
            >
              Partner with us →
            </Link>
          </div>
        </div>
      </div>

      <HomeFooter />
    </div>
  );
}
