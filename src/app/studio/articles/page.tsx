import type { Metadata } from "next";
import { Link } from "next-view-transitions";

import { getCmsDbOrNull } from "@/lib/cms/server";
import { listBlogs } from "@/lib/cms/queries";
import { StudioArticleForm } from "./StudioArticleForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Articles & guides",
  description: "Create or update CMS blog and guide entries.",
};

export default async function StudioArticlesPage() {
  const db = getCmsDbOrNull();
  const articles = db ? await listBlogs(db) : [];

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">CMS</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Articles &amp; guides</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-white/65">
        Saved entries appear in <span className="text-neutral-800 dark:text-white/80">/articles</span> and on the home page when
        featured in your CMS.
      </p>
      <StudioArticleForm />

      <section className="mt-10">
        <header className="mb-4 flex items-center justify-between gap-3">
          <h2 className="m-0 text-lg font-semibold text-neutral-900 dark:text-white">All articles</h2>
          <span className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-500 dark:text-white/50">
            {articles.length} item{articles.length === 1 ? "" : "s"}
          </span>
        </header>

        {!db ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-500 dark:border-white/15 dark:text-white/55">
            CMS is not connected in this environment, so articles cannot be listed yet.
          </p>
        ) : articles.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-500 dark:border-white/15 dark:text-white/55">
            No articles found. Add your first article above.
          </p>
        ) : (
          <ul className="m-0 list-none space-y-3 p-0">
            {articles.map((article) => (
              <li
                key={article.currentSlug}
                className="rounded-xl border border-neutral-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]"
              >
                <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="min-w-0">
                    <p className="m-0 truncate text-sm font-semibold text-neutral-900 dark:text-white">{article.title}</p>
                    <p className="m-0 mt-1 truncate text-xs text-neutral-500 dark:text-white/55">/{article.currentSlug}</p>
                    {article.summary ? (
                      <p className="m-0 mt-1.5 line-clamp-2 text-xs text-neutral-600 dark:text-white/65">{article.summary}</p>
                    ) : null}
                  </div>
                  <Link
                    href={`/articles/${article.currentSlug}`}
                    className="inline-flex h-8 shrink-0 items-center rounded-full border border-neutral-300 bg-white px-3 text-xs font-medium text-neutral-800 no-underline transition hover:bg-neutral-50 dark:border-white/20 dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/10"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
