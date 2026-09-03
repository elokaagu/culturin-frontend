import type { Metadata } from "next";

import { EDITORIAL_BG, EDITORIAL_INK, EDITORIAL_MUTED, EDITORIAL_RULE, editorialScopeClass } from "@/lib/theme/culturinTokens";
import IslandNav from "@/app/components/IslandNav";
import HomeFooter from "@/app/components/HomeFooter";
import { ShineBorder } from "@/components/ui/shine-border";
import { PartnerForm } from "./PartnerForm";

const BG = EDITORIAL_BG;
const INK = EDITORIAL_INK;
const INK_MUTED = EDITORIAL_MUTED;
const RULE = EDITORIAL_RULE;

export const metadata: Metadata = {
  title: "Book a Call | Culturin",
  description:
    "Cultural marketing for brands launching in new territories or connecting with cultural intelligence. Write to Culturin — we'll set up a call.",
};

export default function PartnerPage() {
  return (
    <div style={{ background: BG, color: INK }} className={`${editorialScopeClass} font-sans antialiased`}>
      <IslandNav />

      <div className="mx-auto max-w-5xl px-8 pb-24 sm:px-14" style={{ paddingTop: "8rem" }}>
        <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: INK_MUTED }}>
          Cultural marketing
        </p>
        <h1
          className="m-0 max-w-2xl text-5xl font-medium leading-[1.08] sm:text-6xl"
          style={{ fontFamily: "var(--font-display), 'Times New Roman', serif", color: INK }}
        >
          Book a call with the house.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed" style={{ color: INK_MUTED }}>
          For brands with questions about cultural marketing — how to launch in a new territory, or how to
          connect with cultural intelligence. Tell us what you need. We&apos;ll set up a call.
        </p>

        <div
          className="mt-14 grid grid-cols-1 gap-14 border-t pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]"
          style={{ borderColor: RULE }}
        >
          <div className="flex flex-col gap-8">
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em]" style={{ color: INK_MUTED }}>
                New territories
              </p>
              <p className="m-0 text-sm leading-relaxed" style={{ color: INK_MUTED }}>
                Enter a market with the room already built — Cannes, New York, London, and the nights in between —
                and the people who already shape culture there.
              </p>
            </div>
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em]" style={{ color: INK_MUTED }}>
                Cultural intelligence
              </p>
              <p className="m-0 text-sm leading-relaxed" style={{ color: INK_MUTED }}>
                Briefs, introductions, and programming rooted in the house, not a campaign bolted onto a place.
              </p>
            </div>
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em]" style={{ color: INK_MUTED }}>
                Prefer email?
              </p>
              <a
                href="mailto:unik@culturin.com"
                className="m-0 text-sm font-semibold no-underline transition-opacity hover:opacity-70"
                style={{ color: INK }}
              >
                unik@culturin.com
              </a>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border p-8" style={{ borderColor: RULE }}>
            <ShineBorder shineColor={["#b5502e", "#e08a5b", "#f0ab85"]} />
            <PartnerForm />
          </div>
        </div>
      </div>

      <HomeFooter />
    </div>
  );
}
