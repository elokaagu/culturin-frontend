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
      mainClassName="min-h-screen bg-black pb-20 pt-[var(--header-offset)] text-white"
      innerClassName="flex w-full max-w-[78rem] flex-col gap-0 px-4 sm:px-7 lg:px-8"
    >
      <CmsStatusNote status={page.cmsStatus} />
      <nav aria-label="Back to home" className="mb-6 mt-2 flex justify-start sm:mb-7">
        <BackToHomeLink className="inline-flex items-center gap-2 rounded-lg text-sm font-medium text-amber-400/90 transition-colors hover:text-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400/70" />
      </nav>

      <header className="mb-7 border-b border-white/10 pb-7 sm:mb-8 sm:pb-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_1fr] md:items-end md:gap-10">
          <h1
            id="article-heading"
            className="m-0 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.45rem]"
          >
            {page.headline}
          </h1>
          <p className="m-0 max-w-xl text-base leading-relaxed text-white/62 md:justify-self-end md:text-right lg:text-[1.72rem] lg:leading-[1.25]">
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
