import Image from "next/image";
import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";

import Header from "../../components/Header";
import {
  getNearbySpotBySlug,
  nearbyResultsBySlug,
  nearbySpots,
} from "../../../lib/nearbySpotsData";
import { IMAGE_BLUR_DATA_URL } from "../../../lib/imagePlaceholder";

type PageProps = {
  params: { slug: string };
};

const kindLabel: Record<"experience" | "guide" | "video" | "destination", string> = {
  experience: "Experience",
  guide: "Guide",
  video: "Video",
  destination: "Destination",
};

export function generateStaticParams() {
  return nearbySpots.map((spot) => ({ slug: spot.slug }));
}

export default function NearbyResultPage({ params }: PageProps) {
  const spot = getNearbySpotBySlug(params.slug);
  if (!spot) notFound();

  const data = nearbyResultsBySlug[spot.slug];
  if (!data) notFound();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black pb-16 pt-[var(--header-offset)] text-white">
        <section className="mx-auto w-full max-w-5xl px-4 sm:px-6">
          <nav className="mb-6 pt-6 text-sm text-white/65" aria-label="Breadcrumb">
            <Link href="/" className="text-amber-300/95 no-underline transition hover:text-amber-200">
              Home
            </Link>
            <span className="px-1 text-white/30" aria-hidden>
              /
            </span>
            <Link href="/" className="text-amber-300/95 no-underline transition hover:text-amber-200">
              Nearby
            </Link>
            <span className="px-1 text-white/30" aria-hidden>
              /
            </span>
            <span className="text-white/80">{spot.title}</span>
          </nav>

          <div className="grid gap-8 rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-6 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="space-y-4">
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.22em] text-white/45">Nearby result</p>
              <h1 className="m-0 text-3xl tracking-tight sm:text-4xl">{spot.title}</h1>
              <p className="m-0 text-sm text-white/60">
                {spot.city} · {spot.category}
              </p>
              <p className="m-0 max-w-xl text-base leading-relaxed text-white/80">{data.intro}</p>

              <div className="rounded-2xl border border-white/10 bg-black/60 p-4">
                <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-white/45">Quick tips</p>
                <ul className="m-0 mt-3 list-disc space-y-1.5 pl-5 text-sm text-white/80">
                  {data.tips.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-neutral-900">
              <Image
                src={spot.imageUrl}
                alt={spot.imageAlt}
                fill
                className="object-cover"
                priority
                placeholder="blur"
                blurDataURL={IMAGE_BLUR_DATA_URL}
                sizes="(max-width: 1024px) 100vw, 28rem"
              />
            </div>
          </div>

          <section className="mt-8">
            <h2 className="m-0 text-lg font-semibold text-white">Suggested results</h2>
            <ul className="m-0 mt-4 grid list-none gap-3 p-0">
              {data.results.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4 no-underline transition hover:border-white/25 hover:bg-white/[0.06]"
                  >
                    <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                      {kindLabel[item.kind]}
                    </p>
                    <p className="m-0 mt-2 text-base font-medium text-white">{item.title}</p>
                    <p className="m-0 mt-1 text-sm text-white/70">{item.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </section>
      </main>
    </>
  );
}
