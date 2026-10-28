import "server-only";

import { getAnalytics } from "@/lib/studio/analytics";

import { apifyConfigured, lookupInstagramProfiles, searchInstagramAccounts, searchTikTokAccounts, type SocialAccount } from "./apify";
import { domainOf, exaConfigured, exaContents, exaSearch, type ExaCategory, type ExaResult } from "./exa";
import { countryCodeFor, publicHolidays } from "./holidays";
import { addCost, addSources, updateRequest } from "./store";
import type { BriefingRequest, BriefingSource } from "./types";

/** Which part of the briefing a search feeds; stored on each source so the writer can group evidence. */
export type ResearchSection =
  | "snapshot"
  | "audience"
  | "food"
  | "history"
  | "musicArt"
  | "neighbourhoods"
  | "influencers"
  | "calendar"
  | "sensitivities"
  | "opportunities";

type Query = { section: ResearchSection; query: string; category?: ExaCategory; sinceMonths?: number; num?: number };

const monthsAgo = (n: number) => {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d.toISOString().slice(0, 10);
};

function webQueries(r: BriefingRequest): Query[] {
  const city = r.place;
  const where = `${r.place}, ${r.country}`;
  const year = new Date().getFullYear();
  const q: Query[] = [
    { section: "snapshot", query: `${where} population, visitor numbers and tourism statistics ${year}` },
    { section: "snapshot", query: `What defines the culture and identity of ${where}` },
    { section: "food", query: `${city} food culture: traditional dishes and their history` },
    { section: "food", query: `Best restaurants and chefs in ${city} right now`, category: "news", sinceMonths: 18 },
    { section: "food", query: `${city} markets, street food and food traditions` },
    { section: "history", query: `History of ${city} and the stories that shaped it` },
    { section: "history", query: `${city} heritage sites and museums that explain the city's past` },
    { section: "musicArt", query: `${city} music scene: genres, venues and artists` },
    { section: "musicArt", query: `${city} contemporary art scene, galleries and artists`, category: "news", sinceMonths: 18 },
    { section: "neighbourhoods", query: `${city} neighbourhoods guide: where culture lives` },
    { section: "influencers", query: `${city} creators, food writers and cultural tastemakers to follow` },
    { section: "influencers", query: `${city} culture media, magazines and community organisations` },
    { section: "sensitivities", query: `Cultural sensitivities and etiquette for brands and visitors in ${where}` },
    { section: "sensitivities", query: `${city} social issues, tourism impact and community concerns`, category: "news", sinceMonths: 12 },
  ];
  if (r.audience.trim()) {
    q.push({ section: "audience", query: `${r.audience} and ${city}: travel and cultural interest trends`, sinceMonths: 24 });
  }
  if (r.kind === "briefing" && r.objective.trim()) {
    q.push({ section: "opportunities", query: `Brands launching cultural events and partnerships in ${city}`, category: "news", sinceMonths: 18 });
    q.push({ section: "opportunities", query: `${r.objective} in ${city}: examples from brands`, sinceMonths: 24 });
  }
  return q;
}

function calendarQueries(r: BriefingRequest): Query[] {
  const city = r.place;
  const years = Array.from(new Set([r.timeframeStart.slice(0, 4), r.timeframeEnd.slice(0, 4)])).join(" and ");
  return [
    { section: "calendar", query: `${city} festivals and cultural events calendar ${years} with dates`, sinceMonths: 12 },
    { section: "calendar", query: `${city} music festivals ${years} dates and line-up`, sinceMonths: 12 },
    { section: "calendar", query: `${city} art fair, design week and fashion week ${years} dates`, sinceMonths: 12 },
    { section: "calendar", query: `${city} major sport events and fixtures ${years}`, sinceMonths: 12 },
    { section: "calendar", query: `${city} food and wine festivals ${years}`, sinceMonths: 12 },
    { section: "calendar", query: `${city} industry conferences and trade events ${years}`, sinceMonths: 12 },
  ];
}

async function pool<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx]);
      }
    }),
  );
  return out;
}

async function runQueries(r: BriefingRequest, queries: Query[]): Promise<{ hits: { q: Query; res: ExaResult }[]; costUsd: number }> {
  let costUsd = 0;
  const batches = await pool(queries, 4, async (q) => {
    try {
      const { results, costUsd: c } = await exaSearch({
        query: q.query,
        numResults: q.num ?? 6,
        category: q.category,
        startPublishedDate: q.sinceMonths ? monthsAgo(q.sinceMonths) : undefined,
        highlightsQuery: `${r.place} ${q.section}`,
        highlightsMaxCharacters: 1400,
        signal: AbortSignal.timeout(45_000),
      });
      costUsd += c;
      return results.map((res) => ({ q, res }));
    } catch (error) {
      console.error(`[briefings] Exa query failed (${q.section}):`, error instanceof Error ? error.message : error);
      return [];
    }
  });
  return { hits: batches.flat(), costUsd };
}

