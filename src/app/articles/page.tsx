import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "next-view-transitions";

import Header from "../components/Header";
import { getShowcaseBlogCards } from "../../lib/cms/showcaseContent";
import { getCmsDbOrNull } from "../../lib/cms/server";
import { listBlogs } from "../../lib/cms/queries";
import {
  IMAGE_BLUR_DATA_URL,
  isBundledPlaceholderSrc,
  resolveContentImageSrc,
} from "../../lib/imagePlaceholder";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Articles | Culturin",
    description: "Explore all Culturin articles, including editorial stories, city insights, and travel guidance.",
  };
}

export default async function ArticlesPage() {
  const db = getCmsDbOrNull();
  const cmsArticles = db ? await listBlogs(db) : [];
  const articles = cmsArticles.length > 0 ? cmsArticles : getShowcaseBlogCards();
  const [featured, ...rest] = articles;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50 pb-20 pt-[var(--header-offset)] text-neutral-900 dark:bg-black dark:text-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
          <header className="mb-8 border-b border-neutral-200 pb-8 sm:mb-10 dark:border-white/10">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Articles</h1>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-neutral-600 dark:text-white/65 sm:text-lg">
              All stories, city insights, and cultural guides in one place.
            </p>
          </header>

          {featured ? (
            <Link href={`/articles/${featured.currentSlug}`} className="group mb-8 block overflow-hidden rounded-2xl border border-neutral-200 bg-white no-underline dark:border-white/10 dark:bg-neutral-950 sm:mb-10">
              <div className="relative aspect-[16/8] w-full overflow-hidden">
                <Image
                  src={resolveContentImageSrc(featured.titleImageUrl)}
                  alt={featured.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.02]"
                  sizes="100vw"
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                  unoptimized={isBundledPlaceholderSrc(resolveContentImageSrc(featured.titleImageUrl))}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-400/80">Featured article</p>
                <h2 className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
                  {featured.title}
                </h2>
                <p className="mt-3 max-w-3xl text-base leading-relaxed text-neutral-700 dark:text-white/75">{featured.summary}</p>
              </div>
            </Link>
          ) : null}

          {rest.length > 0 ? (
            <section aria-label="Latest articles">
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-neutral-900 dark:text-white/90 sm:text-2xl">Latest articles</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((article) => (
                  <Link
                    key={article.currentSlug}
                    href={`/articles/${article.currentSlug}`}
                    className="group overflow-hidden rounded-xl border border-neutral-200 bg-white no-underline dark:border-white/10 dark:bg-neutral-950/70"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden">
                      <Image
                        src={resolveContentImageSrc(article.titleImageUrl)}
                        alt={article.title}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        placeholder="blur"
                        blurDataURL={IMAGE_BLUR_DATA_URL}
                        unoptimized={isBundledPlaceholderSrc(resolveContentImageSrc(article.titleImageUrl))}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="line-clamp-2 text-lg font-semibold leading-tight text-neutral-900 dark:text-white">{article.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-600 dark:text-white/70">{article.summary}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>
    </>
  );
}
