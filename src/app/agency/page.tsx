import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "next-view-transitions";

import { ContentPageShell } from "../components/layout/ContentPageShell";
import { IMAGE_BLUR_DATA_URL } from "../../lib/imagePlaceholder";

/** Same Unsplash + query pattern as /about; concert/crowd asset used elsewhere in the app. */
const HERO_SRC =
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=2200&q=80";

const pillars: ReadonlyArray<{ title: string; text: string; href?: string }> = [
  {
    title: "Advertising campaigns",
    text: "Brand and destination work rooted in real places — creative that respects local nuance and lands with audiences who care about culture, not just captions.",
  },
  {
    title: "Events",
    text: "Launches, cultural moments, and community gatherings designed to feel grounded where they happen, with production clarity that scales across markets.",
    href: "/agency/events",
  },
  {
    title: "Experiences",
    text: "Immersive formats — walks, tastings, performances, and partner activations — that put local voices first and leave guests with a story worth retelling.",
  },
];

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
            <span style={{ color: "var(--c-muted)" }}>Agency</span>
          </div>
        </nav>

        <section className="relative overflow-hidden rounded-3xl border" style={{ borderColor: "var(--c-rule)" }}>
          <div className="relative min-h-[18rem] sm:min-h-[24rem]">
            <Image
              src={HERO_SRC}
              alt="Live music event with crowd, stage, and warm lighting"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              placeholder="blur"
              blurDataURL={IMAGE_BLUR_DATA_URL}
              unoptimized
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/20"
              aria-hidden
            />
            <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 md:p-10">
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.22em] text-white/75">Culturin Agency</p>
              <h1
                className="m-0 mt-3 max-w-3xl text-balance text-3xl font-medium leading-tight tracking-tight text-white sm:text-5xl"
                style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
              >
                Campaigns, events, and experiences that promote local cultures — globally
              </h1>
              <p className="m-0 mt-3 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
                We partner with brands, destinations, and cultural institutions to tell place-based stories with depth:
                from integrated advertising to live programming guests actually remember.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border p-5 sm:p-8" style={{ borderColor: "var(--c-rule)", background: "rgba(28,26,23,0.03)" }}>
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--c-muted)" }}>What we do</p>
          <p className="m-0 mt-3 max-w-4xl text-lg leading-relaxed" style={{ color: "var(--c-ink)" }}>
            Culturin Agency is the creative and experiential arm of Culturin. We design work that travels — without flattening
            the places it comes from. That means strategy and craft that honor local context, then find the thread that connects
            with audiences everywhere.
          </p>
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-3">
          {pillars.map((item) => {
            const cardClass = "rounded-2xl border p-5 no-underline transition hover:shadow-sm block";
            const cardStyle = { borderColor: "var(--c-rule)" };
            return item.href ? (
              <Link key={item.title} href={item.href} className={cardClass} style={cardStyle}>
                <h2
                  className="m-0 text-lg font-medium"
                  style={{ fontFamily: "var(--font-display), 'Times New Roman', serif", color: "var(--c-ink)" }}
                >
                  {item.title}
                </h2>
                <p className="m-0 mt-2 text-sm leading-relaxed" style={{ color: "var(--c-muted)" }}>{item.text}</p>
              </Link>
            ) : (
              <article key={item.title} className={cardClass} style={cardStyle}>
                <h2
                  className="m-0 text-lg font-medium"
                  style={{ fontFamily: "var(--font-display), 'Times New Roman', serif", color: "var(--c-ink)" }}
                >
                  {item.title}
                </h2>
                <p className="m-0 mt-2 text-sm leading-relaxed" style={{ color: "var(--c-muted)" }}>{item.text}</p>
              </article>
            );
          })}
        </section>

        <section className="mt-10">
          <h2
            className="m-0 text-2xl font-medium tracking-tight"
            style={{ fontFamily: "var(--font-display), 'Times New Roman', serif", color: "var(--c-ink)" }}
          >
            How we show up
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {scope.map((item) => (
              <article key={item.title} className="rounded-xl border px-4 py-4" style={{ borderColor: "var(--c-rule)" }}>
                <h3 className="m-0 text-base font-semibold" style={{ color: "var(--c-ink)" }}>{item.title}</h3>
                <p className="m-0 mt-2 text-sm leading-relaxed" style={{ color: "var(--c-muted)" }}>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border p-5 sm:p-6" style={{ borderColor: "var(--c-rule)" }}>
          <h2
            className="m-0 text-xl font-medium"
            style={{ fontFamily: "var(--font-display), 'Times New Roman', serif", color: "var(--c-ink)" }}
          >
            Work with us
          </h2>
          <p className="m-0 mt-2 max-w-2xl" style={{ color: "var(--c-muted)" }}>
            Tell us about your market, timeline, and what “local” should feel like for your audience. We will match you with the
            right producers, creatives, and on-the-ground partners.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/join-us/advisors"
              className="inline-flex min-h-[42px] items-center rounded-full px-5 text-xs font-semibold uppercase tracking-[0.16em] text-white no-underline transition hover:opacity-90"
              style={{ background: "var(--c-accent)" }}
            >
              Partner with Culturin
            </Link>
            <Link
              href="/about"
              className="inline-flex min-h-[42px] items-center rounded-full border px-5 text-xs font-semibold uppercase tracking-[0.16em] no-underline transition hover:opacity-80"
              style={{ borderColor: "var(--c-rule)", color: "var(--c-ink)" }}
            >
              About the platform
            </Link>
          </div>
        </section>
    </ContentPageShell>
  );
}
