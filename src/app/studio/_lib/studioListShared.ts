export type StudioSortKey =
  | "date-newest"
  | "date-oldest"
  | "title-asc"
  | "title-desc"
  | "slug-asc"
  | "slug-desc";

export const STUDIO_SORT_OPTIONS: { value: StudioSortKey; label: string }[] = [
  { value: "date-newest", label: "Newest first" },
  { value: "date-oldest", label: "Oldest first" },
  { value: "title-asc", label: "Title A–Z" },
  { value: "title-desc", label: "Title Z–A" },
  { value: "slug-asc", label: "Slug A–Z" },
  { value: "slug-desc", label: "Slug Z–A" },
];

function dateSortKey(a: { publishedAt: string | null; createdAt: string }): string {
  return (a.publishedAt || a.createdAt || "").slice(0, 24);
}

/** Sort studio list rows by publish/create date and title/slug. */
export function sortStudioList<T extends { publishedAt: string | null; createdAt: string }>(
  items: T[],
  sort: StudioSortKey,
  titleOf: (t: T) => string,
  slugOf: (t: T) => string,
): T[] {
  const copy = [...items];
  switch (sort) {
    case "title-asc":
      return copy.sort((a, b) => titleOf(a).localeCompare(titleOf(b), undefined, { sensitivity: "base" }));
    case "title-desc":
      return copy.sort((a, b) => titleOf(b).localeCompare(titleOf(a), undefined, { sensitivity: "base" }));
    case "slug-asc":
      return copy.sort((a, b) => slugOf(a).localeCompare(slugOf(b)));
    case "slug-desc":
      return copy.sort((a, b) => slugOf(b).localeCompare(slugOf(a)));
    case "date-oldest":
      return copy.sort((a, b) => dateSortKey(a).localeCompare(dateSortKey(b)));
    case "date-newest":
    default:
      return copy.sort((a, b) => dateSortKey(b).localeCompare(dateSortKey(a)));
  }
}

/** Client-side filter: keep rows where any provided string field includes the query. */
export function filterStudioList<T>(items: T[], query: string, fieldsOf: (t: T) => string[]): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((t) => fieldsOf(t).some((s) => s.toLowerCase().includes(q)));
}
