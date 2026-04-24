import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";

import { destinations, getDestinationBySlug } from "../../../lib/destinationsData";
import { DetailPageShell } from "../../components/detail/DetailPageShell";
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

  return (
    <DetailPageShell>
      <nav className="mb-8" aria-label="Breadcrumb">
        <div className="flex flex-wrap items-baseline gap-x-1.5 text-sm text-[#9a9a9a]">
          <Link
            href="/"
            className="text-amber-400/90 no-underline transition hover:text-amber-300/95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-500/50"
          >
            Home
          </Link>
          <span aria-hidden className="text-white/30">
            /
          </span>
          <Link
            href="/destinations"
            className="text-amber-400/90 no-underline transition hover:text-amber-300/95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-500/50"
          >
            Destinations
          </Link>
        </div>
      </nav>

      <header className="text-left">
        <h1 className="m-0 text-2xl font-medium leading-tight tracking-tight text-white sm:text-[1.6rem]">{d.name}</h1>
        {d.country ? (
          <p className="mt-2.5 text-sm font-normal text-[#9a9a9a] sm:text-base">{d.country}</p>
        ) : null}
      </header>

      <ul className="m-0 mt-8 list-none space-y-5 p-0" role="list" aria-label="Destination image">
        <li className="overflow-hidden rounded-3xl bg-neutral-950/80 ring-1 ring-white/[0.08]">
          <div className="relative aspect-[3/4] w-full sm:aspect-[16/10]">
            <Image
              src={d.imageUrl}
              alt={d.imageAlt}
              fill
              className="object-cover"
              priority
              placeholder="blur"
              blurDataURL={IMAGE_BLUR_DATA_URL}
              sizes="(max-width: 640px) 100vw, 28rem"
            />
          </div>
        </li>
      </ul>

      <section className="mt-10" aria-labelledby="dest-plug">
        <h2 id="dest-plug" className="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
          Explore
        </h2>
        <p className="mb-0 mt-4 text-base font-normal leading-[1.7] text-white/[0.78]">
          Find guides, stories, and search from the home page, or go back to the full{" "}
          <Link
            href="/destinations"
            className="text-amber-400/90 no-underline underline-offset-2 transition hover:underline"
          >
            destinations list
          </Link>
          .
        </p>
      </section>
    </DetailPageShell>
  );
}
