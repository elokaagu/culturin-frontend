"use client";

import Link from "next/link";

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

const HERO_BG =
  "https://www.forbes.com/advisor/wp-content/uploads/2021/03/traveling-based-on-fare-deals.jpg";

export default function HomePageClient({
  initialBlogs,
  initialVideos,
  initialProviders,
}: HomePageClientProps) {
  const scrollToSection = () => {
    document.getElementById("target-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Header />
      <main className="min-h-screen w-full bg-black pt-[150px] text-white transition-colors sm:pt-[120px]">
        <section
          className="flex min-h-[50vh] flex-col items-center justify-center px-5 py-8"
          aria-label="Hero"
        >
          <div
            className="relative flex min-h-[50vh] w-[95%] max-w-5xl flex-col items-center justify-center overflow-hidden rounded-[10px] bg-black bg-cover bg-center px-5 py-10 text-center text-white"
            style={{ backgroundImage: `url(${HERO_BG})` }}
          >
            <div className="absolute inset-0 bg-black/45" aria-hidden />
            <div className="relative z-[2] flex w-full max-w-xl flex-col items-center">
              <h1 className="mb-4 text-3xl font-semibold sm:text-4xl">
                Travel global, live local
              </h1>
              <p className="text-base text-white/90 sm:text-lg">Discover a world of culture</p>
              <button
                type="button"
                onClick={scrollToSection}
                className="mt-6 flex w-[100px] cursor-pointer items-center justify-center rounded-md bg-white px-3 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-neutral-200"
              >
                Explore
              </button>
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-2 px-5 py-5 sm:px-5">
          <div id="target-section" className="mx-auto w-full max-w-6xl px-2 pt-6 sm:px-4">
            <Link
              href="/trending"
              className="inline-block w-fit rounded-[10px] bg-[#111111] px-3 py-2 text-3xl font-semibold text-white no-underline transition-colors hover:bg-[#222]"
            >
              Trending Stories
            </Link>
            <p className="mt-2 max-w-2xl text-sm text-white/75 sm:text-base">
              Discover a world of travel, inspiration and culture
            </p>
          </div>
          <div className="mx-auto w-full max-w-6xl px-2 pb-4 sm:px-4">
            <div className="overflow-x-auto pb-1">
              <Hero initialData={initialBlogs} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 px-5 py-5 sm:px-5">
          <div className="mx-auto w-full max-w-6xl px-2 pt-4 sm:px-4">
            <Link
              href="/videos"
              className="inline-block w-fit rounded-[10px] bg-[#111111] px-3 py-2 text-3xl font-semibold text-white no-underline transition-colors hover:bg-[#222]"
            >
              Top Videos
            </Link>
            <p className="mt-2 max-w-2xl text-sm text-white/75 sm:text-base">
              Watch highlights from the world
            </p>
          </div>
          <div className="mx-auto w-full max-w-6xl px-2 pb-4 sm:px-4">
            <div className="overflow-x-auto pb-1">
              <VideoHero initialData={initialVideos} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 px-5 py-5 sm:px-5">
          <div className="mx-auto w-full max-w-6xl px-2 pt-4 sm:px-4">
            <Link
              href="/curated-experiences"
              className="inline-block w-fit rounded-[10px] bg-[#111111] px-3 py-2 text-3xl font-semibold text-white no-underline transition-colors hover:bg-[#222]"
            >
              Curated Experiences
            </Link>
            <p className="mt-2 max-w-2xl text-sm text-white/75 sm:text-base">
              Browse our hand picked selection of experiences
            </p>
          </div>
          <div className="mx-auto w-full max-w-6xl px-2 pb-10 sm:px-4">
            <div className="overflow-x-auto pb-1">
              <ProviderHero initialData={initialProviders} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
