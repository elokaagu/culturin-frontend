"use client";

import { Link } from "next-view-transitions";

import SiteHeader from "./SiteHeader";
import HomeFooter from "./HomeFooter";
import {
  ACCENT_ON_DARK,
  EDITORIAL_BG,
  EDITORIAL_INK,
  ON_DARK_MUTED,
  ON_DARK_TEXT,
  SURFACE_DARK,
  editorialScopeClass,
} from "@/lib/theme/culturinTokens";
import StoryGrid from "./StoryGrid";
import ExperiencesSpread from "./ExperiencesSpread";
import type { providerHeroCard, simpleBlogCard } from "@/lib/interface";
import { appPageContainerClass } from "@/lib/appLayout";
import {
  HEADLINE_STATS,
  REPORT_EDITION,
  REPORT_SLUG,
  REPORT_SUBTITLE,
  REPORT_TITLE,
} from "../reports/the-irl-advantage/reportContent";

type HomePageClientProps = {
  initialBlogs: simpleBlogCard[];
  initialProviders: providerHeroCard[];
};

const displayFont = { fontFamily: "var(--font-display), 'Times New Roman', serif" };
const container = appPageContainerClass;
const section = "border-t py-14 sm:py-20";

function FeaturedReport() {
  return (
    <Link
      href={`/reports/${REPORT_SLUG}`}
      className="group block overflow-hidden rounded-3xl no-underline outline-none"
      style={{ background: SURFACE_DARK, color: ON_DARK_TEXT }}
    >
      <div className="grid grid-cols-1 gap-12 p-8 sm:p-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16 lg:p-16">
        <div className="flex flex-col">
          <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: ACCENT_ON_DARK }}>
            Core report 01
          </p>
          <p className="m-0 mt-3 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: ON_DARK_MUTED }}>
            {REPORT_EDITION}
          </p>
          <h2 id="report-heading" className="m-0 mt-8 text-5xl font-medium leading-[1.02] sm:text-7xl" style={displayFont}>
            {REPORT_TITLE}
          </h2>
          <p className="m-0 mt-5 max-w-lg text-xl italic leading-snug sm:text-2xl" style={{ ...displayFont, color: ACCENT_ON_DARK }}>
            {REPORT_SUBTITLE}
          </p>
          <p className="m-0 mt-6 max-w-lg text-sm leading-relaxed" style={{ color: ON_DARK_MUTED }}>
            The latest independent data on why live experiences cut through a saturated internet, and the Culturin
            playbook for brands that want to stand out in person.
          </p>
          <span
            className="mt-10 inline-flex w-fit items-center rounded-full px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition-opacity group-hover:opacity-85"
            style={{ background: ACCENT_ON_DARK, color: SURFACE_DARK }}
          >
            Read the report →
          </span>
        </div>
        <ul className="m-0 flex flex-col justify-end p-0">
          {HEADLINE_STATS.map((s) => (
            <li key={s.label} className="list-none border-t py-6 first:border-t-0 lg:first:border-t" style={{ borderColor: "rgba(241,233,220,0.15)" }}>
              <p className="m-0 text-5xl font-medium leading-none sm:text-6xl" style={{ ...displayFont, color: ACCENT_ON_DARK }}>
                {s.value}
              </p>
              <p className="m-0 mt-3 max-w-xs text-sm leading-relaxed" style={{ color: ON_DARK_MUTED }}>
                {s.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}

function SectionHead({ id, eyebrow, title, href, linkLabel }: { id: string; eyebrow: string; title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--c-muted)" }}>
          {eyebrow}
        </p>
        <h2 id={id} className="m-0 mt-3 text-3xl font-medium tracking-tight sm:text-4xl" style={{ ...displayFont, color: "var(--c-ink)" }}>
          {title}
        </h2>
      </div>
      {href ? (
        <Link
          href={href}
          className="shrink-0 text-xs font-semibold uppercase tracking-[0.08em] no-underline transition-opacity hover:opacity-70"
          style={{ color: "var(--c-accent)" }}
        >
          {linkLabel ?? "See all"} →
        </Link>
      ) : null}
    </div>
  );
}

export default function HomePageClient({ initialBlogs, initialProviders }: HomePageClientProps) {
  const latest = initialBlogs.slice(0, 6);

  return (
    <div className={editorialScopeClass} style={{ background: EDITORIAL_BG, color: EDITORIAL_INK }}>
      <SiteHeader />
      <main id="main-content" className="min-h-dvh w-full min-w-0 overflow-x-clip pb-20 antialiased">
        <header className={`${container} pb-12 pt-32 sm:pt-40`}>
          <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--c-accent)" }}>
            Reports
          </p>
          <h1
            className="m-0 mt-5 max-w-4xl text-balance text-4xl font-medium leading-[1.05] tracking-tight sm:text-6xl"
            style={{ ...displayFont, color: "var(--c-ink)" }}
          >
            Stories and reports from the rooms we build.
          </h1>
        </header>

        <section className={`${container} pb-16`} aria-labelledby="report-heading">
          <FeaturedReport />
        </section>

        {latest.length > 0 ? (
          <section className={`${container} ${section}`} style={{ borderColor: "var(--c-rule)" }} aria-labelledby="latest-heading">
            <SectionHead id="latest-heading" eyebrow="Stories" title="Latest" href="/articles" />
            <StoryGrid stories={latest} />
          </section>
        ) : null}

        {initialProviders.length > 0 ? (
          <section className={`${container} ${section}`} style={{ borderColor: "var(--c-rule)" }} aria-labelledby="experiences-heading">
            <ExperiencesSpread
              providers={initialProviders}
              title="Experiences"
              description="Partners and formats from the rooms we build."
              viewAllHref="/curated-experiences"
              headingId="experiences-heading"
            />
          </section>
        ) : null}
      </main>
      <HomeFooter />
    </div>
  );
}
