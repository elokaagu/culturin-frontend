import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import HomeFooter from "@/app/components/HomeFooter";
import Reveal from "@/app/components/motion/Reveal";
import SiteHeader from "@/app/components/SiteHeader";
import {
  AUDIENCE_STATS,
  CALENDAR,
  COMPANIES,
  INDUSTRIES,
  PHOTOS,
  PRESS,
  PROGRAMME,
  REPORT_CONTENTS,
  STEPS,
  TIERS,
  TRACK_RECORD,
} from "@/lib/partners/programme";
import {
  ACCENT_ON_DARK,
  EDITORIAL_ACCENT,
  EDITORIAL_BG,
  EDITORIAL_INK,
  EDITORIAL_MUTED,
  EDITORIAL_RULE,
  ON_DARK_MUTED,
  ON_DARK_TEXT,
  SURFACE_DARK,
  editorialScopeClass,
} from "@/lib/theme/culturinTokens";

export const metadata: Metadata = {
  title: `${PROGRAMME.name} ${PROGRAMME.edition} | Culturin`,
  description: "Partner with Culturin at the year’s cultural moments, from Cannes Lions to MIPCOM.",
  // Shared with prospects directly; kept out of search and the site menu.
  robots: { index: false, follow: false },
};

const DISPLAY = "var(--font-display), 'Times New Roman', serif";
/** Keeps dark cards visible when the site itself is in dark mode. */
const DARK_CARD_BORDER = "rgba(241,233,220,0.14)";
const PROSPECTUS = "/api/partners/prospectus";

function Eyebrow({ children, onDark }: { children: ReactNode; onDark?: boolean }) {
  return (
    <p className="m-0 mb-5 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: onDark ? ON_DARK_MUTED : EDITORIAL_MUTED }}>
      {children}
    </p>
  );
}

function SectionTitle({ eyebrow, title, lede }: { eyebrow: string; title: string; lede?: string }) {
  return (
    <Reveal>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="m-0 max-w-3xl text-4xl font-medium leading-[1.08] sm:text-5xl" style={{ fontFamily: DISPLAY }}>
        {title}
      </h2>
      {lede ? (
        <p className="mt-6 max-w-2xl text-base leading-loose" style={{ color: EDITORIAL_MUTED }}>
          {lede}
        </p>
      ) : null}
    </Reveal>
  );
}

const primaryButton =
  "inline-flex items-center justify-center rounded-full px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-85";
const ghostButton =
  "inline-flex items-center justify-center rounded-full border px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] no-underline transition-colors";

