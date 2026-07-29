import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "next-view-transitions";

import { ContentPageShell } from "../components/layout/ContentPageShell";
import { IMAGE_BLUR_DATA_URL } from "../../lib/imagePlaceholder";

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
    <ContentPageShell
      mainClassName="min-h-dvh pb-16 antialiased"
      innerClassName="mx-auto w-full max-w-6xl px-4 sm:px-6"
    >
        <nav aria-label="Breadcrumb" className="mb-6 pt-6">
          <div className="flex items-center gap-1 text-sm">
            <Link href="/" className="no-underline transition hover:opacity-80" style={{ color: "var(--c-accent)" }}>
              Home
            </Link>
            <span style={{ color: "var(--c-muted)" }} aria-hidden>
              /
            </span>
            <span style={{ color: "var(--c-muted)" }}>About</span>
          </div>
        </nav>

        <section className="relative overflow-hidden rounded-3xl border" style={{ borderColor: "var(--c-rule)" }}>
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/15" aria-hidden />
            <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 md:p-10">
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.22em] text-white/70">About Culturin</p>
              <h1
                className="m-0 mt-3 max-w-3xl text-3xl font-medium leading-tight tracking-tight text-white sm:text-5xl"
                style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
              >
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
            <article key={item.title} className="rounded-2xl border p-5" style={{ borderColor: "var(--c-rule)" }}>
              <h2
                className="m-0 text-lg font-medium"
                style={{ fontFamily: "var(--font-display), 'Times New Roman', serif", color: "var(--c-ink)" }}
              >
                {item.title}
              </h2>
              <p className="m-0 mt-2 text-sm leading-relaxed" style={{ color: "var(--c-muted)" }}>{item.text}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border p-5 sm:p-8" style={{ borderColor: "var(--c-rule)", background: "rgba(28,26,23,0.03)" }}>
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--c-muted)" }}>Our focus</p>
          <p className="m-0 mt-3 max-w-4xl text-lg leading-relaxed" style={{ color: "var(--c-ink)" }}>
            We build for people who want more than highlights. That means thoughtful destination pages, richer travel guides,
            useful nearby discovery, and curated experiences that connect travelers to the culture of a place.
          </p>
        </section>

        <section className="mt-10">
          <h2
            className="m-0 text-2xl font-medium tracking-tight"
            style={{ fontFamily: "var(--font-display), 'Times New Roman', serif", color: "var(--c-ink)" }}
          >
            What we are building next
          </h2>
          <div className="mt-4 grid gap-3">
            {roadmap.map((item) => (
              <article key={item.label} className="rounded-xl border px-4 py-4" style={{ borderColor: "var(--c-rule)" }}>
                <p className="m-0 text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--c-muted)" }}>{item.label}</p>
                <p className="m-0 mt-2 text-base" style={{ color: "var(--c-ink)" }}>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border p-5 sm:p-6" style={{ borderColor: "var(--c-rule)" }}>
          <h2
            className="m-0 text-xl font-medium"
            style={{ fontFamily: "var(--font-display), 'Times New Roman', serif", color: "var(--c-ink)" }}
          >
            Explore Culturin
          </h2>
          <p className="m-0 mt-2 max-w-2xl" style={{ color: "var(--c-muted)" }}>
            Start with destinations, dive into travel guides, or browse curated experiences.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/destinations"
              className="inline-flex min-h-[42px] items-center rounded-full border px-5 text-xs font-semibold uppercase tracking-[0.16em] no-underline transition hover:opacity-80"
              style={{ borderColor: "var(--c-rule)", color: "var(--c-ink)" }}
            >
              Destinations
            </Link>
            <Link
              href="/travel-guides"
              className="inline-flex min-h-[42px] items-center rounded-full border px-5 text-xs font-semibold uppercase tracking-[0.16em] no-underline transition hover:opacity-80"
              style={{ borderColor: "var(--c-rule)", color: "var(--c-ink)" }}
            >
              Travel guides
            </Link>
            <Link
              href="/providers"
              className="inline-flex min-h-[42px] items-center rounded-full border px-5 text-xs font-semibold uppercase tracking-[0.16em] no-underline transition hover:opacity-80"
              style={{ borderColor: "var(--c-rule)", color: "var(--c-ink)" }}
            >
              Providers
            </Link>
          </div>
        </section>
    </ContentPageShell>
  );
}
