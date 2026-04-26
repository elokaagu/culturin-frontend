import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "next-view-transitions";

import Header from "../components/Header";
import SiteFooter from "../components/SiteFooter";
import { IMAGE_BLUR_DATA_URL, isBundledPlaceholderSrc } from "@/lib/imagePlaceholder";
import { travelGuideCategories } from "@/lib/travelGuidesCategories";
import { PUBLIC_CONTACT_EMAIL } from "@/lib/siteContact";

import TravelGuidesContactCta from "./TravelGuidesContactCta";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Travel guides | Culturin",
    description:
      "A curated marketplace of travel guides by theme. Sign in to contact our team about guides and collaborations.",
  };
}

export default function TravelGuidesMarketplacePage() {
  return (
    <>
      <Header />
      <main className="min-h-dvh bg-neutral-50 text-neutral-900 antialiased dark:bg-black dark:text-white">
        <div className="border-b border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-950/40">
          <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-[calc(var(--header-offset)+1.5rem)] sm:px-6 sm:pb-12 sm:pt-[calc(var(--header-offset)+2rem)]">
            <nav className="mb-6 text-sm" aria-label="Breadcrumb">
              <Link
                href="/"
                className="font-medium text-amber-800 no-underline transition hover:underline dark:text-amber-300/95"
              >
                Home
              </Link>
              <span className="px-1.5 text-neutral-400 dark:text-white/35" aria-hidden>
                /
              </span>
              <span className="text-neutral-600 dark:text-white/65">Travel guides</span>
            </nav>

            <p className="m-0 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500 dark:text-white/45">
              Marketplace
            </p>
            <h1 className="m-0 mt-3 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
              Curated travel guides
            </h1>
            <p className="m-0 mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 dark:text-white/70 sm:text-lg">
              Explore themed collections from the Culturin team—deep dives you can use to plan, dream, and go. Sign in to
              reach our curators with questions or ideas.
            </p>

            <div className="mt-8 flex max-w-3xl flex-col gap-4 sm:mt-10 sm:flex-row sm:items-stretch sm:gap-5">
              <div className="min-w-0 flex-1">
                <TravelGuidesContactCta supportEmail={PUBLIC_CONTACT_EMAIL} />
              </div>
            </div>

            <p className="m-0 mt-8 text-sm text-neutral-500 dark:text-white/50">
              Looking for every editorial story?{" "}
              <Link href="/articles" className="font-medium text-amber-800 underline-offset-2 hover:underline dark:text-amber-400/90">
                Browse all articles
              </Link>
            </p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <header className="mb-8 border-b border-neutral-200 pb-6 dark:border-white/10">
            <h2 className="m-0 text-2xl font-semibold tracking-tight sm:text-3xl">Guides by theme</h2>
            <p className="m-0 mt-2 text-sm text-neutral-500 dark:text-white/55">
              Pick a collection—each one opens a dedicated hub of ideas and related reads.
            </p>
          </header>

          <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:gap-6">
            {travelGuideCategories.map((cat) => (
              <li key={cat.slug} className="min-w-0">
                <Link
                  href={cat.href}
                  className="group relative block overflow-hidden rounded-2xl border border-neutral-200 no-underline shadow-sm transition hover:border-amber-400/35 hover:shadow-md dark:border-white/10 dark:hover:border-amber-400/25"
                >
                  <div className="relative aspect-[16/9] w-full sm:aspect-[2/1]">
                    {cat.imageUrl ? (
                      <>
                        <Image
                          src={cat.imageUrl}
                          alt={cat.imageAlt}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-[1.03]"
                          sizes="(max-width: 640px) 100vw, 50vw"
                          placeholder="blur"
                          blurDataURL={IMAGE_BLUR_DATA_URL}
                          unoptimized={isBundledPlaceholderSrc(cat.imageUrl)}
                        />
                        <div
                          className={["pointer-events-none absolute inset-0", cat.overlayClass].join(" ")}
                          aria-hidden
                        />
                      </>
                    ) : (
                      <div className={["h-full w-full", cat.overlayClass].join(" ")} aria-hidden />
                    )}
                    <div className="absolute inset-0 z-[1] flex flex-col justify-end p-5 sm:p-6 [text-shadow:0_1px_4px_rgba(0,0,0,0.45)]">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/90">Collection</span>
                      <h3 className="mt-2 line-clamp-2 text-xl font-semibold leading-snug text-white sm:text-2xl">
                        {cat.title}
                      </h3>
                      <span className="mt-1 text-sm text-white/85">
                        {cat.articleCount} {cat.articleCount === 1 ? "entry" : "entries"}+
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