export default function PartnersPage() {
  const industryMax = Math.max(...INDUSTRIES.map((i) => i.people));

  return (
    <div style={{ background: EDITORIAL_BG, color: EDITORIAL_INK }} className={`${editorialScopeClass} font-sans antialiased`}>
      <SiteHeader />

      <main className="px-3 pb-3 pt-[5.25rem] sm:px-4 sm:pt-24">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl" style={{ background: SURFACE_DARK }}>
          <Image src={PHOTOS.hero.src} alt={PHOTOS.hero.alt} fill priority sizes="100vw" className="object-cover opacity-60" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(14,11,8,0.15) 0%, rgba(14,11,8,0.85) 85%)" }} aria-hidden />
          <div className="relative flex min-h-[78vh] flex-col justify-end px-6 pb-14 pt-40 sm:px-14 sm:pb-20" style={{ color: ON_DARK_TEXT }}>
            <Eyebrow onDark>{PROGRAMME.eyebrow}</Eyebrow>
            <h1 className="m-0 max-w-4xl text-5xl font-medium leading-[1.04] sm:text-7xl lg:text-8xl" style={{ fontFamily: DISPLAY }}>
              {PROGRAMME.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-loose sm:text-lg" style={{ color: ON_DARK_MUTED }}>
              {PROGRAMME.lede}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href={PROGRAMME.contactPath} className={primaryButton} style={{ background: ACCENT_ON_DARK, color: SURFACE_DARK }}>
                Start a conversation
              </Link>
              <a href={PROSPECTUS} className={ghostButton} style={{ borderColor: "rgba(241,233,220,0.35)", color: ON_DARK_TEXT }}>
                Download the prospectus
              </a>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 sm:px-10">
          {/* Track record */}
          <section className="py-24">
            <SectionTitle
              eyebrow="The track record"
              title="Rooms people remember."
              lede="Every Culturin room is curated. The guest list is the product: the people who make, fund and influence culture, in one place for one night."
            />
            <div className="mt-14 grid gap-5 lg:grid-cols-2">
              {TRACK_RECORD.map((t, i) => (
                <Reveal key={t.event} delay={i * 90} as="article" className="h-full">
                  <div
                    className="flex h-full flex-col overflow-hidden rounded-3xl border"
                    style={t.photo ? { borderColor: EDITORIAL_RULE } : { background: SURFACE_DARK, color: ON_DARK_TEXT, borderColor: DARK_CARD_BORDER }}
                  >
                    {t.photo ? (
                      <div className="relative aspect-[3/2]">
                        <Image src={t.photo.src} alt={t.photo.alt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                      </div>
                    ) : null}
                    <div className="flex flex-1 flex-col p-8 sm:p-10">
                      <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: t.photo ? EDITORIAL_ACCENT : ACCENT_ON_DARK }}>
                        {t.event}
                      </p>
                      <p className="mt-4 text-lg leading-relaxed" style={{ fontFamily: DISPLAY }}>
                        {t.line}
                      </p>
                      <div className="mt-auto grid grid-cols-2 gap-6 pt-10">
                        {t.stats.map((s) => (
                          <div key={s.label}>
                            <p className="m-0 text-5xl font-medium leading-none" style={{ fontFamily: DISPLAY, color: t.photo ? EDITORIAL_ACCENT : ACCENT_ON_DARK }}>
                              {s.value}
                            </p>
                            <p className="mt-3 text-sm leading-relaxed" style={{ color: t.photo ? EDITORIAL_MUTED : ON_DARK_MUTED }}>
                              {s.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal>
              <p className="mt-10 text-xs uppercase tracking-[0.2em]" style={{ color: EDITORIAL_MUTED }}>
                In the press: <span style={{ color: EDITORIAL_INK }}>{PRESS.join("  ·  ")}</span>
              </p>
            </Reveal>
          </section>

          {/* Audience */}
          <section className="border-t py-24" style={{ borderColor: EDITORIAL_RULE }}>
            <SectionTitle eyebrow="Who’s in the room" title="Senior, international, and in the business of culture." />
            <div className="mt-14 grid grid-cols-1 border-t sm:grid-cols-2 lg:grid-cols-4" style={{ borderColor: EDITORIAL_RULE }}>
              {AUDIENCE_STATS.map((s, i) => (
                <Reveal key={s.label} delay={i * 90} className="h-full">
                  <div className="h-full border-b py-8 pr-8" style={{ borderColor: EDITORIAL_RULE }}>
                    <p className="m-0 text-6xl font-medium leading-none" style={{ fontFamily: DISPLAY, color: EDITORIAL_ACCENT }}>
                      {s.value}
                    </p>
                    <p className="mt-4 max-w-[16rem] text-sm leading-relaxed">{s.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="mt-14 grid gap-14 lg:grid-cols-[1.2fr_1fr]">
              <Reveal>
                <h3 className="m-0 text-xl font-medium" style={{ fontFamily: DISPLAY }}>
                  Where they work
                </h3>
                <ul className="m-0 mt-6 flex list-none flex-col gap-4 p-0">
                  {INDUSTRIES.map((ind) => (
                    <li key={ind.name}>
                      <div className="flex items-baseline justify-between gap-4 text-sm">
                        <span>{ind.name}</span>
                        <span className="tabular-nums" style={{ color: EDITORIAL_MUTED }}>
                          ~{ind.people}
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full" style={{ background: EDITORIAL_RULE }} aria-hidden>
                        <div className="h-full rounded-full" style={{ width: `${(ind.people / industryMax) * 100}%`, background: EDITORIAL_ACCENT }} />
                      </div>
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={90}>
                <h3 className="m-0 text-xl font-medium" style={{ fontFamily: DISPLAY }}>
                  Guests and subscribers include people from
                </h3>
                <p className="mt-6 text-2xl leading-relaxed" style={{ fontFamily: DISPLAY }}>
                  {COMPANIES.join(", ")}.
                </p>
                <p className="mt-8 text-xs leading-relaxed" style={{ color: EDITORIAL_MUTED }}>
                  Figures as of {PROGRAMME.figuresAsOf}, from Culturin’s own guest and subscriber data. Industry sizes are estimates from guests’
                  roles and companies. Company names show where guests work, not endorsements.
                </p>
              </Reveal>
            </div>
          </section>

          {/* Calendar */}
          <section className="border-t py-24" style={{ borderColor: EDITORIAL_RULE }}>
            <SectionTitle
              eyebrow={`The ${PROGRAMME.edition} calendar`}
              title="Seven moments, one programme."
              lede="Partner on a single night or across the season. Cannes After Dark, at Cannes Lions and MIPCOM, is our flagship series."
            />
            <ul className="m-0 mt-14 grid list-none grid-cols-1 gap-px overflow-hidden rounded-3xl border p-0 sm:grid-cols-2 lg:grid-cols-3" style={{ borderColor: EDITORIAL_RULE, background: EDITORIAL_RULE }}>
              {CALENDAR.map((m, i) => (
                <Reveal key={m.name} as="li" delay={(i % 3) * 90} className="h-full">
                  <div className="flex h-full flex-col gap-3 p-8" style={{ background: m.flagship ? SURFACE_DARK : EDITORIAL_BG, color: m.flagship ? ON_DARK_TEXT : EDITORIAL_INK }}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.25em]" style={{ color: m.flagship ? ACCENT_ON_DARK : EDITORIAL_ACCENT }}>
                        {m.month}
                      </span>
                      {m.flagship ? (
                        <span className="rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em]" style={{ background: ACCENT_ON_DARK, color: SURFACE_DARK }}>
                          Cannes After Dark
                        </span>
                      ) : null}
                    </div>
                    <h3 className="m-0 text-2xl font-medium" style={{ fontFamily: DISPLAY }}>
                      {m.name}
                    </h3>
                    <p className="m-0 text-xs uppercase tracking-[0.18em]" style={{ color: m.flagship ? ON_DARK_MUTED : EDITORIAL_MUTED }}>
                      {m.city} · {m.theme}
                    </p>
                    <p className="m-0 mt-2 text-sm leading-relaxed" style={{ color: m.flagship ? ON_DARK_MUTED : EDITORIAL_MUTED }}>
                      {m.line}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ul>
            <p className="mt-6 text-xs" style={{ color: EDITORIAL_MUTED }}>
              Dates are confirmed with partners as each moment is scheduled.
            </p>
          </section>

          {/* Tiers */}
          <section className="border-t py-24" style={{ borderColor: EDITORIAL_RULE }}>
            <SectionTitle eyebrow="Partnerships" title="Three ways in." lede={PROGRAMME.pricing} />
            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {TIERS.map((t, i) => (
                <Reveal key={t.name} delay={i * 90} as="article" className="h-full">
                  <div
                    className="flex h-full flex-col rounded-3xl border p-8 sm:p-10"
                    style={t.featured ? { background: SURFACE_DARK, color: ON_DARK_TEXT, borderColor: DARK_CARD_BORDER } : { borderColor: EDITORIAL_RULE }}
                  >
                    <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.25em]" style={{ color: t.featured ? ACCENT_ON_DARK : EDITORIAL_ACCENT }}>
                      {t.availability}
                    </p>
                    <h3 className="m-0 mt-4 text-3xl font-medium" style={{ fontFamily: DISPLAY }}>
                      {t.name}
                    </h3>
                    <p className="mt-3 text-sm" style={{ color: t.featured ? ON_DARK_MUTED : EDITORIAL_MUTED }}>
                      {t.summary}
                    </p>
                    <ul className="m-0 mt-8 flex list-none flex-col gap-3 border-t p-0 pt-8" style={{ borderColor: t.featured ? "rgba(241,233,220,0.15)" : EDITORIAL_RULE }}>
                      {t.includes.map((line) => (
                        <li key={line} className="flex gap-3 text-sm leading-relaxed">
                          <span aria-hidden style={{ color: t.featured ? ACCENT_ON_DARK : EDITORIAL_ACCENT }}>
                            ✦
                          </span>
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* The report */}
          <section className="border-t py-24" style={{ borderColor: EDITORIAL_RULE }}>
            <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
              <div>
                <SectionTitle
                  eyebrow="Proof after every room"
                  title="Know exactly who you met."
                  lede="Most sponsorships end when the lights come up. Ours end with a Culturin report, built from the guest list and the night itself."
                />
                <ul className="m-0 mt-10 flex list-none flex-col gap-6 p-0">
                  {REPORT_CONTENTS.map((r, i) => (
                    <Reveal key={r.title} as="li" delay={i * 70}>
                      <p className="m-0 text-lg font-medium" style={{ fontFamily: DISPLAY }}>
                        {r.title}
                      </p>
                      <p className="m-0 mt-1 text-sm leading-relaxed" style={{ color: EDITORIAL_MUTED }}>
                        {r.line}
                      </p>
                    </Reveal>
                  ))}
                </ul>
              </div>
              <Reveal delay={90} className="grid grid-cols-2 gap-3">
                {[PHOTOS.cannesCrowd, PHOTOS.cannesGuests].map((p) => (
                  <div key={p.src} className="relative aspect-[3/4] overflow-hidden rounded-3xl">
                    <Image src={p.src} alt={p.alt} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
                  </div>
                ))}
              </Reveal>
            </div>
          </section>

          {/* How it works */}
          <section className="border-t py-24" style={{ borderColor: EDITORIAL_RULE }}>
            <SectionTitle eyebrow="How it works" title="From first call to final report." />
            <ol className="m-0 mt-14 grid list-none grid-cols-1 gap-8 p-0 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s, i) => (
                <Reveal key={s.title} as="li" delay={i * 90}>
                  <p className="m-0 text-5xl font-medium leading-none" style={{ fontFamily: DISPLAY, color: EDITORIAL_ACCENT }}>
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="m-0 mt-5 text-lg font-medium" style={{ fontFamily: DISPLAY }}>
                    {s.title}
                  </p>
                  <p className="m-0 mt-2 text-sm leading-relaxed" style={{ color: EDITORIAL_MUTED }}>
                    {s.line}
                  </p>
                </Reveal>
              ))}
            </ol>
          </section>
        </div>

        {/* CTA */}
        <section className="rounded-3xl px-6 py-20 text-center sm:px-14 sm:py-28" style={{ background: SURFACE_DARK, color: ON_DARK_TEXT }}>
          <Eyebrow onDark>Partner with Culturin</Eyebrow>
          <h2 className="m-0 mx-auto max-w-3xl text-4xl font-medium leading-[1.08] sm:text-6xl" style={{ fontFamily: DISPLAY }}>
            Let’s build the room together.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-loose" style={{ color: ON_DARK_MUTED }}>
            {PROGRAMME.pricing}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href={PROGRAMME.contactPath} className={primaryButton} style={{ background: ACCENT_ON_DARK, color: SURFACE_DARK }}>
              Start a conversation
            </Link>
            <a href={PROSPECTUS} className={ghostButton} style={{ borderColor: "rgba(241,233,220,0.35)", color: ON_DARK_TEXT }}>
              Download the prospectus
            </a>
          </div>
          <p className="mt-8 text-sm" style={{ color: ON_DARK_MUTED }}>
            Or write to{" "}
            <a href={`mailto:${PROGRAMME.contactEmail}`} style={{ color: ACCENT_ON_DARK }}>
              {PROGRAMME.contactEmail}
            </a>
          </p>
        </section>
      </main>

      <HomeFooter />
    </div>
  );
}
