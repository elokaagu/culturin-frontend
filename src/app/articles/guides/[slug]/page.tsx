import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { notFound } from "next/navigation";

import IslandNav from "../../../components/IslandNav";
import HomeFooter from "../../../components/HomeFooter";
import { editorialScopeClass, EDITORIAL_BG, EDITORIAL_INK } from "@/lib/theme/culturinTokens";
import SafeContentImage from "../../../components/SafeContentImage";
import { getTravelGuideCategory, getTravelGuideContent } from "../../../../lib/travelGuideContent";
import { getShowcaseBlogCards } from "../../../../lib/cms/showcaseContent";
import { filterPublicBlogs } from "@/lib/cms/blockedFromSite";
import {
  IMAGE_BLUR_DATA_URL,
  cmsImageUnoptimized,
  isBundledPlaceholderSrc,
  resolveContentImageSrc,
} from "../../../../lib/imagePlaceholder";

const displayFont = { fontFamily: "var(--font-display), 'Times New Roman', serif" };

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

  const featuredCards = filterPublicBlogs(
    getShowcaseBlogCards().filter((card) => content.featuredArticleSlugs.includes(card.currentSlug)),
  );

  return (
    <div className={editorialScopeClass} style={{ background: EDITORIAL_BG, color: EDITORIAL_INK }}>
      <IslandNav />
      <main className="min-h-dvh pb-16 antialiased" style={{ paddingTop: "8rem" }}>
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
          <Link
            href="/travel-guides"
            className="inline-flex items-center text-sm font-medium no-underline transition hover:opacity-80"
            style={{ color: "var(--c-accent)" }}
          >
            ← Back to travel guides
          </Link>

          <header className="mt-6 grid gap-6 border-b pb-8 md:grid-cols-[1.1fr_1fr]" style={{ borderColor: "var(--c-rule)" }}>
            <div>
              <h1 className="text-4xl font-medium tracking-tight sm:text-5xl" style={{ ...displayFont, color: "var(--c-ink)" }}>
                {content.title}
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed" style={{ color: "var(--c-muted)" }}>{content.intro}</p>
              <ul className="mt-5 list-disc space-y-1 pl-5 text-sm" style={{ color: "var(--c-muted)" }}>
                {content.keyPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>

            <div className="relative overflow-hidden rounded-2xl border" style={{ borderColor: "var(--c-rule)" }}>
              {category.imageUrl ? (
                <SafeContentImage
                  src={category.imageUrl}
                  alt={category.imageAlt}
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                  unoptimized={isBundledPlaceholderSrc(category.imageUrl) || cmsImageUnoptimized(category.imageUrl)}
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
              <article key={section.title} className="rounded-xl border p-5" style={{ borderColor: "var(--c-rule)" }}>
                <h2 className="text-2xl font-medium tracking-tight" style={{ ...displayFont, color: "var(--c-ink)" }}>{section.title}</h2>
                <p className="mt-3 text-base leading-relaxed" style={{ color: "var(--c-muted)" }}>{section.body}</p>
              </article>
            ))}
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-medium tracking-tight" style={{ ...displayFont, color: "var(--c-ink)" }}>Explore this guide</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {content.searchLinks.map((item) => (
                <Link
                  key={item.query}
                  href={`/search?query=${encodeURIComponent(item.query)}`}
                  className="rounded-full border px-3.5 py-1.5 text-sm font-medium no-underline transition hover:opacity-80"
                  style={{ borderColor: "var(--c-rule)", color: "var(--c-ink)" }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </section>

          {featuredCards.length > 0 ? (
            <section className="mt-10">
              <h2 className="mb-4 text-xl font-medium tracking-tight" style={{ ...displayFont, color: "var(--c-ink)" }}>Featured reads</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {featuredCards.map((card) => {
                  const imageSrc = resolveContentImageSrc(card.titleImageUrl);
                  return (
                    <Link
                      key={card.currentSlug}
                      href={`/articles/${card.currentSlug}`}
                      className="group overflow-hidden rounded-xl border no-underline transition"
                      style={{ borderColor: "var(--c-rule)" }}
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-200 dark:bg-neutral-900">
                        <SafeContentImage
                          src={imageSrc}
                          alt={card.title}
                          className="object-cover transition duration-300 group-hover:scale-[1.03]"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          blurDataURL={IMAGE_BLUR_DATA_URL}
                          unoptimized={isBundledPlaceholderSrc(imageSrc) || cmsImageUnoptimized(imageSrc)}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="line-clamp-2 text-lg font-medium leading-tight" style={{ ...displayFont, color: "var(--c-ink)" }}>
                          {card.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm" style={{ color: "var(--c-muted)" }}>{card.summary}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ) : null}
        </div>
      </main>
      <HomeFooter />
    </div>
  );
}
