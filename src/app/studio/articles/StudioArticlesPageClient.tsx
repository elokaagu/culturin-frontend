"use client";

import { useMemo, useState } from "react";
import { Link } from "next-view-transitions";

import {
  StudioCulturinListSection,
  StudioCulturinSearchSortRow,
  studioCreateButtonClass,
  studioListEditLinkClass,
  studioListRowClass,
} from "@/app/studio/_components/StudioCulturinListKit";
import { filterStudioList, sortStudioList, type StudioSortKey } from "@/app/studio/_lib/studioListShared";
import type { StudioBlogListItem } from "@/lib/cms/queries";

type StudioArticlesPageClientProps = {
  articles: StudioBlogListItem[];
  hasDb: boolean;
};

export function StudioArticlesPageClient({ articles, hasDb }: StudioArticlesPageClientProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<StudioSortKey>("date-newest");

  const filteredSorted = useMemo(() => {
    const filtered = filterStudioList(articles, search, (a) => [a.title, a.summary, a.currentSlug]);
    return sortStudioList(filtered, sort, (a) => a.title, (a) => a.currentSlug);
  }, [articles, search, sort]);

  const searchTrim = search.trim();
  const countLabel =
    searchTrim.length > 0
      ? `${filteredSorted.length} of ${articles.length} shown`
      : `${articles.length} item${articles.length === 1 ? "" : "s"}`;

  const toolbar =
    hasDb && articles.length > 0 ? (
      <StudioCulturinSearchSortRow
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search title, slug, or summary…"
        sortValue={sort}
        onSortChange={setSort}
      />
    ) : null;

  return (
    <>
      <div className="mt-6">
        <Link href="/studio/articles/new" className={studioCreateButtonClass}>
          Create article
        </Link>
      </div>

      <StudioCulturinListSection title="All articles" countLabel={countLabel} toolbar={toolbar}>
        {!hasDb ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-4 text-sm text-neutral-600 dark:border-white/15 dark:text-white/55">
            Your content library isn&apos;t connected in this preview, so articles can&apos;t be listed yet.
          </p>
        ) : articles.length === 0 ? (
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
            {filteredSorted.map((article) => (
              <li key={article.currentSlug} className={studioListRowClass}>
                <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="min-w-0">
                    <p className="m-0 truncate text-sm font-semibold text-neutral-900 dark:text-white">{article.title}</p>
                    <p className="m-0 mt-1 truncate text-xs text-neutral-500 dark:text-white/50">/{article.currentSlug}</p>
                    {article.summary ? (
                      <p className="m-0 mt-1.5 line-clamp-2 text-xs text-neutral-600 dark:text-white/60">{article.summary}</p>
                    ) : null}
                  </div>
                  <Link
                    href={`/studio/articles/edit/${encodeURIComponent(article.currentSlug)}`}
                    className={studioListEditLinkClass}
                  >
                    Edit
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </StudioCulturinListSection>
    </>
  );
}
