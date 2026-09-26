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
import WorldIndexGrid from "./WorldIndexGrid";
import StoryGrid from "./StoryGrid";
import ExperiencesSpread from "./ExperiencesSpread";
import SafeContentImage from "./SafeContentImage";
import type { providerHeroCard, simpleBlogCard } from "@/lib/interface";
import { exploreWorldCountries } from "@/lib/exploreWorldCountries";
import { appPageContainerClass } from "@/lib/appLayout";
import {
  IMAGE_BLUR_DATA_URL,
  cmsImageUnoptimized,
  isBundledPlaceholderSrc,
  resolveContentImageSrc,
} from "../../lib/imagePlaceholder";
import { REPORT_EDITION, REPORT_SLUG, REPORT_SUBTITLE, REPORT_TITLE } from "../reports/the-irl-advantage/reportContent";

type HomePageClientProps = {
  initialBlogs: simpleBlogCard[];
  initialProviders: providerHeroCard[];
};

const displayFont = { fontFamily: "var(--font-display), 'Times New Roman', serif" };
const container = appPageContainerClass;
const section = "border-t py-14 sm:py-20";

function LeadStory({ story }: { story: simpleBlogCard }) {
  const src = resolveContentImageSrc(story.titleImageUrl);
  return (
    <Link
      href={`/articles/${story.currentSlug}`}
      className="group grid grid-cols-1 items-center gap-8 no-underline outline-none lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-14"
    >
      <div
        className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border"
        style={{ borderColor: "var(--c-rule)", background: "var(--c-rule)" }}
      >
        <SafeContentImage
          src={src}
          alt={story.title}
          blurDataURL={IMAGE_BLUR_DATA_URL}
          className="object-cover transition duration-700 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          sizes="(max-width: 1024px) 100vw, 55vw"
          unoptimized={isBundledPlaceholderSrc(src) || cmsImageUnoptimized(src)}
          priority
        />
      </div>
      <div className="min-w-0">
        <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--c-accent)" }}>
          Lead story
        </p>
        <h2
          className="m-0 mt-4 text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl"
          style={{ ...displayFont, color: "var(--c-ink)" }}
        >
          {story.title}
        </h2>
        {story.summary ? (
          <p className="m-0 mt-4 line-clamp-4 text-base leading-relaxed" style={{ color: "var(--c-muted)" }}>
            {story.summary}
          </p>
        ) : null}
        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--c-accent)" }}>
          Read the story <span aria-hidden>→</span>
        </span>
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
  const [lead, ...rest] = initialBlogs;
  const latest = rest.slice(0, 6);

  return (
    <div className={editorialScopeClass} style={{ background: EDITORIAL_BG, color: EDITORIAL_INK }}>
      <SiteHeader />
      <main id="main-content" className="min-h-dvh w-full min-w-0 overflow-x-clip pb-20 antialiased">
        <header className={`${container} pb-12 pt-32 sm:pt-40`}>
          <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--c-accent)" }}>
            Platform
          </p>
          <h1
            className="m-0 mt-5 max-w-4xl text-balance text-4xl font-medium leading-[1.05] tracking-tight sm:text-6xl"
            style={{ ...displayFont, color: "var(--c-ink)" }}
          >
            Stories and reports from the rooms we build.
          </h1>
        </header>

        {lead ? (
          <section className={`${container} pb-16`} aria-label="Lead story">
            <LeadStory story={lead} />
          </section>
        ) : null}

        {latest.length > 0 ? (
          <section className={`${container} ${section}`} style={{ borderColor: "var(--c-rule)" }} aria-labelledby="latest-heading">
            <SectionHead id="latest-heading" eyebrow="Stories" title="Latest" href="/articles" />
            <StoryGrid stories={latest} />
          </section>
        ) : null}

        <section className={`${container} ${section}`} style={{ borderColor: "var(--c-rule)" }} aria-labelledby="report-heading">
          <Link
            href={`/reports/${REPORT_SLUG}`}
            className="group grid grid-cols-1 gap-6 rounded-3xl p-8 no-underline sm:p-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end"
            style={{ background: SURFACE_DARK, color: ON_DARK_TEXT }}
          >
            <div>
              <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: ON_DARK_MUTED }}>
                {REPORT_EDITION}
              </p>
              <h2 id="report-heading" className="m-0 mt-4 text-4xl font-medium leading-[1.05] sm:text-5xl" style={displayFont}>
                {REPORT_TITLE}
              </h2>
              <p className="m-0 mt-4 max-w-xl text-base leading-relaxed" style={{ color: ON_DARK_MUTED }}>
                {REPORT_SUBTITLE}
              </p>
            </div>
            <span
              className="inline-flex w-fit items-center rounded-full px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition-opacity group-hover:opacity-85"
              style={{ background: ACCENT_ON_DARK, color: SURFACE_DARK }}
            >
              Read the report
            </span>
          </Link>
        </section>

        <section className={`${container} ${section}`} style={{ borderColor: "var(--c-rule)" }} aria-labelledby="cities-heading">
          <WorldIndexGrid
            countries={exploreWorldCountries}
            title="Where Culturin gathers"
            description="Cities and countries where Culturin builds rooms, and the stories that come out of them."
            viewAllHref="/destinations"
            headingId="cities-heading"
          />
        </section>

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