function toSource(q: Query, res: ExaResult): Omit<BriefingSource, "key"> {
  return {
    url: res.url,
    title: res.title,
    publisher: domainOf(res.url),
    publishedDate: res.publishedDate,
    excerpt: res.highlights.join(" … ").slice(0, 3000) || null,
    kind: q.category === "news" ? "news" : q.section === "calendar" ? "calendar" : "web",
    meta: { section: q.section, query: q.query, author: res.author },
  };
}

/** Web and news research for every section, plus full text for the most useful pages. */
export async function researchWeb(r: BriefingRequest): Promise<string> {
  if (!exaConfigured()) throw new Error("EXA_API_KEY isn't set, so web research can't run.");
  const { hits, costUsd } = await runQueries(r, webQueries(r));
  const saved = await addSources(r.id, hits.map((h) => toSource(h.q, h.res)));

  // Full text for the top result of the sections where depth matters most.
  const wanted: string[] = ["snapshot", "food", "history", "musicArt", "neighbourhoods", "influencers"];
  const picks = wanted
    .map((section) => saved.find((s) => s.meta.section === section && s.url))
    .filter((s): s is BriefingSource => Boolean(s));
  const { pages, costUsd: contentCost } = await exaContents(picks.map((s) => s.url as string), AbortSignal.timeout(60_000)).catch((error) => {
    console.error("[briefings] Exa contents failed:", error instanceof Error ? error.message : error);
    return { pages: [], costUsd: 0 };
  });
  const text: Record<string, string> = { ...(r.progress.pages ?? {}) };
  for (const p of pages) {
    const s = picks.find((x) => x.url === p.url);
    if (s) text[s.key] = p.text.slice(0, 8000);
  }
  await updateRequest(r.id, { progress: { ...r.progress, pages: text } });
  await addCost(r.id, { exa: costUsd + contentCost });
  return `${saved.length} web and news sources, ${pages.length} full pages`;
}

/** Public holidays plus searches for festivals, fixtures, fashion weeks and industry events. */
export async function researchCalendar(r: BriefingRequest): Promise<string> {
  const code = r.countryCode ?? (await countryCodeFor(r.country).catch(() => null));
  if (code && !r.countryCode) await updateRequest(r.id, { country_code: code });
  const holidays = code ? await publicHolidays(code, r.timeframeStart, r.timeframeEnd).catch(() => []) : [];
  const holidaySources: Omit<BriefingSource, "key">[] = holidays.map((h) => ({
    url: `https://date.nager.at/api/v3/PublicHolidays/${h.date.slice(0, 4)}/${code}`,
    title: `${h.name} (${h.date})`,
    publisher: "Nager.Date public holidays",
    publishedDate: null,
    excerpt: `${h.name}${h.localName !== h.name ? ` (${h.localName})` : ""} is a public holiday in ${r.country} on ${h.date}${h.global ? "" : " in some regions"}.`,
    kind: "calendar",
    meta: { section: "calendar", holidayDate: h.date, holiday: true },
  }));
  // Holiday pages share a URL per year, so key each by date to keep them distinct.
  for (const s of holidaySources) s.url = `${s.url}#${(s.meta as { holidayDate: string }).holidayDate}`;

  let costUsd = 0;
  let found = 0;
  if (exaConfigured()) {
    const { hits, costUsd: c } = await runQueries(r, calendarQueries(r));
    costUsd = c;
    found = (await addSources(r.id, hits.map((h) => toSource(h.q, h.res)))).length;
  }
  await addSources(r.id, holidaySources);
  await addCost(r.id, { exa: costUsd });
  return `${holidaySources.length} public holidays, ${found} event sources`;
}

