import type { Metadata } from "next";

import { EDITORIAL_BG, EDITORIAL_INK, EDITORIAL_MUTED, EDITORIAL_RULE, editorialScopeClass } from "@/lib/theme/culturinTokens";
import SiteHeader from "@/app/components/SiteHeader";
import HomeFooter from "@/app/components/HomeFooter";
import { PartnerForm } from "./PartnerForm";

const BG = EDITORIAL_BG;
const INK = EDITORIAL_INK;
const MUTED = EDITORIAL_MUTED;
const RULE = EDITORIAL_RULE;
const DISPLAY = "var(--font-display), 'Times New Roman', serif";

export const metadata: Metadata = {
  title: "Create an Experience | Culturin",
  description:
    "Tell us what you want to create. Culturin builds cultural programming and intelligence for brands launching in new territories.",
};

const STEPS = [
  { title: "Tell us the goal", body: "Choose what you're after and share a little context. A few lines is plenty." },
  { title: "We set up a call", body: "We read every note ourselves and reply to find a time that works." },
  { title: "We shape the room", body: "You get a proposal built around your brand, not a template." },
];

export default function PartnerPage({ searchParams }: { searchParams: { service?: string | string[] } }) {
  const service = typeof searchParams.service === "string" ? searchParams.service : undefined;

  return (
    <div style={{ background: BG, color: INK }} className={`${editorialScopeClass} font-sans antialiased`}>
      <SiteHeader />

      <main className="px-8 pb-28 pt-32 sm:px-14 sm:pt-36">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: MUTED }}>
              Create an experience
            </p>
            <h1 className="m-0 text-5xl font-medium leading-[1.05] sm:text-6xl" style={{ fontFamily: DISPLAY }}>
              Let&apos;s build the room together.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed" style={{ color: MUTED }}>
              Launching in a new territory, or looking for cultural intelligence? Tell us what you have in mind.
            </p>

            <ol className="m-0 mt-12 flex list-none flex-col gap-6 p-0">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-5 border-t pt-5" style={{ borderColor: RULE }}>
                  <span className="text-sm font-medium tabular-nums" style={{ color: MUTED }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="m-0 text-base font-medium" style={{ fontFamily: DISPLAY }}>
                      {step.title}
                    </p>
                    <p className="m-0 mt-1 text-sm leading-relaxed" style={{ color: MUTED }}>
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="mt-10 text-sm" style={{ color: MUTED }}>
              Prefer email?{" "}
              <a href="mailto:unik@culturin.com" className="font-semibold no-underline hover:underline" style={{ color: INK }}>
                unik@culturin.com
              </a>
            </p>
          </div>

          <div className="rounded-3xl border p-6 sm:p-10" style={{ borderColor: RULE }}>
            <PartnerForm initialInterest={service} />
          </div>
        </div>
      </main>

      <HomeFooter />
    </div>
  );
}
