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
      mainClassName="min-h-screen bg-neutral-50 pb-20 pt-[var(--header-offset)] text-neutral-900 dark:bg-black dark:text-white"
      innerClassName="flex w-full max-w-6xl flex-col gap-0 px-4 sm:px-6 lg:px-8"
    >
      <CmsStatusNote status={page.cmsStatus} />
      <nav aria-label="Back to home" className="mb-5 flex justify-start sm:mb-6">
        <BackToHomeLink className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-amber-700 transition-colors hover:text-amber-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500/70 dark:text-amber-400/90 dark:hover:text-amber-300" />
      </nav>

      <header className="mb-8 border-b border-neutral-200 pb-8 sm:mb-10 sm:pb-10 dark:border-white/10">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-8">
          <h1
            id="article-heading"
            className="m-0 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl"
          >
            {page.headline}
          </h1>
          <p className="m-0 max-w-xl text-base leading-relaxed text-neutral-600 md:text-right lg:text-lg dark:text-white/70">
            {page.intro}
          </p>
        </div>
      </header>

      <section aria-label="Guide categories" className="w-full min-w-0 pb-2">
        <TravelGuidesCategoryGrid />
      </section>
    </ContentPageShell>
  );
}
