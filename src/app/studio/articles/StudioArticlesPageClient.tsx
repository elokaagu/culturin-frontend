"use client";

import { useMemo, useState, useTransition } from "react";
import { Link } from "next-view-transitions";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import {
  StudioCulturinListSection,
  StudioCulturinSearchSortRow,
  studioCreateButtonClass,
  studioListEditLinkClass,
  studioListRowClass,
} from "@/app/studio/_components/StudioCulturinListKit";
import { filterStudioList, sortStudioList, type StudioSortKey } from "@/app/studio/_lib/studioListShared";
import { deleteCmsEntry } from "@/app/studio/_lib/postCmsEntry";
import type { StudioBlogListItem } from "@/lib/cms/queries";

type StudioArticlesPageClientProps = {
  articles: StudioBlogListItem[];
  hasDb: boolean;
};

export function StudioArticlesPageClient({ articles, hasDb }: StudioArticlesPageClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<StudioSortKey>("date-newest");
  const [removed, setRemoved] = useState<Set<string>>(() => new Set());
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const visibleArticles = useMemo(
    () => articles.filter((a) => !removed.has(a.currentSlug)),
    [articles, removed],
  );

  const filteredSorted = useMemo(() => {
    const filtered = filterStudioList(visibleArticles, search, (a) => [a.title, a.summary, a.currentSlug]);
    return sortStudioList(filtered, sort, (a) => a.title, (a) => a.currentSlug);
  }, [visibleArticles, search, sort]);

  const searchTrim = search.trim();
  const countLabel =
    searchTrim.length > 0
      ? `${filteredSorted.length} of ${visibleArticles.length} shown`
      : `${visibleArticles.length} item${visibleArticles.length === 1 ? "" : "s"}`;

  const toolbar =
    hasDb && visibleArticles.length > 0 ? (
      <StudioCulturinSearchSortRow
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search title, slug, or summary…"
        sortValue={sort}
        onSortChange={setSort}
      />
    ) : null;

  async function handleDelete(article: StudioBlogListItem) {
    const confirmed = window.confirm(
      `Delete “${article.title}”? This permanently removes the article from the public site.`,
    );
    if (!confirmed) return;

    setDeletingSlug(article.currentSlug);
    setErrorMessage(null);

    const result = await deleteCmsEntry("blog", article.currentSlug);

    setDeletingSlug(null);

    if (!result.ok) {
      setErrorMessage(result.message);
      return;
    }

    setRemoved((prev) => {
      const next = new Set(prev);
      next.add(article.currentSlug);
      return next;
    });
    startTransition(() => router.refresh());
  }

  return (
    <>
      <div className="mt-6">
        <Link href="/studio/articles/new" className={studioCreateButtonClass}>
          Create article
        </Link>
      </div>

      {errorMessage ? (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-rose-300/60 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-200"
        >
          {errorMessage}
        </p>
      ) : null}

      <StudioCulturinListSection title="All articles" countLabel={countLabel} toolbar={toolbar}>
        {!hasDb ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-600 dark:border-white/15 dark:text-white/55">
            Your content library isn&apos;t connected in this preview, so articles can&apos;t be listed yet.
          </p>
        ) : visibleArticles.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-600 dark:border-white/15 dark:text-white/55">
            No articles found. Use <span className="font-medium text-amber-800 dark:text-amber-300/90">Create article</span>{" "}
            to add one.
          </p>
        ) : filteredSorted.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-600 dark:border-white/15 dark:text-white/55">
            No articles match your search. Try a different term or clear the search box.
          </p>
        ) : (
          <ul className="m-0 list-none space-y-3 p-0">
            {filteredSorted.map((article) => {
              const slug = article.currentSlug;
              const viewHref = `/articles/${encodeURIComponent(slug)}`;
              const isDeleting = deletingSlug === slug;
              return (
                <li key={slug} className={studioListRowClass}>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <a
                      href={viewHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Open “${article.title}” in a new tab`}
                      className="group min-w-0 flex-1 rounded-md no-underline outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50"
                    >
                      <p className="m-0 truncate text-sm font-semibold text-neutral-900 transition group-hover:text-amber-800 dark:text-white dark:group-hover:text-amber-300">
                        {article.title}
                      </p>
                      <p className="m-0 mt-1 truncate text-xs text-neutral-500 dark:text-white/50">/{slug}</p>
                      {article.summary ? (
                        <p className="m-0 mt-1.5 line-clamp-2 text-xs text-neutral-600 dark:text-white/60">{article.summary}</p>
                      ) : null}
                    </a>
                    <div className="flex shrink-0 items-center gap-2">
                      <Link
                        href={`/studio/articles/edit/${encodeURIComponent(slug)}`}
                        className={studioListEditLinkClass}
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(article)}
                        disabled={isDeleting}
                        aria-label={`Delete ${article.title}`}
                        title="Delete article"
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-700 transition hover:border-rose-400/60 hover:bg-rose-50 hover:text-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400/70 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/18 dark:bg-white/[0.06] dark:text-white/85 dark:hover:border-rose-400/40 dark:hover:bg-rose-500/15 dark:hover:text-rose-200"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        <span className="sr-only">{isDeleting ? "Deleting…" : "Delete"}</span>
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </StudioCulturinListSection>
    </>
  );
}
