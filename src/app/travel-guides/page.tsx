import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "next-view-transitions";

import IslandNav from "../components/IslandNav";
import HomeFooter from "../components/HomeFooter";
import { editorialScopeClass, EDITORIAL_BG, EDITORIAL_INK } from "@/lib/theme/culturinTokens";
import { getCmsDbOrNull } from "@/lib/cms/server";
import { listProvidersAsCards } from "@/lib/cms/queries";
import { IMAGE_BLUR_DATA_URL, isBundledPlaceholderSrc } from "@/lib/imagePlaceholder";
import { travelGuideCategories } from "@/lib/travelGuidesCategories";
import { PUBLIC_CONTACT_EMAIL } from "@/lib/siteContact";

import TravelGuidesContactCta from "./TravelGuidesContactCta";
import GuideProfilesSection from "./GuideProfilesSection";

export const revalidate = 300;

const displayFont = { fontFamily: "var(--font-display), 'Times New Roman', serif" };

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Travel guides | Culturin",
    description:
      "A curated marketplace of travel guides by theme. Sign in to contact our team about guides and collaborations.",
  };
}

export default async function TravelGuidesMarketplacePage() {
  const db = getCmsDbOrNull();
  const guides = db ? await listProvidersAsCards(db) : [];

  return (
    <div className={editorialScopeClass} style={{ background: EDITORIAL_BG, color: EDITORIAL_INK }}>
      <IslandNav />
      <main className="min-h-dvh antialiased">
        <div className="border-b" style={{ borderColor: "var(--c-rule)" }}>
          <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-32 sm:px-6 sm:pb-12">
            <nav className="mb-6 text-sm" aria-label="Breadcrumb">
              <Link href="/" className="font-medium no-underline transition hover:opacity-80" style={{ color: "var(--c-accent)" }}>
                Home
              </Link>
              <span className="px-1.5" style={{ color: "var(--c-muted)" }} aria-hidden>
                /
              </span>
              <span style={{ color: "var(--c-muted)" }}>Travel guides</span>
            </nav>

            <p className="m-0 text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--c-muted)" }}>
              Marketplace
            </p>
            <h1 className="m-0 mt-3 max-w-4xl text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl md:text-6xl" style={{ ...displayFont, color: "var(--c-ink)" }}>
              Curated travel guides
            </h1>
            <p className="m-0 mt-4 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: "var(--c-muted)" }}>
              Explore themed collections from the Culturin team—deep dives you can use to plan, dream, and go. Sign in to
              reach our curators with questions or ideas.
            </p>

            <div className="mt-8 flex max-w-3xl flex-col gap-4 sm:mt-10 sm:flex-row sm:items-stretch sm:gap-5">
              <div className="min-w-0 flex-1">
                <TravelGuidesContactCta supportEmail={PUBLIC_CONTACT_EMAIL} />
              </div>
            </div>

            <p className="m-0 mt-8 text-sm" style={{ color: "var(--c-muted)" }}>
              Looking for every editorial story?{" "}
              <Link href="/articles" className="font-medium underline-offset-2 hover:underline" style={{ color: "var(--c-accent)" }}>
                Browse all articles
              </Link>
            </p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <GuideProfilesSection guides={guides} />

          <header className="mb-8 border-b pb-6" style={{ borderColor: "var(--c-rule)" }}>
            <h2 className="m-0 text-2xl font-medium tracking-tight sm:text-3xl" style={{ ...displayFont, color: "var(--c-ink)" }}>
              Guides by theme
            </h2>
            <p className="m-0 mt-2 text-sm" style={{ color: "var(--c-muted)" }}>
              Pick a collection—each one opens a dedicated hub of ideas and related reads.
            </p>
          </header>

          <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:gap-6">
            {travelGuideCategories.map((cat) => (
              <li key={cat.slug} className="min-w-0">
                <Link
                  href={cat.href}
                  className="group relative block overflow-hidden rounded-2xl border no-underline shadow-sm transition"
                  style={{ borderColor: "var(--c-rule)" }}
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
                      <h3 className="mt-2 line-clamp-2 text-xl font-medium leading-snug text-white sm:text-2xl" style={displayFont}>
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
      <HomeFooter />
    </div>
  );
}
