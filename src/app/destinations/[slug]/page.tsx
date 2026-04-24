import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";

import { destinations, getDestinationBySlug } from "../../../lib/destinationsData";
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

  return (
    <ContentPageShell
      mainClassName="min-h-screen bg-white pb-16 pt-[var(--header-offset)] text-neutral-900 dark:bg-black dark:text-white"
    >
      <div className="w-full max-w-3xl">
        <nav className="mb-6" aria-label="Breadcrumb">
          <Link
            href="/"
            className="text-sm font-medium text-amber-800 no-underline hover:underline dark:text-amber-300/95"
          >
            Home
          </Link>
          <span className="px-1 text-neutral-400" aria-hidden>
            /
          </span>
          <Link
            href="/destinations"
            className="text-sm font-medium text-amber-800 no-underline hover:underline dark:text-amber-300/95"
          >
            Destinations
          </Link>
          <span className="px-1 text-neutral-400" aria-hidden>
            /
          </span>
          <span className="text-sm text-neutral-600 dark:text-white/60">{d.name}</span>
        </nav>
        <article>
          <header className="mb-6">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{d.name}</h1>
            {d.country ? (
              <p className="mt-2 text-lg text-neutral-600 dark:text-white/70">{d.country}</p>
            ) : null}
          </header>
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-neutral-200 dark:bg-neutral-800">
            <Image
              src={d.imageUrl}
              alt={d.imageAlt}
              fill
              className="object-cover"
              priority
              placeholder="blur"
              blurDataURL={IMAGE_BLUR_DATA_URL}
              sizes="(max-width: 768px) 100vw, 42rem"
            />
          </div>
          <p className="mt-8 text-base leading-relaxed text-neutral-700 dark:text-white/85">
            This is a starter page for {d.name}
            {d.country ? `, ${d.country}` : ""}. Open articles and search from the home page to
            go deeper, or return to the{" "}
            <Link
              href="/destinations"
              className="font-medium text-amber-800 no-underline underline-offset-2 hover:underline dark:text-amber-300/95"
            >
              full destinations list
            </Link>
            .
          </p>
        </article>
      </div>
    </ContentPageShell>
  );
}
