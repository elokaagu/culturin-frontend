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
      <main className="min-h-dvh bg-neutral-50 text-neutral-900 dark:bg-[#121212] dark:text-white">

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <div className="relative w-full overflow-hidden bg-neutral-900" style={{ height: "clamp(320px, 45vw, 520px)" }}>
          {/* Banner image */}
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
            <div className="absolute inset-0 bg-gradient-to-br from-amber-950/70 to-neutral-950" />
          )}
          {/* Gradient overlay — darkens bottom so text is legible */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

          {/* Identity row anchored to banner bottom */}
          <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6">
            <div className="mx-auto flex max-w-5xl items-end gap-5 pb-7 pt-24">
              {/* Avatar */}
              <div className="relative z-10 shrink-0">
                {avatarSrc ? (
                  <div className="h-20 w-20 overflow-hidden rounded-full ring-2 ring-white/30 sm:h-24 sm:w-24">
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
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-200 text-2xl font-semibold text-amber-900 ring-2 ring-white/30 sm:h-24 sm:w-24">
                    {curator.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Name / tagline / breadcrumb */}
              <div className="relative z-10 min-w-0 pb-1">
                <nav className="mb-1.5 text-xs text-white/50" aria-label="Breadcrumb">
                  <Link href="/curators" className="no-underline transition hover:text-white/80">
                    Curators
                  </Link>
                  <span className="px-1.5" aria-hidden>/</span>
                  <span className="text-white/70">{curator.name}</span>
                </nav>
                <h1 className="m-0 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  {curator.name}
                </h1>
                {curator.tagline ? (
                  <p className="m-0 mt-1.5 text-sm text-white/65 sm:text-base">{curator.tagline}</p>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ─────────────────────────────────────────────────── */}
        <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_260px]">

            {/* Main column */}
            <div className="space-y-12">

              {/* About */}
              {curator.description ? (
                <section>
                  <h2 className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-white/45">
                    About
                  </h2>
                  <p className="m-0 max-w-2xl text-base leading-relaxed text-neutral-700 dark:text-white/75">
                    {curator.description}
                  </p>
                </section>
              ) : null}

              {/* Articles */}
              <section>
                <h2 className="mb-6 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-white/45">
                  From {curator.name}
                </h2>
                {articles.length === 0 ? (
                  <p className="text-sm text-neutral-500 dark:text-white/50">No articles yet.</p>
                ) : (
                  <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2">
                    {articles.map((article) => {
                      const imgSrc = resolveContentImageSrc(article.titleImageUrl);
                      return (
                        <li key={article.currentSlug}>
                          <Link
                            href={`/articles/${article.currentSlug}`}
                            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white no-underline transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/20"
                          >
                            {imgSrc ? (
                              <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                                <SafeContentImage
                                  src={imgSrc}
                                  alt={article.title}
                                  className="object-cover transition duration-500 group-hover:scale-[1.04]"
                                  sizes="(max-width: 640px) 100vw, 50vw"
                                  blurDataURL={IMAGE_BLUR_DATA_URL}
                                  unoptimized={isBundledPlaceholderSrc(imgSrc)}
                                />
                              </div>
                            ) : null}
                            <div className="flex flex-1 flex-col gap-2 p-5">
                              <h3 className="m-0 line-clamp-2 text-base font-semibold leading-snug text-neutral-900 dark:text-white">
                                {article.title}
                              </h3>
                              {article.summary ? (
                                <p className="m-0 line-clamp-3 text-sm leading-relaxed text-neutral-500 dark:text-white/62">
                                  {article.summary}
                                </p>
                              ) : null}
                              <span className="mt-auto pt-2 text-xs font-medium text-amber-700 transition group-hover:text-amber-900 dark:text-amber-400/80 dark:group-hover:text-amber-300">
                                Read article →
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
            <aside className="space-y-5">

              {/* Specialties */}
              {curator.specialties && curator.specialties.length > 0 ? (
                <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
                  <h2 className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-white/45">
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

              {/* Follow links */}
              {(curator.websiteUrl || curator.instagramUrl || curator.shopUrl) ? (
                <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
                  <h2 className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-white/45">
                    Follow
                  </h2>
                  <div className="flex flex-col gap-2">
                    {curator.websiteUrl ? (
                      <a
                        href={curator.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm font-medium text-neutral-700 no-underline transition hover:border-amber-300/60 hover:bg-amber-50 hover:text-amber-800 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/70 dark:hover:bg-white/[0.08] dark:hover:text-amber-300"
                      >
                        <span className="text-base leading-none">🌐</span>
                        Visit website
                      </a>
                    ) : null}
                    {curator.instagramUrl ? (
                      <a
                        href={curator.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm font-medium text-neutral-700 no-underline transition hover:border-amber-300/60 hover:bg-amber-50 hover:text-amber-800 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/70 dark:hover:bg-white/[0.08] dark:hover:text-amber-300"
                      >
                        <span className="text-base leading-none">📷</span>
                        Instagram
                      </a>
                    ) : null}
                    {curator.shopUrl ? (
                      <a
                        href={curator.shopUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm font-medium text-neutral-700 no-underline transition hover:border-amber-300/60 hover:bg-amber-50 hover:text-amber-800 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/70 dark:hover:bg-white/[0.08] dark:hover:text-amber-300"
                      >
                        <span className="text-base leading-none">🛍</span>
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
