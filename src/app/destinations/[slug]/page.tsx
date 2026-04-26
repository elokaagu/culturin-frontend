import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";

import { destinations, getDestinationBySlug } from "../../../lib/destinationsData";
import { getDestinationContent } from "../../../lib/destinationContent";
import { appPageContainerClass } from "@/lib/appLayout";
import { ContentPageShell } from "../../components/layout/ContentPageShell";
import { IMAGE_BLUR_DATA_URL } from "../../../lib/imagePlaceholder";

type PageProps = { params: { slug: string } };

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const d = getDestinationBySlug(params.slug);
  if (!d) return { title: "Destination" };
  return {
    title: `${d.name} | Culturin`,
    description: d.country
      ? `Guides, stories, and ideas for ${d.name}, ${d.country}.`
      : `Guides, stories, and ideas for ${d.name}.`,
  };
}

export default function DestinationDetailPage({ params }: PageProps) {
  const d = getDestinationBySlug(params.slug);
  if (!d) notFound();
  const content = getDestinationContent(d.slug);

  const highlights = content?.highlights ?? ["Iconic city landmarks", "Neighborhood walks", "Local-led experiences"];
  const neighborhoods = content?.neighborhoods ?? ["Historic center", "Creative quarter", "Waterfront district"];
  const foodToTry = content?.foodToTry ?? ["Signature local dishes", "Seasonal street food", "Traditional desserts"];
  const localTips = content?.localTips ?? ["Start early for major sights", "Use local transport apps", "Keep a flexible evening plan"];

  return (
    <ContentPageShell
      mainClassName="bg-black pb-20 pt-[var(--header-offset)] text-white"
      innerClassName={appPageContainerClass}
    >
      <nav className="mb-8 pt-6 text-sm text-white/50" aria-label="Breadcrumb">
        <div className="flex flex-wrap items-center gap-1.5">
          <Link href="/" className="text-amber-300/90 no-underline transition hover:text-amber-200">
            Home
          </Link>
          <span aria-hidden>/</span>
          <Link href="/destinations" className="text-amber-300/90 no-underline transition hover:text-amber-200">
            Destinations
          </Link>
          <span aria-hidden>/</span>
          <span className="text-white/75">{d.name}</span>
        </div>
      </nav>

      <section className="grid grid-cols-1 gap-10 lg:grid-cols-[1.25fr,0.75fr] lg:items-start">
        <div className="space-y-7">
          <header className="space-y-3">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.22em] text-white/45">Destination guide</p>
            <h1 className="m-0 text-4xl leading-tight text-white sm:text-5xl">{d.name}</h1>
            <p className="m-0 text-base text-white/65">{d.country ?? "Worldwide"}</p>
            <p className="m-0 max-w-3xl text-lg leading-relaxed text-white/80">
              {content?.intro ??
                `${d.name} is a destination worth exploring through neighborhood culture, food, and local stories.`}
            </p>
          </header>

          <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 sm:grid-cols-2">
            <div>
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-white/45">Vibe</p>
              <p className="m-0 mt-2 text-base text-white/85">{content?.vibe ?? "Cultural, social, and always evolving."}</p>
            </div>
            <div>
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-white/45">Best time to visit</p>
              <p className="m-0 mt-2 text-base text-white/85">{content?.bestTime ?? "Year-round, with peak season in mild weather months."}</p>
            </div>
          </div>

          <section aria-labelledby="dest-highlights">
            <h2 id="dest-highlights" className="m-0 text-sm font-semibold uppercase tracking-[0.2em] text-white/45">
              Top highlights
            </h2>
            <ul className="m-0 mt-4 grid list-none gap-2 p-0">
              {highlights.map((item) => (
                <li key={item} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white/85">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="grid gap-6 sm:grid-cols-2">
            <div>
              <h2 className="m-0 text-sm font-semibold uppercase tracking-[0.2em] text-white/45">Neighborhoods</h2>
              <ul className="m-0 mt-3 list-disc space-y-1.5 pl-5 text-white/80">
                {neighborhoods.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="m-0 text-sm font-semibold uppercase tracking-[0.2em] text-white/45">Food to try</h2>
              <ul className="m-0 mt-3 list-disc space-y-1.5 pl-5 text-white/80">
                {foodToTry.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <h2 className="m-0 text-sm font-semibold uppercase tracking-[0.2em] text-white/45">Local tips</h2>
            <ul className="m-0 mt-3 list-disc space-y-2 pl-5 text-white/80">
              {localTips.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-[calc(var(--header-offset)+1.5rem)]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-neutral-950">
            <Image
              src={d.imageUrl}
              alt={d.imageAlt}
              fill
              className="object-cover"
              priority
              placeholder="blur"
              blurDataURL={IMAGE_BLUR_DATA_URL}
              sizes="(max-width: 1024px) 100vw, 28rem"
            />
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-white/45">Next steps</p>
            <p className="m-0 mt-2 text-sm leading-relaxed text-white/75">
              Discover more places on the destinations index, then pair this city with travel guides and curated experiences.
            </p>
            <Link
              href="/destinations"
              className="mt-3 inline-flex items-center text-sm font-medium text-amber-300/90 no-underline transition hover:text-amber-200"
            >
              Browse all destinations
            </Link>
          </div>
        </aside>
      </section>
    </ContentPageShell>
  );
}
