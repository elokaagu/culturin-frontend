import Image from "next/image";
import { Link } from "next-view-transitions";

import type { providerHeroCard } from "@/lib/interface";
import Header from "../components/Header";
import { getCmsDbOrNull } from "../../lib/cms/server";
import { listProviders } from "../../lib/cms/queries";
import { getShowcaseProviderCards } from "../../lib/cms/showcaseContent";
import {
  IMAGE_BLUR_DATA_URL,
  isBundledPlaceholderSrc,
  resolveContentImageSrc,
} from "../../lib/imagePlaceholder";

export default async function ProvidersPage() {
  const db = getCmsDbOrNull();
  const providersFromCms = db ? await listProviders(db) : [];
  const providers: providerHeroCard[] =
    providersFromCms.length > 0 ? providersFromCms : getShowcaseProviderCards();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black pb-16 pt-[var(--header-offset)] text-white">
        <section className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="mb-8 border-b border-white/10 pb-6 pt-6">
            <nav className="mb-4 text-sm" aria-label="Breadcrumb">
              <Link href="/" className="text-amber-300/95 no-underline transition hover:text-amber-200">
                Home
              </Link>
              <span className="px-1 text-white/35" aria-hidden>
                /
              </span>
              <span className="text-white/65">Providers</span>
            </nav>
            <h1 className="m-0 text-3xl tracking-tight sm:text-5xl">Local providers</h1>
            <p className="m-0 mt-3 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              Discover curated experiences hosted by trusted local partners. Open any card to view the full details and
              booking options.
            </p>
          </div>

          {providers.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center" role="status">
              <p className="m-0 text-white/70">No providers are available yet. Check back shortly.</p>
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
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] no-underline transition hover:-translate-y-0.5 hover:border-white/25"
                    >
                      <div className="relative aspect-[4/3] w-full bg-neutral-900">
                        <Image
                          src={imgSrc}
                          alt={imgAlt}
                          fill
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL={IMAGE_BLUR_DATA_URL}
                          className="object-cover transition duration-300 group-hover:scale-[1.03]"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          unoptimized={isBundledPlaceholderSrc(imgSrc)}
                        />
                      </div>
                      <div className="space-y-1 px-4 py-4">
                        <h2 className="m-0 line-clamp-2 text-lg font-semibold leading-snug text-white">{provider.eventName}</h2>
                        <p className="m-0 text-sm text-white/65">{provider.name}</p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}
