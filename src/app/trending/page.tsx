import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "next-view-transitions";

import Header from "../components/Header";
import { getCmsDbOrNull } from "../../lib/cms/server";
import { listBlogs, listProviders, listVideos } from "../../lib/cms/queries";
import {
  getShowcaseBlogCards,
  getShowcaseProviderCards,
  getShowcaseVideoCards,
} from "../../lib/cms/showcaseContent";
import {
  IMAGE_BLUR_DATA_URL,
  isBundledPlaceholderSrc,
  resolveContentImageSrc,
  resolveVideoThumbnailSrc,
} from "../../lib/imagePlaceholder";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Trending | Culturin",
  description: "What is trending now across travel stories, curated experiences, and videos.",
};

function TrendingSection({
  title,
  countLabel,
  children,
}: {
  title: string;
  countLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-2xl">{title}</h2>
        <span className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-500 dark:text-white/45">{countLabel}</span>
      </header>
      {children}
    </section>
  );
}

export default async function TrendingPage() {
  const db = getCmsDbOrNull();
  const [blogsFromCms, videosFromCms, providersFromCms] = db
    ? await Promise.all([listBlogs(db), listVideos(db), listProviders(db)])
    : [[], [], []];

  const blogs = blogsFromCms.length > 0 ? blogsFromCms : getShowcaseBlogCards();
  const videos = videosFromCms.length > 0 ? videosFromCms : getShowcaseVideoCards();
  const providers = providersFromCms.length > 0 ? providersFromCms : getShowcaseProviderCards();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50 pb-20 pt-[var(--header-offset)] text-neutral-900 dark:bg-black dark:text-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
          <header className="border-b border-neutral-200 pb-8 dark:border-white/10">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Trending</h1>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-neutral-600 dark:text-white/65 sm:text-lg">
              What the Culturin community is reading, watching, and booking right now.
            </p>
          </header>

          <TrendingSection title="Trending stories" countLabel={`${blogs.length} stories`}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.slice(0, 6).map((story) => {
                const imageSrc = resolveContentImageSrc(story.titleImageUrl);
                return (
                  <Link
                    key={story.currentSlug}
                    href={`/articles/${story.currentSlug}`}
                    className="group overflow-hidden rounded-xl border border-white/10 bg-neutral-950/80 no-underline"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
                      <Image
                        src={imageSrc}
                        alt={story.title}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        placeholder="blur"
                        blurDataURL={IMAGE_BLUR_DATA_URL}
                        unoptimized={isBundledPlaceholderSrc(imageSrc)}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="line-clamp-2 text-lg font-semibold leading-tight text-white">{story.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm text-white/70">{story.summary}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </TrendingSection>

          <TrendingSection title="Trending videos" countLabel={`${videos.length} videos`}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {videos.slice(0, 6).map((video) => {
                const imageSrc = resolveVideoThumbnailSrc(video.videoThumbnailUrl);
                return (
                  <Link
                    key={video.currentSlug}
                    href={`/stream?play=${video.currentSlug}`}
                    className="group overflow-hidden rounded-xl border border-white/10 bg-neutral-950/80 no-underline"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
                      <Image
                        src={imageSrc}
                        alt={video.title}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        placeholder="blur"
                        blurDataURL={IMAGE_BLUR_DATA_URL}
                        unoptimized={isBundledPlaceholderSrc(imageSrc)}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="line-clamp-2 text-lg font-semibold leading-tight text-white">{video.title}</h3>
                      <p className="mt-1 text-sm text-white/65">{video.uploader}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </TrendingSection>

          <TrendingSection title="Trending experiences" countLabel={`${providers.length} experiences`}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {providers.slice(0, 6).map((provider) => {
                const imageSrc = resolveContentImageSrc(provider.bannerImage?.image?.url);
                return (
                  <Link
                    key={provider.slug}
                    href={`/providers/${provider.slug}`}
                    className="group overflow-hidden rounded-xl border border-white/10 bg-neutral-950/80 no-underline"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
                      <Image
                        src={imageSrc}
                        alt={provider.bannerImage?.image?.alt || provider.eventName || provider.name || "Experience"}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        placeholder="blur"
                        blurDataURL={IMAGE_BLUR_DATA_URL}
                        unoptimized={isBundledPlaceholderSrc(imageSrc)}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="line-clamp-2 text-lg font-semibold leading-tight text-white">
                        {provider.eventName || provider.name}
                      </h3>
                      {provider.name ? <p className="mt-1 text-sm text-white/65">{provider.name}</p> : null}
                    </div>
                  </Link>
                );
              })}
            </div>
          </TrendingSection>
        </div>
      </main>
    </>
  );
}
