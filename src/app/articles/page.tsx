import type { Metadata } from "next";
import Image from "next/image";

import { ContentPageShell } from "../components/layout/ContentPageShell";
import { BackToHomeLink } from "../components/nav/BackToHomeLink";
import {
  getArticlesLandingPage,
  type ArticlesLandingCmsStatus,
} from "../../lib/cms/articlesLandingPage";
import { IMAGE_BLUR_DATA_URL } from "../../lib/imagePlaceholder";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getArticlesLandingPage();
  const description =
    page.intro.length > 160 ? `${page.intro.slice(0, 157)}…` : page.intro;

  return {
    title: `${page.headline} | Culturin`,
    description,
    openGraph: {
      title: page.headline,
      description,
    },
  };
}

function CmsStatusNote({ status }: { status: ArticlesLandingCmsStatus }) {
  if (process.env.NODE_ENV !== "development") return null;
  if (status === "ok") return null;

  const messages: Record<ArticlesLandingCmsStatus, string> = {
    missing_base_url:
      "CMS: set NEXT_PUBLIC_CMS_BASE_URL to load the hero headline and intro from your API.",
    bad_response:
      "CMS: the pages API returned an unexpected shape or non-OK status; showing bundled fallbacks.",
    network_error:
      "CMS: network error while fetching the landing page; showing bundled fallbacks.",
    ok: "",
  };

  return (
    <aside
      className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100"
      role="status"
    >
      {messages[status]}
    </aside>
  );
}

export default async function ArticlesPage() {
  const page = await getArticlesLandingPage();

  return (
    <ContentPageShell>
      <CmsStatusNote status={page.cmsStatus} />

      <nav aria-label="Back to home" className="flex justify-start">
        <BackToHomeLink />
      </nav>

      <article className="flex flex-col gap-6">
        <header className="flex flex-col gap-3">
          <h1
            id="article-heading"
            className="max-w-prose text-3xl font-semibold leading-tight sm:text-4xl"
          >
            {page.headline}
          </h1>
          <p className="max-w-prose text-base text-neutral-700 sm:text-lg dark:text-white/90">
            {page.intro}
          </p>
        </header>

        <figure className="m-0 w-full">
          <Image
            src={page.heroImage.src}
            alt={page.heroImage.alt}
            width={page.heroImage.width}
            height={page.heroImage.height}
            sizes="(max-width: 900px) 100vw, 900px"
            className="h-auto w-full rounded-2xl object-cover"
            draggable={false}
            loading="lazy"
            placeholder="blur"
            blurDataURL={IMAGE_BLUR_DATA_URL}
          />
        </figure>

        <div className="flex flex-col gap-4 border-t border-neutral-200 pt-6 dark:border-white/10">
          {page.bodyParagraphs.map((paragraph, index) => (
            <p
              key={index}
              className="max-w-prose text-base leading-relaxed text-neutral-700 dark:text-white/85"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </ContentPageShell>
  );
}
