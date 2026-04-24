"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, type ReactNode } from "react";

import Header from "./Header";
import HomeStorySidebar from "./HomeStorySidebar";
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
      <Link
        href={href}
        className="mt-4 inline-flex items-center justify-center rounded-lg border border-amber-400/40 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800 no-underline transition-colors hover:border-amber-500/50 hover:bg-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 dark:border-white/20 dark:bg-white/5 dark:text-amber-300 dark:hover:border-amber-400/40 dark:hover:bg-white/10"
      >
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
      className="border-t border-neutral-200 py-10 sm:py-14 dark:border-white/10"
      aria-labelledby={headingId}
    >
      <div className={containerClass}>
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h2
              id={headingId}
              className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white"
            >
              <Link
                href={viewAllHref}
                className="text-inherit no-underline decoration-amber-400/80 underline-offset-4 transition-colors hover:text-amber-200/95 focus-visible:rounded focus-visible:text-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
              >
                {title}
              </Link>
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-base dark:text-white/70">
              {description}
            </p>
          </div>
          <Link
            href={viewAllHref}
            className="shrink-0 self-start rounded-lg border border-amber-400/35 bg-amber-50/80 px-4 py-2 text-sm font-medium text-amber-900 no-underline transition-colors hover:border-amber-500/50 hover:bg-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 sm:self-auto dark:border-white/15 dark:bg-white/5 dark:text-amber-300 dark:hover:border-amber-400/35 dark:hover:bg-white/10"
          >
            View all
          </Link>
        </header>
        <div className="mt-8 min-h-[1px] overflow-x-auto overscroll-x-contain pb-1 [-webkit-overflow-scrolling:touch]">
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

  const showHeroSidebar = initialBlogs.length > 0;

  return (
    <>
      <Header />
      <main id="main-content" className={mainClass}>
        <section className={`${heroShellClass} pb-6 pt-4 sm:pb-8 sm:pt-6`} aria-labelledby="home-hero-heading">
          <div
            className={
              showHeroSidebar
                ? "grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12 lg:gap-8"
                : "grid grid-cols-1"
            }
          >
            <div className={showHeroSidebar ? "min-w-0 lg:col-span-8" : "min-w-0"}>
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

            {showHeroSidebar ? (
              <div className="hidden min-h-0 lg:col-span-4 lg:flex lg:flex-col">
                <HomeStorySidebar stories={initialBlogs} />
              </div>
            ) : null}
          </div>
        </section>

        <div id="discover" className="scroll-mt-[var(--header-offset)]">
          <div className={showHeroSidebar ? "lg:hidden" : ""}>
            <HomeSection
              id="trending-stories"
              title="Trending stories"
              description="Discover travel, inspiration, and culture from our community."
              viewAllHref="/trending"
            >
              {initialBlogs.length > 0 ? (
                <TrendingStoriesRail stories={initialBlogs} />
              ) : (
                <EmptyRail
                  message="No stories are available yet. Check back soon or open the full trending feed."
                  href="/trending"
                  linkLabel="Go to trending"
                />
              )}
            </HomeSection>
          </div>

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

        <footer className={`${containerClass} mt-4 border-t border-neutral-200 pt-10 dark:border-white/10`}>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-neutral-500 dark:text-white/50">
              © {new Date().getFullYear()} Culturin. Where inspiration meets exploration.
            </p>
            <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link
                href="/about"
                className="text-neutral-600 no-underline transition-colors hover:text-neutral-900 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 dark:text-white/70 dark:hover:text-white dark:focus-visible:text-amber-200"
              >
                About
              </Link>
              <Link
                href="/articles"
                className="text-neutral-600 no-underline transition-colors hover:text-neutral-900 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 dark:text-white/70 dark:hover:text-white dark:focus-visible:text-amber-200"
              >
                Articles
              </Link>
              <Link
                href="/assistant"
                className="text-neutral-600 no-underline transition-colors hover:text-neutral-900 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 dark:text-white/70 dark:hover:text-white dark:focus-visible:text-amber-200"
              >
                Culturin AI
              </Link>
              <Link
                href="/join-us/advisors"
                className="text-neutral-600 no-underline transition-colors hover:text-neutral-900 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 dark:text-white/70 dark:hover:text-white dark:focus-visible:text-amber-200"
              >
                Advisors
              </Link>
            </nav>
          </div>
        </footer>
      </main>
    </>
  );
}
