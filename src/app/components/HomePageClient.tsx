"use client";

import Image from "next/image";
import { Link } from "next-view-transitions";
import { useCallback, type ReactNode } from "react";

import Header from "./Header";
import HomeHeroFeatured from "./HomeHeroFeatured";
import HomeQuoteNewsletterBand from "./HomeQuoteNewsletterBand";
import HomeStorySidebar from "./HomeStorySidebar";
import SiteFooter from "./SiteFooter";
import TrendingStoriesRail from "./TrendingStoriesRail";
import CuratedExperiencesRail from "./CuratedExperiencesRail";
import TopVideosRail from "./TopVideosRail";
import type { providerHeroCard, simpleBlogCard, videoCard } from "../../libs/interface";
import { IMAGE_BLUR_DATA_URL } from "../../lib/imagePlaceholder";

type HomePageClientProps = {
  initialBlogs: simpleBlogCard[];
  initialVideos: videoCard[];
  initialProviders: providerHeroCard[];
};

const HERO_IMAGE =
  "https://www.forbes.com/advisor/wp-content/uploads/2021/03/traveling-based-on-fare-deals.jpg";

const mainClass =
  "min-h-screen w-full bg-neutral-50 pb-16 pt-[var(--header-offset)] text-neutral-900 antialiased dark:bg-black dark:text-white";

const containerClass = "mx-auto w-full max-w-6xl px-4 sm:px-6";

const heroShellClass =
  "mx-auto w-full max-w-7xl px-4 sm:px-6 sm:pb-2 sm:pt-2 md:pt-4";

const homeSectionSeeAllClass =
  "shrink-0 self-center rounded-full bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white no-underline transition-colors hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 min-h-[44px] min-w-[4.5rem] inline-flex items-center justify-center dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200";

function EmptyRail({
  message,
  href,
  linkLabel,
}: {
  message: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div
      className="rounded-xl border border-neutral-200 bg-white px-4 py-10 text-center shadow-sm sm:px-6 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none"
      role="status"
    >
      <p className="text-sm text-neutral-600 sm:text-base dark:text-white/70">{message}</p>
      <Link href={href} className={`mt-5 ${homeSectionSeeAllClass}`}>
        {linkLabel}
      </Link>
    </div>
  );
}

function HomeSection({
  id,
  title,
  description,
  viewAllHref,
  children,
}: {
  id: string;
  title: string;
  description: string;
  viewAllHref: string;
  children: ReactNode;
}) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      className="border-t border-neutral-200 py-10 sm:py-12 dark:border-white/10"
      aria-labelledby={headingId}
    >
      <div className={containerClass}>
        <header className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 pr-2">
            <h2
              id={headingId}
              className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-white"
            >
              {title}
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-neutral-500 sm:mt-1.5 sm:text-base dark:text-white/55">
              {description}
            </p>
          </div>
          <Link href={viewAllHref} className={homeSectionSeeAllClass}>
            See all
          </Link>
        </header>
        <div className="mt-6 min-h-[1px] sm:mt-7">
          {children}
        </div>
      </div>
    </section>
  );
}

