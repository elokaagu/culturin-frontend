import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "next-view-transitions";

import { ContentPageShell } from "../components/layout/ContentPageShell";
import { IMAGE_BLUR_DATA_URL } from "../../lib/imagePlaceholder";
import SiteFooter from "../components/SiteFooter";

const HERO_SRC =
  "https://images.unsplash.com/photo-1540575467063-27a0e4f7adf9?auto=format&fit=crop&w=2200&q=80";

const pillars = [
  {
    title: "Advertising campaigns",
    text: "Brand and destination work rooted in real places — creative that respects local nuance and lands with audiences who care about culture, not just captions.",
  },
  {
    title: "Events",
    text: "Launches, cultural moments, and community gatherings designed to feel grounded where they happen, with production clarity that scales across markets.",
  },
  {
    title: "Experiences",
    text: "Immersive formats — walks, tastings, performances, and partner activations — that put local voices first and leave guests with a story worth retelling.",
  },
] as const;

const scope = [
  {
    title: "Global reach, local soul",
    text: "We work across regions and time zones while keeping each market’s rituals, humour, and history intact. The goal is resonance everywhere, cliché nowhere.",
  },
  {
    title: "Culture as the brief",
    text: "Whether you represent a city, a festival, or a global brand, we treat culture as the strategy — not a bolt-on. Research, creative, and production align to that bar.",
  },
  {
    title: "Partners, not props",
    text: "Local makers, venues, and storytellers are credited, paid fairly, and involved early. Campaigns and events should strengthen communities, not extract from them.",
  },
] as const;

export const metadata: Metadata = {
  title: "Agency | Culturin",
  description:
    "Culturin Agency — advertising campaigns, events, and experiences that promote local cultures around the world.",
  openGraph: {
    title: "Culturin Agency",
    description:
      "Campaigns, events, and experiences that celebrate local culture — built for brands and places with a global audience.",
  },
};

export default function AgencyPage() {
  return (
    <>
      <ContentPageShell
        mainClassName="min-h-screen bg-neutral-50 pb-16 pt-[var(--header-offset)] text-neutral-900 antialiased dark:bg-black dark:text-white"
        innerClassName="mx-auto w-full max-w-6xl px-4 sm:px-6"
      >
        <nav aria-label="Breadcrumb" className="mb-6 pt-6">
          <div className="flex items-center gap-1 text-sm">
            <Link href="/" className="text-amber-700 no-underline transition hover:underline dark:text-amber-300/95 dark:hover:text-amber-200">
              Home
            </Link>
            <span className="text-neutral-400 dark:text-white/35" aria-hidden>
              /
            </span>
            <span className="text-neutral-600 dark:text-white/65">Agency</span>
          </div>
        </nav>

        <section className="relative overflow-hidden rounded-3xl border border-neutral-200 dark:border-white/10">
          <div className="relative min-h-[18rem] sm:min-h-[24rem]">
            <Image
              src={HERO_SRC}
              alt="Audience at a live event with warm stage lighting"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              placeholder="blur"
              blurDataURL={IMAGE_BLUR_DATA_URL}
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/20 dark:from-black/85 dark:via-black/40 dark:to-black/25"
              aria-hidden
            />
            <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 md:p-10">
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.22em] text-white/75">Culturin Agency</p>
              <h1 className="m-0 mt-3 max-w-3xl font-semibold leading-tight tracking-tight text-white text-balance text-3xl sm:text-5xl">
                Campaigns, events, and experiences that promote local cultures — globally
              </h1>
              <p className="m-0 mt-3 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
                We partner with brands, destinations, and cultural institutions to tell place-based stories with depth:
                from integrated advertising to live programming guests actually remember.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-neutral-200 bg-white p-5 sm:p-8 dark:border-white/10 dark:bg-white/[0.02]">
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-white/45">What we do</p>
          <p className="m-0 mt-3 max-w-4xl text-lg leading-relaxed text-neutral-800 dark:text-white/85">
            Culturin Agency is the creative and experiential arm of Culturin. We design work that travels — without flattening
            the places it comes from. That means strategy and craft that honour local context, then find the thread that connects
            with audiences everywhere.
          </p>
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-3">
          {pillars.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]"
            >
              <h2 className="m-0 text-lg font-semibold text-neutral-900 dark:text-white">{item.title}</h2>
              <p className="m-0 mt-2 text-sm leading-relaxed text-neutral-600 dark:text-white/75">{item.text}</p>
            </article>
          ))}
        </section>

        <section className="mt-10">
          <h2 className="m-0 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">How we show up</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {scope.map((item) => (
              <article
                key={item.title}
                className="rounded-xl border border-neutral-200 bg-white px-4 py-4 dark:border-white/10 dark:bg-black"
              >
                <h3 className="m-0 text-base font-semibold text-neutral-900 dark:text-white">{item.title}</h3>
                <p className="m-0 mt-2 text-sm leading-relaxed text-neutral-700 dark:text-white/78">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 dark:border-white/10 dark:bg-white/[0.03]">
          <h2 className="m-0 text-xl font-semibold text-neutral-900 dark:text-white">Work with us</h2>
          <p className="m-0 mt-2 max-w-2xl text-neutral-600 dark:text-white/75">
            Tell us about your market, timeline, and what “local” should feel like for your audience. We will match you with the
            right producers, creatives, and on-the-ground partners.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/join-us/advisors"
              className="inline-flex min-h-[42px] items-center rounded-full border border-neutral-900 bg-neutral-900 px-5 text-sm font-semibold text-white no-underline transition hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
            >
              Partner with Culturin
            </Link>
            <Link
              href="/about"
              className="inline-flex min-h-[42px] items-center rounded-full border border-neutral-300 bg-white px-5 text-sm font-semibold text-neutral-900 no-underline transition hover:bg-neutral-50 dark:border-white/20 dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/10"
            >
              About the platform
            </Link>
          </div>
        </section>
      </ContentPageShell>
      <SiteFooter />
    </>
  );
}
