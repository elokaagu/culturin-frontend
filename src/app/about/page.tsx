import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "next-view-transitions";

import { ContentPageShell } from "../components/layout/ContentPageShell";
import { IMAGE_BLUR_DATA_URL } from "../../lib/imagePlaceholder";

const HERO_SRC =
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2200&q=80";

const principles = [
  {
    title: "The room is the product",
    text: "We put founders, operators, artists, and cultural leaders in the same room — and give those rooms a culture worth returning to.",
  },
  {
    title: "Stories from the house",
    text: "Articles, video, and conversations captured from the nights we build.",
  },
  {
    title: "Partners, not props",
    text: "Brands and institutions enter as collaborators in the room, not names on a step-and-repeat.",
  },
] as const;

const roadmap = [
  {
    label: "The rooms",
    text: "More gatherings at the year's cultural moments — Cannes, New York, London, and the nights in between.",
  },
  {
    label: "The library",
    text: "A growing body of stories and conversations from inside the house.",
  },
  {
    label: "The festival",
    text: "Certified cultural programming, a first Culturin festival, and production at the scale our team already knows.",
  },
] as const;

export const metadata: Metadata = {
  title: "About | Culturin",
  description:
    "Culturin is a house of founders, operators, artists, and cultural leaders who gather at significant cultural moments throughout the year.",
  openGraph: {
    title: "About Culturin",
    description: "A house for the people who shape culture.",
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
              alt="A gathering at dusk"
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
                Culturin is a house.
              </h1>
              <p className="m-0 mt-3 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
                Founders, operators, artists, and cultural leaders who come together at significant cultural moments throughout the year.
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
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--c-muted)" }}>The house</p>
          <p className="m-0 mt-3 max-w-4xl text-lg leading-relaxed" style={{ color: "var(--c-ink)" }}>
            We are united in building the rooms, stories, and partnerships that shape culture. The cities we gather in —
            Cannes, New York, London — are occasions, not a product.
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
            Enter the house
          </h2>
          <p className="m-0 mt-2 max-w-2xl" style={{ color: "var(--c-muted)" }}>
            Start with the rooms, the gallery, or the stories coming out of them.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/events"
              className="inline-flex min-h-[42px] items-center rounded-full border px-5 text-xs font-semibold uppercase tracking-[0.16em] no-underline transition hover:opacity-80"
              style={{ borderColor: "var(--c-rule)", color: "var(--c-ink)" }}
            >
              Events
            </Link>
            <Link
              href="/gallery"
              className="inline-flex min-h-[42px] items-center rounded-full border px-5 text-xs font-semibold uppercase tracking-[0.16em] no-underline transition hover:opacity-80"
              style={{ borderColor: "var(--c-rule)", color: "var(--c-ink)" }}
            >
              Gallery
            </Link>
            <Link
              href="/platform"
              className="inline-flex min-h-[42px] items-center rounded-full border px-5 text-xs font-semibold uppercase tracking-[0.16em] no-underline transition hover:opacity-80"
              style={{ borderColor: "var(--c-rule)", color: "var(--c-ink)" }}
            >
              Stories
            </Link>
          </div>
        </section>
    </ContentPageShell>
  );
}