export default function HomePageClient({
  initialBlogs,
  initialVideos,
  initialProviders,
}: HomePageClientProps) {
  const scrollToDiscover = useCallback(() => {
    document.getElementById("discover")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const showHeroWithFeature = initialBlogs.length > 0;
  const featuredStory = initialBlogs[0] ?? null;
  const heroSidebarStories = initialBlogs.slice(1, 6);
  const hasHeroSideColumn = heroSidebarStories.length > 0;
  const heroStoryCount = 1 + heroSidebarStories.length;
  const trendingRailStories = initialBlogs.slice(heroStoryCount);

  return (
    <>
      <Header />
      <main id="main-content" className={mainClass}>
        <section
          className={`${heroShellClass} pb-6 pt-4 sm:pb-8 sm:pt-6`}
          aria-labelledby="home-hero-heading"
        >
          {showHeroWithFeature && featuredStory ? (
            <div
              className={
                hasHeroSideColumn
                  ? "grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8"
                  : "grid grid-cols-1"
              }
            >
              <div className={hasHeroSideColumn ? "min-w-0 lg:col-span-9" : "min-w-0"}>
                <HomeHeroFeatured story={featuredStory} headingId="home-hero-heading" />
              </div>
              {hasHeroSideColumn ? (
                <div className="min-w-0 lg:col-span-3">
                  <HomeStorySidebar stories={heroSidebarStories} />
                </div>
              ) : null}
            </div>
          ) : (
            <div className="grid grid-cols-1">
              <div className="min-w-0">
                <div className="relative mx-auto aspect-[16/10] min-h-[min(48vh,26rem)] w-full overflow-hidden rounded-3xl border border-neutral-200 shadow-[0_28px_90px_-28px_rgba(0,0,0,0.18)] sm:min-h-[min(52vh,28rem)] dark:border-white/10 dark:shadow-[0_24px_80px_-24px_rgba(0,0,0,0.85)]">
                  <Image
                    src={HERO_IMAGE}
                    alt="Wide landscape view suggesting global travel and exploration"
                    fill
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR_DATA_URL}
                    sizes="(max-width: 1024px) 95vw, 58vw"
                    className="object-cover"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.28] mix-blend-overlay dark:opacity-[0.22]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)",
                      backgroundSize: "16px 16px",
                    }}
                    aria-hidden
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-neutral-900/85 via-neutral-900/35 to-neutral-900/25 dark:from-black/85 dark:via-black/40 dark:to-black/25"
                    aria-hidden
                  />
                  <div className="pointer-events-none absolute inset-x-0 top-5 flex flex-wrap justify-center gap-2 px-4 sm:top-7 md:top-8">
                    {["Travel", "Culture", "Community"].map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/50 bg-white/12 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white shadow-sm backdrop-blur-md sm:text-[11px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-end px-6 pb-10 pt-24 text-center sm:justify-center sm:pb-12 sm:pt-20 md:pt-16">
                    <h1
                      id="home-hero-heading"
                      className="max-w-[22rem] text-balance text-3xl font-bold tracking-tight text-white drop-shadow-sm sm:max-w-xl sm:text-4xl sm:leading-[1.1] md:text-5xl md:leading-[1.08]"
                    >
                      Travel global, live local
                    </h1>
                    <p className="mt-4 max-w-md text-pretty text-base font-medium leading-relaxed text-white/95 sm:text-lg dark:text-white/90">
                      Discover a world of culture, stories, and experiences worth your time.
                    </p>
                    <button
                      type="button"
                      onClick={scrollToDiscover}
                      className="mt-8 inline-flex min-h-[44px] min-w-[8.5rem] items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-neutral-900 shadow-lg transition-[transform,box-shadow,background-color] hover:bg-neutral-100 hover:shadow-xl active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 dark:text-black"
                    >
                      Explore
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        <div className="pt-2 pb-8 sm:pt-0 sm:pb-10">
          <HomeQuoteNewsletterBand />
        </div>

        <div id="discover" className="scroll-mt-[var(--header-offset)]">
          <HomeSection
            id="trending-stories"
            title="Trending stories"
            description="Discover travel, inspiration, and culture from our community."
            viewAllHref="/trending"
          >
            {trendingRailStories.length > 0 ? (
              <TrendingStoriesRail stories={trendingRailStories} />
            ) : initialBlogs.length > 0 ? (
              <EmptyRail
                message="You are seeing the latest stories in the hero above. Open the full feed for more."
                href="/trending"
                linkLabel="Go to trending"
              />
            ) : (
              <EmptyRail
                message="No stories are available yet. Check back soon or open the full trending feed."
                href="/trending"
                linkLabel="Go to trending"
              />
            )}
          </HomeSection>

          <HomeSection
            id="top-videos"
            title="Top videos"
            description="Watch highlights and journeys from creators around the world."
            viewAllHref="/videos"
          >
            {initialVideos.length > 0 ? (
              <TopVideosRail videos={initialVideos} />
            ) : (
              <EmptyRail
                message="No videos are available yet. Browse the video library when you are ready."
                href="/videos"
                linkLabel="Browse videos"
              />
            )}
          </HomeSection>

          <HomeSection
            id="curated-experiences"
            title="Curated experiences"
            description="Hand-picked experiences and partners you can explore next."
            viewAllHref="/curated-experiences"
          >
            {initialProviders.length > 0 ? (
              <CuratedExperiencesRail providers={initialProviders} />
            ) : (
              <EmptyRail
                message="Experiences are loading into the catalogue. Visit curated experiences to see the full list."
                href="/curated-experiences"
                linkLabel="View experiences"
              />
            )}
          </HomeSection>
        </div>

        <SiteFooter />
      </main>
    </>
  );
}
