"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, type ReactNode } from "react";

import Header from "./Header";
import Hero from "./Hero";
import ProviderHero from "./ProviderHero";
import VideoHero from "./VideoHero";
import type { providerHeroCard, simpleBlogCard, videoCard } from "../../libs/interface";

type HomePageClientProps = {
  initialBlogs: simpleBlogCard[];
  initialVideos: videoCard[];
  initialProviders: providerHeroCard[];
};

const HERO_IMAGE =
  "https://www.forbes.com/advisor/wp-content/uploads/2021/03/traveling-based-on-fare-deals.jpg";

const mainClass =
  "min-h-screen w-full bg-black pb-16 pt-[var(--header-offset)] text-white antialiased";

const containerClass = "mx-auto w-full max-w-6xl px-4 sm:px-6";

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
      className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-10 text-center sm:px-6"
      role="status"
    >
      <p className="text-sm text-white/70 sm:text-base">{message}</p>
      <Link
        href={href}
        className="mt-4 inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-amber-300 no-underline transition-colors hover:border-amber-400/40 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
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
      className="border-t border-white/10 py-10 sm:py-14"
      aria-labelledby={headingId}
    >
      <div className={containerClass}>
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h2
              id={headingId}
              className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
            >
              <Link
                href={viewAllHref}
                className="text-inherit no-underline decoration-amber-400/80 underline-offset-4 transition-colors hover:text-amber-200/95 focus-visible:rounded focus-visible:text-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
              >
                {title}
              </Link>
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
              {description}
            </p>
          </div>
          <Link
            href={viewAllHref}
            className="shrink-0 self-start rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-amber-300 no-underline transition-colors hover:border-amber-400/35 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 sm:self-auto"
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

  return (
    <>
      <Header />
      <main id="main-content" className={mainClass}>
        <section
          className={`${containerClass} pb-8 pt-4 sm:pb-10 sm:pt-6`}
          aria-labelledby="home-hero-heading"
        >
          <div className="relative mx-auto aspect-[16/10] min-h-[min(52vh,28rem)] w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.85)]">
            <Image
              src={HERO_IMAGE}
              alt="Wide landscape view suggesting global travel and exploration"
              fill
              priority
              sizes="(max-width: 1024px) 95vw, 1024px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/25" aria-hidden />
            <div className="absolute inset-0 flex flex-col items-center justify-end px-6 pb-10 pt-16 text-center sm:justify-center sm:pb-12 sm:pt-12">
              <h1
                id="home-hero-heading"
                className="max-w-xl text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl"
              >
                Travel global, live local
              </h1>
              <p className="mt-4 max-w-md text-pretty text-base text-white/90 sm:text-lg">
                Discover a world of culture, stories, and experiences worth your time.
              </p>
              <button
                type="button"
                onClick={scrollToDiscover}
                className="mt-8 inline-flex min-h-[44px] min-w-[120px] items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black shadow-lg transition-colors hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
              >
                Explore
              </button>
            </div>
          </div>
        </section>

        <div id="discover" className="scroll-mt-[var(--header-offset)]">
          <HomeSection
            id="trending-stories"
            title="Trending stories"
            description="Discover travel, inspiration, and culture from our community."
            viewAllHref="/trending"
          >
            {initialBlogs.length > 0 ? (
              <Hero initialData={initialBlogs} />
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
              <VideoHero initialData={initialVideos} />
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
              <ProviderHero initialData={initialProviders} />
            ) : (
              <EmptyRail
                message="Experiences are loading into the catalogue. Visit curated experiences to see the full list."
                href="/curated-experiences"
                linkLabel="View experiences"
              />
            )}
          </HomeSection>
        </div>

        <footer className={`${containerClass} mt-4 border-t border-white/10 pt-10`}>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-white/50">
              © {new Date().getFullYear()} Culturin. Where inspiration meets exploration.
            </p>
            <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link
                href="/about"
                className="text-white/70 no-underline transition-colors hover:text-white focus-visible:rounded focus-visible:text-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
              >
                About
              </Link>
              <Link
                href="/articles"
                className="text-white/70 no-underline transition-colors hover:text-white focus-visible:rounded focus-visible:text-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
              >
                Articles
              </Link>
              <Link
                href="/assistant"
                className="text-white/70 no-underline transition-colors hover:text-white focus-visible:rounded focus-visible:text-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
              >
                Culturin AI
              </Link>
              <Link
                href="/join-us/advisors"
                className="text-white/70 no-underline transition-colors hover:text-white focus-visible:rounded focus-visible:text-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
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
