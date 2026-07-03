import type { Metadata } from "next";

import { EDITORIAL_BG, EDITORIAL_INK, EDITORIAL_MUTED, EDITORIAL_RULE, editorialScopeClass } from "@/lib/theme/culturinTokens";
import IslandNav from "@/app/components/IslandNav";
import HomeFooter from "@/app/components/HomeFooter";
import { PartnerForm } from "./PartnerForm";

const BG = EDITORIAL_BG;
const INK = EDITORIAL_INK;
const INK_MUTED = EDITORIAL_MUTED;
const RULE = EDITORIAL_RULE;

export const metadata: Metadata = {
  title: "Partner With Culturin",
  description: "Partner with Culturin on event sponsorship, brand activations, or attend an upcoming Culturin night.",
};

export default function PartnerPage() {
  return (
    <div style={{ background: BG, color: INK }} className={`${editorialScopeClass} font-sans antialiased`}>
      <IslandNav />

      <div className="mx-auto max-w-5xl px-8 pb-24 sm:px-14" style={{ paddingTop: "8rem" }}>
        <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: INK_MUTED }}>
          For partners
        </p>
        <h1
          className="m-0 max-w-2xl text-5xl font-medium leading-[1.08] sm:text-6xl"
          style={{ fontFamily: "var(--font-display), 'Times New Roman', serif", color: INK }}
        >
          Let&apos;s build something that matters.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed" style={{ color: INK_MUTED }}>
          We partner with the world&apos;s leading consumer and lifestyle brands on cultural programming built
          around marquee moments, and we host a small number of guests directly. Tell us which you&apos;re here
          for, and our team will follow up personally.
        </p>

        <div
          className="mt-14 grid grid-cols-1 gap-14 border-t pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]"
          style={{ borderColor: RULE }}
        >
          <div className="flex flex-col gap-8">
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em]" style={{ color: INK_MUTED }}>
                Sponsorship &amp; activations
              </p>
              <p className="m-0 text-sm leading-relaxed" style={{ color: INK_MUTED }}>
                Every room we build delivers a curated, high-caliber audience: high-net-worth individuals, senior
                executives, and cultural tastemakers who actually show up.
              </p>
            </div>
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em]" style={{ color: INK_MUTED }}>
                Attending an event
              </p>
              <p className="m-0 text-sm leading-relaxed" style={{ color: INK_MUTED }}>
                Culturin nights are invite-only. Tell us a bit about yourself below and we&apos;ll follow up about
                the guest list for our next event.
              </p>
            </div>
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em]" style={{ color: INK_MUTED }}>
                Prefer email?
              </p>
              <a
                href="mailto:partners@culturin.com"
                className="m-0 text-sm font-semibold no-underline transition-opacity hover:opacity-70"
                style={{ color: INK }}
              >
                partners@culturin.com
              </a>
            </div>
          </div>

          <PartnerForm />
        </div>
      </div>

      <HomeFooter />
    </div>
  );
}
