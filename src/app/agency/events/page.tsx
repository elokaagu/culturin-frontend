import type { Metadata } from "next";
import { Link } from "next-view-transitions";

import { ContentPageShell } from "@/app/components/layout/ContentPageShell";
import SafeContentImage from "@/app/components/SafeContentImage";
import SiteFooter from "@/app/components/SiteFooter";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imagePlaceholder";

type Experience = {
  title: string;
  city: string;
  year: string;
  summary: string;
  imageUrl: string;
  imageAlt: string;
  primary?: boolean;
};

const experiences: Experience[] = [
  {
    title: "Amafrobeat Experience",
    city: "Lagos",
    year: "2025",
    summary:
      "Our flagship live-format event blending Afrobeats, storytelling, and curated local food moments into one immersive guest journey.",
    imageUrl:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Crowd at a live Afrobeat concert with stage lights",
    primary: true,
  },
  {
    title: "Sunset Rooftop Listening Session",
    city: "Barcelona",
    year: "2025",
    summary: "A golden-hour vinyl-to-live set with local DJs, storytellers, and partner activations.",
    imageUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "DJ set on a rooftop with sunset sky",
  },
  {
    title: "Neighborhood Culture Walks",
    city: "Lagos",
    year: "2024",
    summary: "Street-led cultural tours built with local hosts, artists, and small businesses.",
    imageUrl:
      "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "People walking through a vibrant city neighborhood",
  },
  {
    title: "Culturin Makers Market",
    city: "Accra",
    year: "2024",
    summary: "Independent fashion, design, and food vendors with a performance-led evening close.",
    imageUrl:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Creative market stalls and visitors browsing",
  },
  {
    title: "Diaspora Dinner Series",
    city: "London",
    year: "2025",
    summary: "Chef-led tables celebrating migration stories through tasting menus and live narration.",
    imageUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Communal dinner table with guests",
  },
  {
    title: "City Sound Lab",
    city: "Barcelona",
    year: "2024",
    summary: "Recording sessions capturing ambient city sounds and live improvisation performances.",
    imageUrl:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Musicians performing in an intimate venue",
  },
  {
    title: "Local Legends Panel Night",
    city: "Lagos",
    year: "2025",
    summary: "Conversations with creators, curators, and community builders shaping modern urban culture.",
    imageUrl:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Panel discussion on stage with audience",
  },
  {
    title: "Street Food After Hours",
    city: "Barcelona",
    year: "2025",
    summary: "Night-market format with regional chefs, live percussion, and roaming performances.",
    imageUrl:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Night food market with lights and stalls",
  },
  {
    title: "Art x Music Pop-Up",
    city: "Johannesburg",
    year: "2024",
    summary: "A gallery-meets-live-set format built around emerging visual artists and sound collectives.",
    imageUrl:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Contemporary art installation with visitors",
  },
];

export const metadata: Metadata = {
  title: "Agency Events | Culturin",
  description: "A visual archive of Culturin events and experiences, led by the Amafrobeat Experience.",
};

export default function AgencyEventsPage() {
  return (
    <>
      <ContentPageShell
        mainClassName="min-h-dvh bg-neutral-50 pb-16 pt-[var(--header-offset)] text-neutral-900 antialiased dark:bg-black dark:text-white"
        innerClassName="mx-auto w-full max-w-6xl px-4 sm:px-6"
      >
        <nav aria-label="Breadcrumb" className="mb-6 pt-6">
          <div className="flex items-center gap-1 text-sm">
            <Link href="/" className="text-amber-700 no-underline transition hover:underline dark:text-amber-300/95">
              Home
            </Link>
            <span className="text-neutral-400 dark:text-white/35" aria-hidden>
              /
            </span>
            <Link href="/agency" className="text-amber-700 no-underline transition hover:underline dark:text-amber-300/95">
              Agency
            </Link>
            <span className="text-neutral-400 dark:text-white/35" aria-hidden>
              /
            </span>
            <span className="text-neutral-600 dark:text-white/65">Events</span>
          </div>
        </nav>

        <section className="mb-8">
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500 dark:text-white/45">Culturin Agency</p>
          <h1 className="m-0 mt-3 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
            Events & experiences gallery
          </h1>
          <p className="m-0 mt-4 max-w-3xl text-base leading-relaxed text-neutral-600 dark:text-white/75">
            A Pinterest-style look at Culturin moments we have produced, hosted, and activated — with the Amafrobeat
            Experience as the flagship format.
          </p>
        </section>

        <section className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {experiences.map((item) => (
            <article
              key={item.title}
              className="mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-white/[0.03]"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-900">
                <SafeContentImage
                  src={item.imageUrl}
                  alt={item.imageAlt}
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
                  {item.primary ? (
                    <span className="rounded-full border border-amber-300/80 bg-amber-300/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-100">
                      Primary
                    </span>
                  ) : null}
                  <span className="rounded-full border border-white/65 bg-black/35 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                    {item.city}
                  </span>
                  <span className="rounded-full border border-white/65 bg-black/35 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                    {item.year}
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 z-[1] px-4 pb-4 pt-16">
                  <h2 className="m-0 text-lg font-semibold text-white">{item.title}</h2>
                  <p className="m-0 mt-2 text-sm leading-relaxed text-white/85">{item.summary}</p>
                </div>
              </div>
            </article>
          ))}
        </section>
      </ContentPageShell>
      <SiteFooter />
    </>
  );
}
