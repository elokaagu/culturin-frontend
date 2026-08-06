import { Link } from "next-view-transitions";

import type { providerHeroCard } from "@/lib/interface";
import IslandNav from "../components/IslandNav";
import HomeFooter from "../components/HomeFooter";
import { editorialScopeClass, EDITORIAL_BG, EDITORIAL_INK } from "@/lib/theme/culturinTokens";
import { getCmsDbOrNull } from "../../lib/cms/server";
import { listProviders } from "../../lib/cms/queries";
import {
  IMAGE_BLUR_DATA_URL,
  isBundledPlaceholderSrc,
  resolveContentImageSrc,
} from "../../lib/imagePlaceholder";
import SafeContentImage from "../components/SafeContentImage";

const displayFont = { fontFamily: "var(--font-display), 'Times New Roman', serif" };

export default async function ProvidersPage() {
  const db = getCmsDbOrNull();
  const providers: providerHeroCard[] = db ? await listProviders(db) : [];

  return (
    <div className={editorialScopeClass} style={{ background: EDITORIAL_BG, color: EDITORIAL_INK }}>
      <IslandNav />
      <main className="min-h-dvh pb-16" style={{ paddingTop: "8rem" }}>
        <section className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="mb-8 border-b pb-6 pt-6" style={{ borderColor: "var(--c-rule)" }}>
            <nav className="mb-4 text-sm" aria-label="Breadcrumb">
              <Link href="/" className="no-underline transition hover:opacity-80" style={{ color: "var(--c-accent)" }}>
                Home
              </Link>
              <span className="px-1" style={{ color: "var(--c-muted)" }} aria-hidden>
                /
              </span>
              <span style={{ color: "var(--c-muted)" }}>Providers</span>
            </nav>
            <h1 className="m-0 text-3xl font-medium tracking-tight sm:text-5xl" style={{ ...displayFont, color: "var(--c-ink)" }}>
              Local providers
            </h1>
            <p className="m-0 mt-3 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: "var(--c-muted)" }}>
              Discover curated experiences hosted by trusted local partners. Open any card to view the full details and
              host contact links.
            </p>
          </div>

          {providers.length === 0 ? (
            <div className="rounded-2xl border p-8 text-center" style={{ borderColor: "var(--c-rule)" }} role="status">
              <p className="m-0" style={{ color: "var(--c-muted)" }}>No providers are available yet. Check back shortly.</p>
            </div>
          ) : (
            <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {providers.map((provider) => {
                const slug = provider.slug;
                if (!slug) return null;

                const imgSrc = resolveContentImageSrc(provider.bannerImage?.image?.url);
                const imgAlt = provider.bannerImage?.image?.alt || provider.eventName || provider.name || "Provider";

                return (
                  <li key={slug} className="min-w-0">
                    <Link
                      href={`/providers/${slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border no-underline transition hover:-translate-y-0.5"
                      style={{ borderColor: "var(--c-rule)" }}
                    >
                      <div className="relative aspect-[4/3] w-full bg-neutral-900">
                        <SafeContentImage
                          src={imgSrc}
                          alt={imgAlt}
                          blurDataURL={IMAGE_BLUR_DATA_URL}
                          className="object-cover transition duration-300 group-hover:scale-[1.03]"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          unoptimized={isBundledPlaceholderSrc(imgSrc)}
                        />
                      </div>
                      <div className="space-y-1 px-4 py-4">
                        <h2 className="m-0 line-clamp-2 text-lg font-medium leading-snug" style={{ ...displayFont, color: "var(--c-ink)" }}>
                          {provider.eventName}
                        </h2>
                        <p className="m-0 text-sm" style={{ color: "var(--c-muted)" }}>{provider.name}</p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
      <HomeFooter />
    </div>
  );
}
