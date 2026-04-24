import type { Metadata } from "next";

import TravelGuidesCategoryGrid from "../components/TravelGuidesCategoryGrid";
import { ContentPageShell } from "../components/layout/ContentPageShell";
import { BackToHomeLink } from "../components/nav/BackToHomeLink";
import {
  getArticlesLandingPage,
  type ArticlesLandingCmsStatus,
} from "../../lib/cms/articlesLandingPage";

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
      "CMS: set NEXT_PUBLIC_CMS_BASE_URL to load the hub headline and intro from your API.",
    bad_response:
      "CMS: the pages API returned an unexpected shape or non-OK status; showing bundled fallbacks.",
    network_error:
      "CMS: network error while fetching the landing page; showing bundled fallbacks.",
    ok: "",
  };

  return (
    <aside
      className="mb-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100"
      role="status"
    >
      {messages[status]}
    </aside>
  );
}

export default async function ArticlesPage() {
  const page = await getArticlesLandingPage();

  return (
    <ContentPageShell
      mainClassName="min-h-screen bg-white pb-16 pt-[var(--header-offset)] text-neutral-900 dark:bg-black dark:text-white"
      innerClassName="flex w-full max-w-7xl flex-col gap-0 px-4 sm:px-6"
    >
      <CmsStatusNote status={page.cmsStatus} />

      <nav aria-label="Back to home" className="mb-2 flex justify-start sm:mb-0">
        <BackToHomeLink />
      </nav>

      <header className="mb-10 flex flex-col gap-5 pt-2 sm:mb-12 sm:pt-0 md:mb-14 md:flex-row md:items-end md:justify-between md:gap-8">
        <h1
          id="article-heading"
          className="m-0 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
        >
          {page.headline}
        </h1>
        <p className="m-0 max-w-md text-base leading-relaxed text-neutral-600 md:max-w-lg md:shrink-0 md:text-right md:text-base lg:text-lg dark:text-white/70">
          {page.intro}
        </p>
      </header>

      <section aria-label="Guide categories" className="w-full min-w-0">
        <TravelGuidesCategoryGrid />
      </section>
    </ContentPageShell>
  );
}
