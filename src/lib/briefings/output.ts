import { LIST_SECTIONS, SECTION_META, type BriefingSections, type ItemReview, type ListSectionKey } from "./types";

export type Audience = "professional" | "guide";

/**
 * What a reader sees: rejected items never appear; the professional briefing drops anything
 * unsourced; the public guide leaves out sensitivities and opportunities.
 */
export function visibleSections(sections: BriefingSections, audience: Audience): BriefingSections {
  const keep = <T extends ItemReview>(items: T[]) =>
    items.filter((i) => i.decision !== "rejected" && (audience === "guide" || i.sources.length > 0));
  const out = { ...sections, snapshot: { ...sections.snapshot, numbers: keep(sections.snapshot.numbers) } };
  for (const key of LIST_SECTIONS) {
    const items = keep(sections[key] as ItemReview[]);
    (out as Record<ListSectionKey, unknown>)[key] = audience === "guide" && !SECTION_META[key].inGuide ? [] : items;
  }
  return out;
}

/** Items still waiting on a reviewer's accept or reject. */
export function pendingItems(sections: BriefingSections): ItemReview[] {
  const all: ItemReview[] = [...sections.snapshot.numbers];
  for (const key of LIST_SECTIONS) all.push(...(sections[key] as ItemReview[]));
  return all.filter((i) => i.decision === "pending");
}

/** Source keys the visible sections cite, in first-use order. */
export function citedKeys(sections: BriefingSections): string[] {
  const keys = new Set<string>(sections.snapshot.sources);
  for (const n of sections.snapshot.numbers) n.sources.forEach((k) => keys.add(k));
  for (const key of LIST_SECTIONS) for (const item of sections[key] as ItemReview[]) item.sources.forEach((k) => keys.add(k));
  return Array.from(keys);
}

export function formatDateRange(start: string, end: string | null): string {
  const fmt = (d: string, withYear: boolean) =>
    new Date(`${d}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", ...(withYear ? { year: "numeric" } : {}) });
  if (!end || end === start) return fmt(start, true);
  return `${fmt(start, start.slice(0, 4) !== end.slice(0, 4))} to ${fmt(end, true)}`;
}
