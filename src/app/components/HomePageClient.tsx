"use client";

import { Link } from "next-view-transitions";

import IslandNav from "./IslandNav";
import HomeFooter from "./HomeFooter";
import { editorialScopeClass, EDITORIAL_BG, EDITORIAL_INK } from "@/lib/theme/culturinTokens";
import WorldIndexGrid from "./WorldIndexGrid";
import StoriesLeadList from "./StoriesLeadList";
import WatchFilmstrip from "./WatchFilmstrip";
import ExperiencesSpread from "./ExperiencesSpread";
import PhilanthropySpotlight from "./PhilanthropySpotlight";
import LanguageSpotlight from "./LanguageSpotlight";
import SafeContentImage from "./SafeContentImage";
import type { providerHeroCard, simpleBlogCard, videoCard } from "@/lib/interface";
import { exploreWorldCountries } from "@/lib/exploreWorldCountries";
import { appPageContainerClass } from "@/lib/appLayout";
import {
  IMAGE_BLUR_DATA_URL,
  cmsImageUnoptimized,
  isBundledPlaceholderSrc,
  resolveContentImageSrc,
} from "../../lib/imagePlaceholder";

type HomePageClientProps = {
  initialBlogs: simpleBlogCard[];
  initialVideos: videoCard[];
  initialProviders: providerHeroCard[];
};

const displayFont = { fontFamily: "var(--font-display), 'Times New Roman', serif" };

const mainClass = "min-h-dvh w-full min-w-0 overflow-x-clip pb-16 antialiased";

const containerClass = appPageContainerClass;

const CONTENTS = [
  { id: "stories", label: "Stories" },
  { id: "explore-world", label: "Explore the world" },
  { id: "learn-words", label: "Learn a few words" },
  { id: "watch", label: "Watch" },
  { id: "experiences", label: "Experiences" },
  { id: "philanthropy", label: "Philanthropy" },
];

function currentDateline() {
  return new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function ContentsStrip() {
  return (
    <nav
      aria-label="On this page"
      className="flex flex-wrap gap-x-6 gap-y-2 border-y py-3 text-sm font-semibold tracking-[0.01em]"
      style={{ borderColor: "var(--c-rule)" }}
    >
      {CONTENTS.map(({ id, label }) => (
        <a key={id} href={`#${id}`} className="no-underline transition-colors hover:opacity-70" style={{ color: "var(--c-ink)" }}>
          {label}
        </a>
      ))}
    </nav>
  );
}

function IssueMasthead({ lead }: { lead: simpleBlogCard | undefined }) {
  const leadImgSrc = lead ? resolveContentImageSrc(lead.titleImageUrl) : "";
  return (
    <section className={`${containerClass} pb-8 pt-6 sm:pb-10 sm:pt-8`} aria-labelledby="home-hero-heading">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--c-accent)" }}>
          The Culturin Edit
        </p>
        <p className="text-xs" style={{ color: "var(--c-muted)" }}>Issue — {currentDateline()}</p>
      </div>

      {lead ? (
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
          <div className="min-w-0">
            <h1
              id="home-hero-heading"
              className="text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl md:text-[2.75rem]"
              style={{ ...displayFont, color: "var(--c-ink)" }}
            >
              {lead.title}
            </h1>
            {lead.summary ? (
              <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed sm:text-lg" style={{ color: "var(--c-muted)" }}>
                {lead.summary}
              </p>
            ) : null}
            <Link
              href={`/articles/${lead.currentSlug}`}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold no-underline transition-colors hover:opacity-70"
              style={{ color: "var(--c-accent)" }}
            >
              Read the story <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border" style={{ borderColor: "var(--c-rule)" }}>
            <SafeContentImage
              src={leadImgSrc}
              alt={lead.title}
              blurDataURL={IMAGE_BLUR_DATA_URL}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized={isBundledPlaceholderSrc(leadImgSrc) || cmsImageUnoptimized(leadImgSrc)}
            />
          </div>
        </div>
      ) : (
        <div className="max-w-2xl">
          <h1
            id="home-hero-heading"
            className="text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl md:text-5xl"
            style={{ ...displayFont, color: "var(--c-ink)" }}
          >
            Travel global, live local
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed sm:text-lg" style={{ color: "var(--c-muted)" }}>
            Discover a world of culture, stories, and experiences worth your time.
          </p>
          <Link
            href="/destinations"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold no-underline transition-colors hover:opacity-70"
            style={{ color: "var(--c-accent)" }}
          >
            Explore destinations <span aria-hidden>→</span>
          </Link>
        </div>
      )}
    </section>
  );
}

export default function HomePageClient({
  initialBlogs,
  initialVideos,
  initialProviders,
}: HomePageClientProps) {
  const [leadStory, ...otherStories] = initialBlogs;

  return (
    <div className={editorialScopeClass} style={{ background: EDITORIAL_BG, color: EDITORIAL_INK }}>
      <IslandNav />
      <main id="main-content" className={mainClass} style={{ paddingTop: "8rem" }}>
        <IssueMasthead lead={leadStory} />

        <div className={containerClass}>
          <ContentsStrip />
        </div>

        <section id="stories" className="border-b py-10 sm:py-12" style={{ borderColor: "var(--c-rule)" }} aria-labelledby="stories-heading">
          <div className={containerClass}>
            <StoriesLeadList
              stories={otherStories.length > 0 ? otherStories : initialBlogs}
              title="Stories"
              description="Editorial picks, city notes, and creator-led narratives worth saving."
              viewAllHref="/articles"
              headingId="stories-heading"
            />
          </div>
        </section>

        <section id="explore-world" className="border-b py-10 sm:py-12" style={{ borderColor: "var(--c-rule)" }} aria-labelledby="explore-world-heading">
          <div className={containerClass}>
            <WorldIndexGrid
              countries={exploreWorldCountries}
              title="Explore the world"
              description="Choose a country to open curated articles and guides for that place."
              viewAllHref="/destinations"
              headingId="explore-world-heading"
            />
          </div>
        </section>

        <section id="learn-words" className="border-b py-10 sm:py-12" style={{ borderColor: "var(--c-rule)" }} aria-labelledby="learn-words-heading">
          <div className={containerClass}>
            <LanguageSpotlight headingId="learn-words-heading" />
          </div>
        </section>

        <section id="watch" className="border-b py-10 sm:py-12" style={{ borderColor: "var(--c-rule)" }} aria-labelledby="watch-heading">
          <div className={containerClass}>
            <WatchFilmstrip
              videos={initialVideos}
              title="Watch"
              description="Creator-led clips, local moments, and travel edits from around the world."
              viewAllHref="/videos"
              headingId="watch-heading"
            />
          </div>
        </section>

        <section id="experiences" className="border-b py-10 sm:py-12" style={{ borderColor: "var(--c-rule)" }}>
          <div className={containerClass}>
            <ExperiencesSpread
              providers={initialProviders}
              title="Experiences"
              description="Hand-picked experiences and partners you can explore next."
              viewAllHref="/curated-experiences"
              headingId="experiences-heading"
            />
          </div>
        </section>

        <section id="philanthropy" className="py-10 sm:py-12" aria-labelledby="philanthropy-heading">
          <div className={containerClass}>
            <PhilanthropySpotlight headingId="philanthropy-heading" />
          </div>
        </section>
      </main>
      <HomeFooter />
    </div>
  );
}
