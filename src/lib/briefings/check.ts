import "server-only";

import { z } from "zod";

import { apifyConfigured, lookupInstagramProfiles } from "./apify";
import { CHECKER_MODEL, structured } from "./llm";
import { addCost, briefingsDb, getSources, latestBriefing } from "./store";
import {
  LIST_SECTIONS,
  type BriefingRequest,
  type BriefingSections,
  type BriefingSource,
  type CalendarMoment,
  type Confidence,
  type Influencer,
  type ItemReview,
} from "./types";
import { voiceIssues } from "./voice";

type AnyItem = ItemReview & Record<string, unknown>;

/** The text a claim makes, for the support check and the voice check. */
function claimText(section: string, item: AnyItem): string {
  const parts = ["name", "title", "label", "value", "detail", "idea", "why", "reach", "start", "end", "location"]
    .map((k) => item[k])
    .filter((v): v is string => typeof v === "string" && v.trim() !== "");
  return `${section}: ${parts.join(" | ")}`;
}

const verdictSchema = z.object({
  verdicts: z.array(
    z.object({
      id: z.string(),
      verdict: z.enum(["supported", "partial", "unsupported"]),
      note: z.string().describe("One short sentence for the reviewer; empty when fully supported."),
    }),
  ),
});

const isDate = (v: unknown): v is string => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));

/**
 * Second pass over the draft. Confirms every cited source exists and supports the claim, keeps
 * calendar dates inside the timeframe and in the future, resolves social handles, and marks each
 * item with a confidence level and flags for the reviewer. Saves the result as a new briefing
 * version in review.
 */
