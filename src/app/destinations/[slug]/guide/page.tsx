import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { notFound } from "next/navigation";

import { BriefingReport } from "@/app/briefings/BriefingReport";
import { ContentPageShell } from "@/app/components/layout/ContentPageShell";
import { appPageContainerClass } from "@/lib/appLayout";
import { briefingsDb, getPublishedGuide } from "@/lib/briefings/store";
import { getDestinationBySlug } from "@/lib/destinationsData";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imagePlaceholder";

/** Rebuilt hourly, and immediately when a guide is published or withdrawn. */
export const revalidate = 3600;

type PageProps = { params: { slug: string } };

const DISPLAY = { fontFamily: "var(--font-display), 'Times New Roman', serif" };

async function load(slug: string) {
  return getPublishedGuide(slug).catch(() => null);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const guide = await load(params.slug);
  if (!guide) return { title: "Culture guide | Culturin" };
  const { request: r, briefing: b } = guide;
  return {
    title: `${r.place} culture guide: food, history, music and art | Culturin`,
    description: b.sections.snapshot.text.slice(0, 160) || `The food, history, music, art and people of ${r.place}, ${r.country}.`,
  };
}

export default async function CultureGuidePage({ params }: PageProps) {
  const guide = await load(params.slug);
  if (!guide) notFound();
  const { request: r, briefing: b, sources } = guide;
  const destination = getDestinationBySlug(params.slug);
  const { data: curator } = b.curatorId
    ? await briefingsDb().from("cms_curators").select("name, slug").eq("id", b.curatorId).maybeSingle()
    : { data: null };
  const reviewed = b.reviewedAt ? new Date(b.reviewedAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" }) : null;

  return (
    <ContentPageShell mainClassName="min-h-dvh pb-20 antialiased" innerClassName={appPageContainerClass}>
      <nav className="mb-8 pt-6 text-sm" style={{ color: "var(--c-muted)" }} aria-label="Breadcrumb">
        <div className="flex flex-wrap items-center gap-1.5">
          <Link href="/" className="no-underline transition hover:opacity-80" style={{ color: "var(--c-accent)" }}>
            Home
          </Link>
          <span aria-hidden>/</span>
          <Link href="/destinations" className="no-underline transition hover:opacity-80" style={{ color: "var(--c-accent)" }}>
            Cities
          </Link>
          <span aria-hidden>/</span>
          {destination ? (
            <>
              <Link href={`/destinations/${destination.slug}`} className="no-underline transition hover:opacity-80" style={{ color: "var(--c-accent)" }}>
                {destination.name}
              </Link>
              <span aria-hidden>/</span>
            </>
          ) : null}
          <span style={{ color: "var(--c-ink)" }}>Culture guide</span>
        </div>
      </nav>

      <header className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--c-muted)" }}>
            Culturin culture guide
          </p>
          <h1 className="m-0 mt-3 text-5xl font-medium leading-[1.05] sm:text-6xl" style={{ ...DISPLAY, color: "var(--c-ink)" }}>
            {r.place}
          </h1>
          <p className="m-0 mt-2 text-base" style={{ color: "var(--c-muted)" }}>
            {r.country}
          </p>
          <p className="m-0 mt-6 max-w-2xl text-lg leading-relaxed" style={{ color: "var(--c-muted)" }}>
            The food, history, music, art and people of {r.place}, and the moments worth planning around this year.
          </p>
          {reviewed ? (
            <p className="m-0 mt-6 text-sm" style={{ color: "var(--c-muted)" }}>
              Researched by Culturin and checked by{" "}
              {curator?.slug ? (
                <Link href={`/curators/${curator.slug}`} style={{ color: "var(--c-accent)" }}>
                  {curator.name}
                </Link>
              ) : (
                "our curators"
              )}
              , {reviewed}.
            </p>
          ) : null}
        </div>
        {destination?.imageUrl ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src={destination.imageUrl}
              alt={destination.imageAlt ?? r.place}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              placeholder="blur"
              blurDataURL={IMAGE_BLUR_DATA_URL}
              className="object-cover"
            />
          </div>
        ) : null}
      </header>

      <BriefingReport
        sections={b.sections}
        sources={sources}
        audience="guide"
        localNotes={b.localNotes}
        curatorName={(curator?.name as string | undefined) ?? null}
      />
    </ContentPageShell>
  );
}
