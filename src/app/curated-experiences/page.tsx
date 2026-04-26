import Image from "next/image";
import { Link } from "next-view-transitions";

import Header from "../components/Header";
import {
  IMAGE_BLUR_DATA_URL,
  isBundledPlaceholderSrc,
  resolveContentImageSrc,
} from "../../lib/imagePlaceholder";
import { getCmsDbOrNull } from "../../lib/cms/server";
import { listProvidersAsCards } from "../../lib/cms/queries";
import type { providerCard } from "@/lib/interface";

export default async function CuratedExperiencesPage() {
  const db = getCmsDbOrNull();
  const providers: providerCard[] = db ? await listProvidersAsCards(db) : [];

  return (
    <>
      <Header />
      <main className="flex min-h-dvh flex-col bg-neutral-50 px-4 pb-16 pt-[var(--header-offset)] text-neutral-900 sm:px-6 lg:px-10 dark:bg-black dark:text-white">
        <header className="mx-auto mb-8 w-full max-w-6xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Curated experiences</h1>
          <p className="mt-2 text-sm text-neutral-400 sm:text-base">Handpicked by the Culturin team</p>
        </header>

        {providers.length === 0 ? (
          <p className="mx-auto w-full max-w-6xl text-sm text-neutral-500" role="status">
            No experiences to show yet. Check back soon.
          </p>
        ) : (
          <ul className="mx-auto grid w-full max-w-6xl list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {providers.map((provider) => {
              const slug = provider.slug.current;
              const imgSrc = resolveContentImageSrc(provider.bannerImage?.image?.url);
              const imgAlt = provider.bannerImage?.image?.alt || provider.eventName || "Provider";

              return (
                <li key={slug} className="min-w-0">
                  <Link
                    href={`/providers/${slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white no-underline shadow-sm outline-none transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-amber-400/40 hover:shadow-md focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50 dark:border-white/10 dark:bg-neutral-950/60 dark:shadow-none dark:hover:border-amber-400/30 dark:hover:shadow-lg dark:hover:shadow-black/40 dark:focus-visible:ring-offset-black"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900">
                      <Image
                        src={imgSrc}
                        alt={imgAlt}
                        fill
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL={IMAGE_BLUR_DATA_URL}
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        unoptimized={isBundledPlaceholderSrc(imgSrc)}
                      />
                    </div>
                    <div className="flex flex-col gap-1 px-4 py-4">
                      <h2 className="text-base font-semibold leading-snug text-neutral-900 line-clamp-2 dark:text-white">
                        {provider.eventName}
                      </h2>
                      <p className="text-sm text-neutral-400 line-clamp-2">{provider.name}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </>
  );
}