export async function checkBriefing(r: BriefingRequest, deadline: number): Promise<string> {
  const draft = r.progress.draft;
  if (!draft) throw new Error("There's no draft to check yet.");
  const sources = await getSources(r.id);
  const byKey = new Map(sources.map((s) => [s.key, s]));
  const today = new Date().toISOString().slice(0, 10);
  const strict = r.kind === "briefing";

  const sections: BriefingSections = JSON.parse(JSON.stringify(draft));
  const flags = new Map<string, string[]>();
  const flag = (id: string, note: string) => flags.set(id, [...(flags.get(id) ?? []), note]);
  const items: { section: string; item: AnyItem }[] = [];
  for (const key of LIST_SECTIONS) for (const item of sections[key] as unknown as AnyItem[]) items.push({ section: key, item });
  for (const n of sections.snapshot.numbers) items.push({ section: "snapshot", item: n as unknown as AnyItem });

  // 1. Citations exist.
  for (const { item } of items) {
    const valid = (item.sources ?? []).filter((k) => byKey.has(k));
    if (valid.length < (item.sources ?? []).length) flag(item.id, "Cited a source that doesn't exist; removed it");
    item.sources = valid;
    if (!valid.length) flag(item.id, strict ? "No source: can't appear in the professional briefing unsourced" : "No source");
  }
  sections.snapshot.sources = sections.snapshot.sources.filter((k) => byKey.has(k));

  // 2. Calendar dates are real, in the future and inside the timeframe.
  for (const m of sections.calendar as CalendarMoment[]) {
    if (!isDate(m.start)) flag(m.id, `Start date "${m.start}" isn't a valid date`);
    else {
      if (m.start < today) flag(m.id, "Date is in the past");
      if (m.start < r.timeframeStart || m.start > r.timeframeEnd) flag(m.id, "Date falls outside the timeframe");
    }
    if (m.end && (!isDate(m.end) || m.end < m.start)) flag(m.id, "End date is invalid or before the start");
  }

  // 3. Handles are real: matched to the social research, otherwise looked up on Instagram.
  const social = sources.filter((s) => s.kind === "social");
  const known = new Map(social.map((s) => [`${s.meta.platform}:${String(s.meta.handle).toLowerCase()}`, s]));
  const toLookUp: Influencer[] = [];
  for (const p of sections.influencers as Influencer[]) {
    if (!p.handle) continue;
    const handle = p.handle.toLowerCase().replace(/^@/, "");
    const platform = p.platform.toLowerCase().includes("tiktok") ? "tiktok" : "instagram";
    const hit = known.get(`${platform}:${handle}`);
    if (hit) {
      p.verified = true;
      p.followers = typeof hit.meta.followers === "number" ? hit.meta.followers : null;
      if (!p.sources.includes(hit.key)) p.sources.push(hit.key);
    } else if (platform === "instagram") {
      toLookUp.push(p);
    } else {
      p.verified = false;
      flag(p.id, `TikTok handle @${handle} wasn't found in the social research`);
    }
  }
  let apifyCost = 0;
  if (toLookUp.length) {
    if (apifyConfigured()) {
      try {
        const { accounts, costUsd } = await lookupInstagramProfiles(
          toLookUp.map((p) => (p.handle as string).toLowerCase().replace(/^@/, "")),
          Math.min(deadline, Date.now() + 120_000),
        );
        apifyCost = costUsd;
        const found = new Map(accounts.map((a) => [a.handle, a]));
        for (const p of toLookUp) {
          const a = found.get((p.handle as string).toLowerCase().replace(/^@/, ""));
          p.verified = Boolean(a);
          p.followers = a?.followers ?? null;
          if (!a) flag(p.id, `Instagram handle @${p.handle} couldn't be found`);
        }
      } catch (error) {
        for (const p of toLookUp) flag(p.id, "Handle couldn't be checked (Instagram lookup failed)");
        console.error("[briefings] handle lookup failed:", error instanceof Error ? error.message : error);
      }
    } else {
      for (const p of toLookUp) flag(p.id, "Handle not checked: APIFY_TOKEN isn't set");
    }
  }

  // 4. Copy follows the voice rules.
  for (const { item } of items) for (const issue of voiceIssues(claimText("", item))) flag(item.id, issue);

  // 5. Each claim is supported by what its sources say.
  const excerpt = (s: BriefingSource) => `${s.title ?? ""} ${s.excerpt ?? ""}`.replace(/\s+/g, " ").slice(0, 700);
  const checkable = items.filter(({ item }) => item.sources.length);
  const prompt = `Check each claim against the excerpts from its cited sources. "supported" means the excerpts state it; "partial" means some details (a number, date, name or place) aren't in them; "unsupported" means they don't back it up. Social profile sources support a person's handle, bio and follower count. Public-holiday sources support holiday dates.

${checkable
  .map(({ section, item }) => `CLAIM ${item.id}\n${claimText(section, item)}\n${item.sources.map((k) => `[${k}] ${excerpt(byKey.get(k) as BriefingSource)}`).join("\n")}`)
  .join("\n\n")}`;
  const verdicts = new Map<string, { verdict: string; note: string }>();
  let llm = { costUsd: 0, inputTokens: 0, outputTokens: 0 };
  if (checkable.length) {
    const res = await structured({
      model: CHECKER_MODEL,
      system: "You are a meticulous fact-checker for Culturin's culture briefings. Judge only from the excerpts given. British English.",
      prompt,
      schema: verdictSchema,
      maxOutputTokens: 12_000,
    });
    llm = res.usage;
    for (const v of res.output.verdicts) verdicts.set(v.id, { verdict: v.verdict, note: v.note });
  }

  // 6. Confidence and review state.
  let high = 0;
  for (const { item } of items) {
    const v = verdicts.get(item.id);
    if (v?.verdict === "unsupported") flag(item.id, v.note || "Sources don't support this");
    if (v?.verdict === "partial") flag(item.id, v.note || "Only partly supported");
    const notes = flags.get(item.id) ?? [];
    const weak = !item.sources.length || v?.verdict === "unsupported" || notes.some((n) => /couldn't be found|past|outside the timeframe|isn't a valid/.test(n));
    const confidence: Confidence = weak ? "low" : notes.length || v?.verdict === "partial" ? "medium" : "high";
    item.confidence = confidence;
    item.flags = notes;
    item.decision = notes.length ? "pending" : "accepted";
    if (confidence === "high") high++;
  }
  const share = items.length ? high / items.length : 0;
  const overall: Confidence = share >= 0.8 ? "high" : share >= 0.55 ? "medium" : "low";

  const previous = await latestBriefing(r.id);
  const db = briefingsDb();
  const { data: created, error } = await db
    .from("briefings")
    .insert({
      request_id: r.id,
      version: (previous?.version ?? 0) + 1,
      sections,
      summary: r.progress.draftSummary ?? "",
      confidence: overall,
    })
    .select("id")
    .single();
  if (error || !created) throw new Error(`Couldn't save the briefing: ${error?.message ?? "unknown error"}`);
  await db.from("briefing_sources").update({ briefing_id: created.id }).eq("request_id", r.id);
  await addCost(r.id, { apify: apifyCost, llm: llm.costUsd, llmInputTokens: llm.inputTokens, llmOutputTokens: llm.outputTokens });

  const flagged = items.filter(({ item }) => item.decision === "pending").length;
  return `${items.length} items checked: ${high} high confidence, ${flagged} flagged for review`;
}