/** Creators and tastemakers on Instagram and TikTok, found by searching the city's culture terms. */
export async function researchSocial(r: BriefingRequest, deadline: number): Promise<string> {
  if (!apifyConfigured()) return "Skipped: APIFY_TOKEN isn't set, so social handles come only from web sources.";
  const city = r.place.toLowerCase();
  const terms = [`${city} chef`, `${city} food writer`, `${city} artist`, `${city} dj`, `${city} gallery`, `${city} culture`];
  const searchDeadline = Math.min(deadline, Date.now() + 90_000);
  const results = await Promise.allSettled([
    searchInstagramAccounts(terms, 8, searchDeadline),
    searchTikTokAccounts([`${city} food`, `${city} music`, `${city} art`], 6, searchDeadline),
  ]);
  let costUsd = 0;
  const accounts: SocialAccount[] = [];
  for (const res of results) {
    if (res.status === "fulfilled") {
      costUsd += res.value.costUsd;
      accounts.push(...res.value.accounts);
    } else {
      console.error("[briefings] social search failed:", res.reason instanceof Error ? res.reason.message : res.reason);
    }
  }
  // Instagram's search returns handles without follower counts; the profile lookup fills them in.
  const igHandles = Array.from(new Set(accounts.filter((a) => a.platform === "instagram").map((a) => a.handle))).slice(0, 40);
  if (igHandles.length) {
    try {
      const looked = await lookupInstagramProfiles(igHandles, deadline);
      costUsd += looked.costUsd;
      const byHandle = new Map(looked.accounts.map((a) => [a.handle, a]));
      for (const a of accounts) {
        const full = a.platform === "instagram" ? byHandle.get(a.handle) : undefined;
        if (full) Object.assign(a, { name: full.name ?? a.name, bio: full.bio ?? a.bio, followers: full.followers, verified: full.verified });
      }
    } catch (error) {
      console.error("[briefings] Instagram profile lookup failed:", error instanceof Error ? error.message : error);
    }
  }
  const seen = new Set<string>();
  const useful = accounts
    .filter((a) => (a.followers ?? 0) >= 1000 && !seen.has(`${a.platform}:${a.handle}`) && seen.add(`${a.platform}:${a.handle}`))
    .sort((a, b) => (b.followers ?? 0) - (a.followers ?? 0))
    .slice(0, 40);
  const saved = await addSources(
    r.id,
    useful.map((a) => ({
      url: a.url,
      title: `${a.name ?? a.handle} (@${a.handle}) on ${a.platform === "instagram" ? "Instagram" : "TikTok"}`,
      publisher: a.platform === "instagram" ? "Instagram" : "TikTok",
      publishedDate: null,
      excerpt: [a.bio, a.followers != null ? `${a.followers.toLocaleString("en-GB")} followers` : null].filter(Boolean).join(" · ") || null,
      kind: "social",
      meta: { section: "influencers", platform: a.platform, handle: a.handle, followers: a.followers, verified: a.verified, term: a.term },
    })),
  );
  await addCost(r.id, { apify: costUsd });
  return `${saved.length} social accounts`;
}

/**
 * Aggregate signals from Culturin's own audience: network size, seniority mix and how many people
 * are in the place's country. Never names, emails or any individual's details.
 */
export async function researchFirstParty(r: BriefingRequest): Promise<string> {
  const a = await getAnalytics("all", {});
  if (!a.connected || a.uniquePeople === 0) return "No first-party data available.";
  const titled = a.seniority.filter((s) => s.label !== "Not given").reduce((n, s) => n + s.count, 0);
  const senior = a.seniority
    .filter((s) => s.label === "Founder / C-suite / Partner" || s.label === "VP / Director / Head")
    .reduce((n, s) => n + s.count, 0);
  const inCountry = a.countries.find((c) => c.label.toLowerCase() === r.country.toLowerCase())?.count ?? 0;
  const inUk = a.countries.find((c) => c.label === "United Kingdom")?.count ?? 0;
  const located = a.countries.reduce((n, c) => n + c.count, 0);
  const lines = [
    `Culturin's network holds ${a.uniquePeople.toLocaleString("en-GB")} people from guest lists and subscribers.`,
    titled ? `Of the ${titled.toLocaleString("en-GB")} who share a job title, ${Math.round((senior / titled) * 100)}% are VP, Director, Head or above.` : null,
    located ? `Of the ${located} with a recorded location, ${inUk} are in the United Kingdom and ${inCountry} are in ${r.country}.` : null,
  ].filter(Boolean);
  await addSources(r.id, [
    {
      url: null,
      title: `Culturin audience data (aggregate), ${new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" })}`,
      publisher: "Culturin",
      publishedDate: new Date().toISOString().slice(0, 10),
      excerpt: lines.join(" "),
      kind: "first_party",
      meta: { section: "audience", aggregate: true },
    },
  ]);
  return "Culturin aggregate audience signals";
}
