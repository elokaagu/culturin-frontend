import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "next-view-transitions";

import { ContentPageShell } from "../components/layout/ContentPageShell";
import { IMAGE_BLUR_DATA_URL } from "../../lib/imagePlaceholder";
import SiteFooter from "../components/SiteFooter";

const HERO_SRC =
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2200&q=80";

const principles = [
  {
    title: "Context first",
    text: "We prioritize meaning over noise so you understand a place before you visit it.",
  },
  {
    title: "People-powered travel",
    text: "Local creators, advisors, and providers are central to how experiences are surfaced on Culturin.",
  },
  {
    title: "Designed for clarity",
    text: "Readable pages, clear navigation, and practical discovery tools help you move from ideas to plans.",
  },
] as const;

const roadmap = [
  {
    label: "Editorial quality",
    text: "Deep guides and stories that combine local perspective with practical planning notes.",
  },
  {
    label: "Smarter discovery",
    text: "Better search, nearby surfaces, and recommendation logic that reflects your actual intent.",
  },
  {
    label: "Creator ecosystem",
    text: "More provider tools and partner workflows so trusted experts can publish and host through Culturin.",
  },
] as const;

export const metadata: Metadata = {
  title: "About | Culturin",
  description: "Learn what Culturin is building for culture-first travel discovery.",
  openGraph: {
    title: "About Culturin",
    description: "A culture-first platform for stories, destinations, and curated local experiences.",
  },
};

export default function AboutPage() {
  return (
    <>
      <ContentPageShell
        mainClassName="min-h-screen bg-black pb-16 pt-[var(--header-offset)] text-white antialiased"
        innerClassName="mx-auto w-full max-w-6xl px-4 sm:px-6"
      >
        <nav aria-label="Breadcrumb" className="mb-6 pt-6">
          <div className="flex items-center gap-1 text-sm">
            <Link href="/" className="text-amber-300/95 no-underline transition hover:text-amber-200">
              Home
            </Link>
            <span className="text-white/35" aria-hidden>
              /
            </span>
            <span className="text-white/65">About</span>
          </div>
        </nav>

        <section className="relative overflow-hidden rounded-3xl border border-white/10">
          <div className="relative min-h-[18rem] sm:min-h-[24rem]">
            <Image
              src={HERO_SRC}
              alt="Map and travel planning essentials"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              placeholder="blur"
              blurDataURL={IMAGE_BLUR_DATA_URL}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/25" aria-hidden />
            <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 md:p-10">
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.22em] text-white/70">About Culturin</p>
              <h1 className="m-0 mt-3 max-w-3xl text-3xl leading-tight tracking-tight sm:text-5xl">
                Travel deeper with culture, context, and local perspective
              </h1>
              <p className="m-0 mt-3 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
                Culturin helps curious travelers discover places through stories, trusted local providers, and practical planning tools.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-3">
          {principles.map((item) => (
            <article key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="m-0 text-lg font-semibold text-white">{item.title}</h2>
              <p className="m-0 mt-2 text-sm leading-relaxed text-white/75">{item.text}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.02] p-5 sm:p-8">
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-white/45">Our focus</p>
          <p className="m-0 mt-3 max-w-4xl text-lg leading-relaxed text-white/85">
            We build for people who want more than highlights. That means thoughtful destination pages, richer travel guides,
            useful nearby discovery, and curated experiences that connect travelers to the culture of a place.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="m-0 text-2xl font-semibold tracking-tight text-white">What we are building next</h2>
          <div className="mt-4 grid gap-3">
            {roadmap.map((item) => (
              <article key={item.label} className="rounded-xl border border-white/10 bg-black px-4 py-4">
                <p className="m-0 text-sm font-semibold uppercase tracking-[0.16em] text-white/50">{item.label}</p>
                <p className="m-0 mt-2 text-base text-white/80">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <h2 className="m-0 text-xl font-semibold text-white">Explore Culturin</h2>
          <p className="m-0 mt-2 max-w-2xl text-white/75">
            Start with destinations, dive into travel guides, or browse curated experiences.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/destinations"
              className="inline-flex min-h-[42px] items-center rounded-full border border-white/20 bg-white/[0.06] px-5 text-sm font-semibold text-white no-underline transition hover:bg-white/[0.12]"
            >
              Destinations
            </Link>
            <Link
              href="/articles"
              className="inline-flex min-h-[42px] items-center rounded-full border border-white/20 bg-white/[0.06] px-5 text-sm font-semibold text-white no-underline transition hover:bg-white/[0.12]"
            >
              Travel guides
            </Link>
            <Link
              href="/providers"
              className="inline-flex min-h-[42px] items-center rounded-full border border-white/20 bg-white/[0.06] px-5 text-sm font-semibold text-white no-underline transition hover:bg-white/[0.12]"
            >
              Providers
            </Link>
          </div>
        </section>
      </ContentPageShell>
      <SiteFooter />
    </>
  );
}
