import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "next-view-transitions";

import { ContentPageShell } from "../components/layout/ContentPageShell";
import { IMAGE_BLUR_DATA_URL } from "../../lib/imagePlaceholder";

const HERO_SRC =
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2000&q=80";

const pillars = [
  {
    title: "Stories with depth",
    text: "We champion articles, video, and guides that respect context—who lives somewhere, what shaped the place, and what is worth your attention before you go.",
  },
  {
    title: "Places, not pins",
    text: "From destination lists to local scenes, we help you browse culture and travel in a way that feels human: curated rows, clear typography, and imagery that gives you a real sense of a place.",
  },
  {
    title: "Tools to explore",
    text: "Search, nearby discovery, and AI help you move from “where should I go?” to “what should I know?”—grounded in the same editorial standards as the rest of the site.",
  },
] as const;

export const metadata: Metadata = {
  title: "About | Culturin",
  description:
    "Culturin is where travel, culture, and community meet. Learn who we are and what we are building.",
  openGraph: {
    title: "About Culturin",
    description:
      "Inspiration and practical tools for exploring the world with curiosity and care.",
  },
};

const ctaClass =
  "inline-flex min-h-[44px] items-center justify-center rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 no-underline transition hover:border-amber-400/50 hover:bg-amber-50/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:border-amber-400/40 dark:hover:bg-white/10";

export default function AboutPage() {
  return (
    <ContentPageShell
      mainClassName="min-h-screen bg-white pb-16 pt-[var(--header-offset)] text-neutral-900 antialiased dark:bg-black dark:text-white"
      innerClassName="flex w-full max-w-7xl flex-col gap-0"
    >
      <div className="px-4 sm:px-6">
        <nav aria-label="Breadcrumb" className="pt-1">
          <Link
            href="/"
            className="text-sm font-medium text-amber-800 no-underline hover:underline dark:text-amber-300/95"
          >
            Home
          </Link>
        </nav>

        <div className="relative mt-6 min-h-[min(40vh,22rem)] overflow-hidden rounded-2xl sm:min-h-[min(44vh,24rem)] sm:rounded-3xl">
          <Image
            src={HERO_SRC}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1280px) 100vw, 1200px"
            placeholder="blur"
            blurDataURL={IMAGE_BLUR_DATA_URL}
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/20"
            aria-hidden
          />
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:p-12">
            <p className="m-0 text-xs font-medium uppercase tracking-[0.2em] text-white/80">
              About
            </p>
            <h1 className="mt-2 max-w-3xl text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Where inspiration meets exploration
            </h1>
            <p className="mt-3 max-w-xl text-pretty text-base text-white/90 sm:text-lg">
              Culturin is a home for people who want to see the world with open eyes: culture,
              community, and practical ways to go deeper than the usual checklist.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-3xl pt-14 sm:pt-16">
          <h2
            className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-white/50"
            id="mission-heading"
          >
            What we are building
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-neutral-800 sm:text-xl dark:text-white/90">
            We believe travel and culture are better when they are slow enough to be fair—fair to
            the people who share their cities, and fair to you as a reader and explorer. The
            product is designed around that: readable layouts, clear navigation, and surfaces that
            reward curiosity instead of noise.
          </p>
        </div>

        <ul
          className="mt-12 grid list-none grid-cols-1 gap-6 p-0 sm:mt-14 sm:grid-cols-3 sm:gap-8"
          role="list"
        >
          {pillars.map((p) => (
            <li
              key={p.title}
              className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-6 dark:border-white/10 dark:bg-white/[0.03]"
            >
              <h3 className="m-0 text-base font-bold text-neutral-900 dark:text-white">{p.title}</h3>
              <p className="mt-2 m-0 text-sm leading-relaxed text-neutral-600 dark:text-white/70">
                {p.text}
              </p>
            </li>
          ))}
        </ul>

        <section
          className="mt-14 border-t border-neutral-200 pt-10 dark:border-white/10 sm:mt-16 sm:pt-12"
          aria-labelledby="connect-heading"
        >
          <h2
            id="connect-heading"
            className="m-0 text-sm font-semibold text-neutral-900 dark:text-white"
          >
            Explore the product
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-neutral-600 dark:text-white/65">
            Jump in through the same paths we use ourselves: pick a place, read the guides, or
            start from search and nearby.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link href="/destinations" className={ctaClass}>
              Destinations
            </Link>
            <Link href="/articles" className={ctaClass}>
              Travel guides
            </Link>
            <Link href="/search" className={ctaClass}>
              Search
            </Link>
          </div>
        </section>
      </div>
    </ContentPageShell>
  );
}
