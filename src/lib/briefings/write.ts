import "server-only";

import { WRITER_MODEL, structured } from "./llm";
import { addCost, getSources, updateRequest } from "./store";
import {
  EMPTY_SECTIONS,
  briefingDraftSchema,
  guideDraftSchema,
  type BriefingRequest,
  type BriefingSections,
  type BriefingSource,
} from "./types";
import { VOICE_RULES } from "./voice";

function evidenceBlock(sources: BriefingSource[], pages: Record<string, string>, sections: string[]): string {
  return sources
    .filter((s) => sections.includes(String(s.meta.section ?? "")))
    .map((s) => {
      const head = [`[${s.key}]`, s.kind, s.publishedDate, s.publisher].filter(Boolean).join(" · ");
      const body = pages[s.key] ? `${s.excerpt ?? ""}\nFull text: ${pages[s.key]}` : (s.excerpt ?? "");
      return `${head}\n${s.title ?? ""}${s.url ? `\n${s.url}` : ""}\n${body}`.trim();
    })
    .join("\n\n");
}

function brief(r: BriefingRequest): string {
  return [
    `Place: ${r.place}, ${r.country}`,
    `Output: ${r.kind === "guide" ? "a free public culture guide for travellers" : "a paid professional briefing"}`,
    r.audience ? `Audience: ${r.audience}` : null,
    r.objective ? `Buyer's objective: ${r.objective}` : null,
    r.category ? `Category: ${r.category}` : null,
    `Timeframe: ${r.timeframeStart} to ${r.timeframeEnd}`,
    `Today: ${new Date().toISOString().slice(0, 10)}`,
  ]
    .filter(Boolean)
    .join("\n");
}

const SYSTEM = `You are Culturin's culture researcher and writer. You turn research evidence into a guide to the culture of one place: its food, history, music, art, neighbourhoods and people.

${VOICE_RULES}

Citations: every item must list the source keys (like "S4") whose evidence supports it. Use only keys from the evidence. If the evidence doesn't support something, leave it out.`;

const withIds = <T extends object>(prefix: string, items: T[]) => items.map((item, i) => ({ id: `${prefix}-${i + 1}`, ...item }));

/** Writes every section from the gathered evidence and stores the draft on the request. */
export async function writeBriefing(r: BriefingRequest): Promise<string> {
  const sources = await getSources(r.id);
  if (sources.length < 10) throw new Error(`Only ${sources.length} sources were gathered, which is too few to write from.`);
  const pages = r.progress.pages ?? {};

  const guidePrompt = `${brief(r)}

Write the culture guide sections: snapshot (with three to five key numbers), food, history, music and art, neighbourhoods, and who influences the culture. For influencers, prefer accounts from the social evidence and give their follower counts as reach.

EVIDENCE
${evidenceBlock(sources, pages, ["snapshot", "audience", "food", "history", "musicArt", "neighbourhoods", "influencers"])}`;

  const briefingPrompt = `${brief(r)}

Write: a two-sentence summary; the moments calendar (only moments whose dates fall inside the timeframe and appear in the evidence; public holidays count); sensitivities (what to get right and what to avoid); and ${
    r.kind === "briefing" ? "three to five opportunities tied to the buyer's objective and audience" : "no opportunities (return an empty list)"
  }.

EVIDENCE
${evidenceBlock(sources, pages, ["calendar", "sensitivities", "opportunities", "audience", "snapshot"])}`;

  const [guide, rest] = await Promise.all([
    structured({ model: WRITER_MODEL, system: SYSTEM, prompt: guidePrompt, schema: guideDraftSchema }),
    structured({ model: WRITER_MODEL, system: SYSTEM, prompt: briefingPrompt, schema: briefingDraftSchema }),
  ]);

  const g = guide.output;
  const b = rest.output;
  const draft: BriefingSections = {
    ...EMPTY_SECTIONS,
    snapshot: { text: g.snapshot.text, sources: g.snapshot.sources, numbers: withIds("number", g.snapshot.numbers) },
    food: withIds("food", g.food),
    history: withIds("history", g.history),
    musicArt: withIds("music", g.musicArt),
    neighbourhoods: withIds("hood", g.neighbourhoods),
    influencers: withIds("person", g.influencers.map((p) => ({ ...p, handle: p.handle?.replace(/^@/, "").trim() || null }))),
    calendar: withIds("moment", [...b.calendar].sort((x, y) => x.start.localeCompare(y.start))),
    sensitivities: withIds("care", b.sensitivities),
    opportunities: r.kind === "briefing" ? withIds("idea", b.opportunities) : [],
  };

  await updateRequest(r.id, { progress: { ...r.progress, draft, draftSummary: b.summary } });
  await addCost(r.id, {
    llm: guide.usage.costUsd + rest.usage.costUsd,
    llmInputTokens: guide.usage.inputTokens + rest.usage.inputTokens,
    llmOutputTokens: guide.usage.outputTokens + rest.usage.outputTokens,
  });
  const count = Object.values(draft).reduce((n, v) => n + (Array.isArray(v) ? v.length : 0), 0);
  return `${count} items written from ${sources.length} sources`;
}
