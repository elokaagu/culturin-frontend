"use client";

import { useCallback, useMemo, useState } from "react";
import { Link } from "next-view-transitions";

import {
  DeleteIconButton,
  EmptyNote,
  Notice,
  SelectBox,
  SelectionBar,
} from "@/app/admin/_components/AdminListParts";
import { useStudioConfirm } from "@/app/admin/_components/StudioConfirmDialog";
import {
  StudioCulturinListSection,
  StudioCulturinSearchSortRow,
  studioCreateButtonClass,
  studioListEditLinkClass,
  studioListRowClass,
} from "@/app/admin/_components/StudioCulturinListKit";
import { deleteCmsEntry } from "@/app/admin/_lib/postCmsEntry";
import { filterStudioList, sortStudioList, type StudioSortKey } from "@/app/admin/_lib/studioListShared";
import { useAdminCollection } from "@/app/admin/_lib/useAdminCollection";
import type { StudioBlogListItem } from "@/lib/cms/queries";

async function loadArticles(): Promise<StudioBlogListItem[] | null> {
  try {
    const res = await fetch("/api/admin/list?type=blog", { cache: "no-store" });
    if (!res.ok) return null;
    const body = (await res.json()) as { items?: StudioBlogListItem[] };
    return Array.isArray(body.items) ? body.items : null;
  } catch {
    return null;
  }
}

async function removeArticles(slugs: string[]): Promise<{ ok: boolean; message?: string }> {
  const failures: string[] = [];
  for (const slug of slugs) {
    const result = await deleteCmsEntry("blog", slug);
    if (!result.ok) failures.push(result.message);
  }
  if (failures.length === 0) return { ok: true };
  return {
    ok: false,
    message: failures.length === slugs.length ? failures[0] : `${failures.length} of ${slugs.length} could not be deleted.`,
  };
}

export function StudioArticlesPageClient({ articles, hasDb }: { articles: StudioBlogListItem[]; hasDb: boolean }) {
  const confirm = useStudioConfirm();
  const remove = useCallback((slugs: string[]) => removeArticles(slugs), []);
  const list = useAdminCollection<StudioBlogListItem>({
    initial: articles,
    getId: (a) => a.currentSlug,
    load: loadArticles,
    remove,
  });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<StudioSortKey>("date-newest");

  const filteredSorted = useMemo(() => {
    const filtered = filterStudioList(list.items, search, (a) => [a.title, a.summary, a.currentSlug]);
    return sortStudioList(filtered, sort, (a) => a.title, (a) => a.currentSlug);
  }, [list.items, search, sort]);

  async function deleteArticles(rows: StudioBlogListItem[]) {
    if (rows.length === 0) return;
    const one = rows.length === 1;
    const ok = await confirm({
      title: one ? `Delete "${rows[0].title}"?` : `Delete ${rows.length} articles?`,
      description: "This permanently removes the article from the public site.",
      confirmLabel: one ? "Delete article" : `Delete ${rows.length} articles`,
      destructive: true,
    });
    if (ok) await list.deleteIds(rows.map((r) => r.currentSlug));
  }

  const total = list.items.length;
  const countLabel = search.trim() ? `${filteredSorted.length} of ${total} shown` : `${total} item${total === 1 ? "" : "s"}`;

  const toolbar =
    hasDb && total > 0 ? (
      <div className="flex flex-col gap-4">
        <StudioCulturinSearchSortRow
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search title, slug, or summary…"
          sortValue={sort}
          onSortChange={setSort}
        />
        <SelectionBar
          visibleIds={filteredSorted.map((a) => a.currentSlug)}
          selectedIds={list.selectedIds}
          onSetAll={list.setAll}
          onClear={list.clearSelection}
          onDelete={() => void deleteArticles(list.items.filter((a) => list.selectedIds.has(a.currentSlug)))}
          deleting={list.deleting}
          noun="articles"
        />
      </div>
    ) : null;

  return (
    <>
      <div className="mt-6">
        <Link href="/admin/articles/new" className={studioCreateButtonClass}>
          Create article
        </Link>
      </div>

      {list.error ? <Notice tone="error">{list.error}</Notice> : null}

      <StudioCulturinListSection title="All articles" countLabel={countLabel} toolbar={toolbar}>
        {!hasDb ? (
          <EmptyNote>The database isn&apos;t connected in this preview, so articles can&apos;t be listed yet.</EmptyNote>
        ) : total === 0 ? (
          <EmptyNote>No articles yet. Use Create article to add one.</EmptyNote>
        ) : filteredSorted.length === 0 ? (
          <EmptyNote>No articles match your search.</EmptyNote>
        ) : (
          <ul className="m-0 list-none space-y-3 p-0">
            {filteredSorted.map((article) => {
              const slug = article.currentSlug;
              return (
                <li key={slug} className={`${studioListRowClass} flex items-start gap-3`}>
                  <div className="pt-1">
                    <SelectBox
                      checked={list.selectedIds.has(slug)}
                      onChange={() => list.toggle(slug)}
                      label={`Select ${article.title}`}
                    />
                  </div>
                  <a
                    href={`/articles/${encodeURIComponent(slug)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Open "${article.title}" in a new tab`}
                    className="group min-w-0 flex-1 rounded-md no-underline outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--c-accent)]"
                  >
                    <p className="m-0 truncate text-sm font-semibold text-[color:var(--c-ink)] transition group-hover:text-[color:var(--c-accent)]">
                      {article.title}
                    </p>
                    <p className="m-0 mt-1 truncate text-xs text-[color:var(--c-muted)]">/{slug}</p>
                    {article.summary ? (
                      <p className="m-0 mt-1.5 line-clamp-2 text-xs text-[color:var(--c-muted)]">{article.summary}</p>
                    ) : null}
                  </a>
                  <div className="flex shrink-0 items-center gap-2">
                    <Link href={`/admin/articles/edit/${encodeURIComponent(slug)}`} className={studioListEditLinkClass}>
                      Edit
                    </Link>
                    <DeleteIconButton
                      label={`Delete ${article.title}`}
                      disabled={list.deleting}
                      onClick={() => void deleteArticles([article])}
                    />
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
