"use client";

import { Link } from "next-view-transitions";
import type { fullCurator, simpleBlogCard } from "@/lib/interface";
import Header from "../../components/Header";
import SafeContentImage from "../../components/SafeContentImage";
import {
  IMAGE_BLUR_DATA_URL,
  isBundledPlaceholderSrc,
  resolveContentImageSrc,
} from "../../../lib/imagePlaceholder";

export default function CuratorClient({
  curator,
  articles,
}: {
  curator: fullCurator;
  articles: simpleBlogCard[];
}) {
  const bannerSrc = resolveContentImageSrc(curator.bannerUrl);
  const avatarSrc = resolveContentImageSrc(curator.avatarUrl);

  return (
    <>
      <Header />
      <main className="min-h-dvh bg-neutral-50 pb-16 pt-[var(--header-offset)] text-neutral-900 dark:bg-black dark:text-white">
        {/* Banner */}
        <div className="relative h-56 w-full overflow-hidden bg-neutral-900 sm:h-72 lg:h-80">
          {bannerSrc ? (
            <SafeContentImage
              src={bannerSrc}
              alt={`${curator.name} banner`}
              className="object-cover brightness-75"
              sizes="100vw"
              blurDataURL={IMAGE_BLUR_DATA_URL}
              unoptimized={isBundledPlaceholderSrc(bannerSrc)}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/60 to-neutral-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
          {/* Profile header */}
          <div className="-mt-10 mb-8 flex items-end gap-5 sm:-mt-12">
            {avatarSrc ? (
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-4 ring-neutral-50 sm:h-24 sm:w-24 dark:ring-black">
                <SafeContentImage
                  src={avatarSrc}
                  alt={curator.name}
                  className="object-cover"
                  sizes="96px"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                  unoptimized={isBundledPlaceholderSrc(avatarSrc)}
                />
              </div>
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-amber-100 text-2xl font-semibold text-amber-800 ring-4 ring-neutral-50 sm:h-24 sm:w-24 dark:bg-amber-900/40 dark:text-amber-300 dark:ring-black">
                {curator.name.charAt(0)}
              </div>
            )}
            <div className="pb-1">
              <nav className="mb-1 text-xs text-neutral-400 dark:text-white/35" aria-label="Breadcrumb">
                <Link href="/curators" className="no-underline transition hover:text-amber-700 dark:hover:text-amber-400">
                  Curators
                </Link>
                <span className="px-1" aria-hidden>/</span>
                <span>{curator.name}</span>
              </nav>
              <h1 className="m-0 text-2xl font-semibold tracking-tight sm:text-3xl">{curator.name}</h1>
              {curator.tagline ? (
                <p className="m-0 mt-1 text-sm text-neutral-500 dark:text-white/55">{curator.tagline}</p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_280px]">
            {/* Main column */}
            <div className="space-y-10">
              {/* About */}
              {curator.description ? (
                <section>
                  <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-white/35">
                    About
                  </h2>
                  <p className="m-0 text-base leading-relaxed text-neutral-700 dark:text-white/75">
                    {curator.description}
                  </p>
                </section>
              ) : null}

              {/* Articles */}
              <section>
                <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-white/35">
                  From {curator.name}
                </h2>
                {articles.length === 0 ? (
                  <p className="text-sm text-neutral-500 dark:text-white/40">No articles yet.</p>
                ) : (
                  <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2">
                    {articles.map((article) => {
                      const imgSrc = resolveContentImageSrc(article.titleImageUrl);
                      return (
                        <li key={article.currentSlug}>
                          <Link
                            href={`/articles/${article.currentSlug}`}
                            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white no-underline transition hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/20"
                          >
                            {imgSrc ? (
                              <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-200 dark:bg-neutral-900">
                                <SafeContentImage
                                  src={imgSrc}
                                  alt={article.title}
                                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                                  sizes="(max-width: 640px) 100vw, 50vw"
                                  blurDataURL={IMAGE_BLUR_DATA_URL}
                                  unoptimized={isBundledPlaceholderSrc(imgSrc)}
                                />
                              </div>
                            ) : null}
                            <div className="flex flex-1 flex-col gap-1.5 p-4">
                              <h3 className="m-0 line-clamp-2 text-base font-semibold leading-snug text-neutral-900 dark:text-white">
                                {article.title}
                              </h3>
                              {article.summary ? (
                                <p className="m-0 line-clamp-2 text-sm leading-relaxed text-neutral-500 dark:text-white/50">
                                  {article.summary}
                                </p>
                              ) : null}
                              <span className="mt-auto pt-2 text-xs font-medium text-amber-700 transition group-hover:text-amber-900 dark:text-amber-400/80 dark:group-hover:text-amber-300">
                                Read →
                              </span>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Specialties */}
              {curator.specialties && curator.specialties.length > 0 ? (
                <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
                  <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-white/35">
                    Specialises in
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {curator.specialties.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/25 dark:text-amber-300/90"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Links */}
              {(curator.websiteUrl || curator.instagramUrl || curator.shopUrl) ? (
                <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
                  <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-white/35">
                    Follow
                  </h2>
                  <div className="flex flex-col gap-2">
                    {curator.websiteUrl ? (
                      <a
                        href={curator.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm font-medium text-neutral-700 no-underline transition hover:border-amber-400/50 hover:bg-amber-50 hover:text-amber-800 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/70 dark:hover:text-amber-300"
                      >
                        <span className="text-base">🌐</span>
                        Visit website
                      </a>
                    ) : null}
                    {curator.instagramUrl ? (
                      <a
                        href={curator.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm font-medium text-neutral-700 no-underline transition hover:border-amber-400/50 hover:bg-amber-50 hover:text-amber-800 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/70 dark:hover:text-amber-300"
                      >
                        <span className="text-base">📷</span>
                        Instagram
                      </a>
                    ) : null}
                    {curator.shopUrl ? (
                      <a
                        href={curator.shopUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm font-medium text-neutral-700 no-underline transition hover:border-amber-400/50 hover:bg-amber-50 hover:text-amber-800 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/70 dark:hover:text-amber-300"
                      >
                        <span className="text-base">🛍</span>
                        Shop
                      </a>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
