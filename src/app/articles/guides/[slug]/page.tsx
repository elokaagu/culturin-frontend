import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { notFound } from "next/navigation";

import Header from "../../../components/Header";
import { getTravelGuideCategory, getTravelGuideContent } from "../../../../lib/travelGuideContent";
import { getShowcaseBlogCards } from "../../../../lib/cms/showcaseContent";
import {
  IMAGE_BLUR_DATA_URL,
  isBundledPlaceholderSrc,
  resolveContentImageSrc,
} from "../../../../lib/imagePlaceholder";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const content = getTravelGuideContent(params.slug);
  if (!content) return { title: "Guide" };
  return {
    title: `${content.title} | Travel Guides | Culturin`,
    description: content.intro,
  };
}

export default function GuideDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const content = getTravelGuideContent(params.slug);
  const category = getTravelGuideCategory(params.slug);
  if (!content || !category) notFound();

  const featuredCards = getShowcaseBlogCards().filter((card) =>
    content.featuredArticleSlugs.includes(card.currentSlug),
  );

  return (
    <>
      <Header />
      <main className="min-h-dvh bg-black pb-16 pt-[var(--header-offset)] text-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
          <Link
            href="/articles"
            className="inline-flex items-center text-sm font-medium text-amber-400/85 no-underline transition hover:text-amber-300"
          >
            ← Back to travel guides
          </Link>

          <header className="mt-6 grid gap-6 border-b border-white/10 pb-8 md:grid-cols-[1.1fr_1fr]">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{content.title}</h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/75">{content.intro}</p>
              <ul className="mt-5 list-disc space-y-1 pl-5 text-sm text-white/70 marker:text-amber-400/80">
                {content.keyPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-950">
              {category.imageUrl ? (
                <Image
                  src={category.imageUrl}
                  alt={category.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                  unoptimized={isBundledPlaceholderSrc(category.imageUrl)}
                />
              ) : (
                <div className={`absolute inset-0 ${category.overlayClass}`} />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
              <div className="relative z-10 flex h-full min-h-[16rem] flex-col justify-end p-5">
                <p className="self-start rounded border border-white/25 bg-white/10 px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.08em] text-white/95">
                  {category.articleCount} articles
                </p>
              </div>
            </div>
          </header>

          <section className="mt-8 grid gap-4 sm:grid-cols-2">
            {content.sections.map((section) => (
              <article key={section.title} className="rounded-xl border border-white/10 bg-neutral-950/70 p-5">
                <h2 className="text-2xl font-semibold tracking-tight text-white">{section.title}</h2>
                <p className="mt-3 text-base leading-relaxed text-white/75">{section.body}</p>
              </article>
            ))}
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold tracking-tight text-white">Explore this guide</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {content.searchLinks.map((item) => (
                <Link
                  key={item.query}
                  href={`/search?query=${encodeURIComponent(item.query)}`}
                  className="rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-sm font-medium text-white no-underline transition hover:bg-white/[0.09]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </section>

          {featuredCards.length > 0 ? (
            <section className="mt-10">
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-white">Featured reads</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {featuredCards.map((card) => {
                  const imageSrc = resolveContentImageSrc(card.titleImageUrl);
                  return (
                    <Link
                      key={card.currentSlug}
                      href={`/articles/${card.currentSlug}`}
                      className="group overflow-hidden rounded-xl border border-white/10 bg-neutral-950/70 no-underline"
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
                        <Image
                          src={imageSrc}
                          alt={card.title}
                          fill
                          className="object-cover transition duration-300 group-hover:scale-[1.03]"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          placeholder="blur"
                          blurDataURL={IMAGE_BLUR_DATA_URL}
                          unoptimized={isBundledPlaceholderSrc(imageSrc)}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="line-clamp-2 text-lg font-semibold leading-tight text-white">{card.title}</h3>
                        <p className="mt-2 line-clamp-2 text-sm text-white/70">{card.summary}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ) : null}
        </div>
      </main>
    </>
  );
}
