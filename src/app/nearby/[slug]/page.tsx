import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";

import IslandNav from "../../components/IslandNav";
import HomeFooter from "../../components/HomeFooter";
import { editorialScopeClass, EDITORIAL_BG, EDITORIAL_INK } from "@/lib/theme/culturinTokens";
import SafeContentImage from "../../components/SafeContentImage";
import {
  getNearbySpotBySlug,
  nearbyResultsBySlug,
  nearbySpots,
} from "../../../lib/nearbySpotsData";
import { cmsImageUnoptimized, IMAGE_BLUR_DATA_URL, resolveContentImageSrc } from "../../../lib/imagePlaceholder";

type PageProps = {
  params: { slug: string };
};

const displayFont = { fontFamily: "var(--font-display), 'Times New Roman', serif" };

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

  const heroSrc = resolveContentImageSrc(spot.imageUrl);

  return (
    <div className={editorialScopeClass} style={{ background: EDITORIAL_BG, color: EDITORIAL_INK }}>
      <IslandNav />
      <main className="min-h-dvh pb-16" style={{ paddingTop: "8rem" }}>
        <section className="mx-auto w-full max-w-5xl px-4 sm:px-6">
          <nav className="mb-6 pt-6 text-sm" style={{ color: "var(--c-muted)" }} aria-label="Breadcrumb">
            <Link href="/" className="no-underline transition hover:opacity-80" style={{ color: "var(--c-accent)" }}>
              Home
            </Link>
            <span className="px-1" style={{ color: "var(--c-muted)" }} aria-hidden>
              /
            </span>
            <Link href="/" className="no-underline transition hover:opacity-80" style={{ color: "var(--c-accent)" }}>
              Nearby
            </Link>
            <span className="px-1" style={{ color: "var(--c-muted)" }} aria-hidden>
              /
            </span>
            <span style={{ color: "var(--c-ink)" }}>{spot.title}</span>
          </nav>

          <div className="grid gap-8 rounded-3xl border p-4 sm:p-6 lg:grid-cols-[1.1fr,0.9fr]" style={{ borderColor: "var(--c-rule)" }}>
            <div className="space-y-4">
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--c-muted)" }}>Nearby result</p>
              <h1 className="m-0 text-3xl font-medium tracking-tight sm:text-4xl" style={{ ...displayFont, color: "var(--c-ink)" }}>{spot.title}</h1>
              <p className="m-0 text-sm" style={{ color: "var(--c-muted)" }}>
                {spot.city} · {spot.category}
              </p>
              <p className="m-0 max-w-xl text-base leading-relaxed" style={{ color: "var(--c-muted)" }}>{data.intro}</p>

              <div className="rounded-2xl border p-4" style={{ borderColor: "var(--c-rule)" }}>
                <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--c-muted)" }}>Quick tips</p>
                <ul className="m-0 mt-3 list-disc space-y-1.5 pl-5 text-sm" style={{ color: "var(--c-muted)" }}>
                  {data.tips.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border bg-neutral-900" style={{ borderColor: "var(--c-rule)" }}>
              <SafeContentImage
                src={heroSrc}
                alt={spot.imageAlt}
                className="object-cover"
                blurDataURL={IMAGE_BLUR_DATA_URL}
                sizes="(max-width: 1024px) 100vw, 28rem"
                unoptimized={cmsImageUnoptimized(heroSrc)}
              />
            </div>
          </div>

          <section className="mt-8">
            <h2 className="m-0 text-lg font-medium" style={{ ...displayFont, color: "var(--c-ink)" }}>Suggested results</h2>
            <ul className="m-0 mt-4 grid list-none gap-3 p-0">
              {data.results.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-xl border px-4 py-4 no-underline transition hover:opacity-90"
                    style={{ borderColor: "var(--c-rule)" }}
                  >
                    <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--c-muted)" }}>
                      {kindLabel[item.kind]}
                    </p>
                    <p className="m-0 mt-2 text-base font-medium" style={{ color: "var(--c-ink)" }}>{item.title}</p>
                    <p className="m-0 mt-1 text-sm" style={{ color: "var(--c-muted)" }}>{item.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </section>
      </main>
      <HomeFooter />
    </div>
  );
}
