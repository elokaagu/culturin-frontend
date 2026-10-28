import "server-only";

/**
 * Minimal Apify client for briefing research, ported from Satellite Labs' Instagram lens.
 * Runs are started and polled, and every run carries a charge cap. Server-only: APIFY_TOKEN never
 * leaves the server.
 */

const API = "https://api.apify.com/v2";
const POLL_MS = 3_000;

export const IG_SEARCH_ACTOR = "apify~instagram-search-scraper";
export const IG_PROFILE_ACTOR = "apify~instagram-profile-scraper";
export const TIKTOK_SEARCH_ACTOR = "clockworks~tiktok-user-search-scraper";
/** Free-tier prices, used when a run doesn't report its own usage. */
const IG_SEARCH_PRICE_USD = 0.0027;
const IG_PROFILE_PRICE_USD = 0.0026;
const TIKTOK_SEARCH_PRICE_USD = 0.006;

type ApifyRun = {
  id: string;
  status: "READY" | "RUNNING" | "SUCCEEDED" | "FAILED" | "TIMING-OUT" | "TIMED-OUT" | "ABORTING" | "ABORTED";
  defaultDatasetId: string;
  usageTotalUsd?: number;
};

export function apifyConfigured(): boolean {
  return Boolean(process.env.APIFY_TOKEN?.trim());
}

async function apifyJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = process.env.APIFY_TOKEN?.trim();
  if (!token) throw new Error("APIFY_TOKEN is not configured");
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(`${API}${path}`, {
        ...init,
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...init.headers },
        signal: AbortSignal.timeout(30_000),
      });
      if (response.status === 429 || response.status >= 500) {
        lastError = new Error(`Apify ${response.status}`);
      } else if (!response.ok) {
        const body = await response.text().catch(() => "");
        throw new Error(`Apify ${response.status}: ${body.slice(0, 200)}`);
      } else {
        return (await response.json()) as T;
      }
    } catch (error) {
      lastError = error;
    }
    await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
  }
  throw lastError instanceof Error ? lastError : new Error("Apify request failed");
}

/** Runs an actor to completion (or until `deadline`) and returns its dataset items and cost. */
async function runActor<T>(
  actor: string,
  input: Record<string, unknown>,
  opts: { maxItems: number; maxChargeUsd: number; deadline: number; fallbackPrice: number },
): Promise<{ items: T[]; costUsd: number }> {
  const timeoutSecs = Math.max(30, Math.floor((opts.deadline - Date.now()) / 1000));
  const params = new URLSearchParams({
    timeout: String(timeoutSecs),
    maxTotalChargeUsd: Math.max(0.05, opts.maxChargeUsd).toFixed(2),
    maxItems: String(opts.maxItems),
  });
  let { data: run } = await apifyJson<{ data: ApifyRun }>(`/acts/${actor}/runs?${params}`, { method: "POST", body: JSON.stringify(input) });
  const finished = (s: ApifyRun["status"]) => s === "SUCCEEDED" || s === "FAILED" || s === "TIMED-OUT" || s === "ABORTED";
  while (!finished(run.status) && Date.now() < opts.deadline) {
    await new Promise((r) => setTimeout(r, POLL_MS));
    run = (await apifyJson<{ data: ApifyRun }>(`/actor-runs/${encodeURIComponent(run.id)}`)).data;
  }
  if (!finished(run.status)) await apifyJson(`/actor-runs/${encodeURIComponent(run.id)}/abort`, { method: "POST" }).catch(() => undefined);
  const items = await apifyJson<T[]>(`/datasets/${encodeURIComponent(run.defaultDatasetId)}/items?clean=true&format=json&limit=${opts.maxItems}`);
  const costUsd = typeof run.usageTotalUsd === "number" && run.usageTotalUsd > 0 ? run.usageTotalUsd : items.length * opts.fallbackPrice;
  return { items, costUsd };
}

export type SocialAccount = {
  platform: "instagram" | "tiktok";
  handle: string;
  name: string | null;
  bio: string | null;
  followers: number | null;
  verified: boolean;
  url: string;
  term: string;
};

const clean = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);
const int = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? Math.round(v) : null);

/** Public Instagram accounts matching each search term (Instagram's own account search). */
export async function searchInstagramAccounts(terms: string[], perTerm: number, deadline: number): Promise<{ accounts: SocialAccount[]; costUsd: number }> {
  const max = terms.length * perTerm;
  const { items, costUsd } = await runActor<Record<string, unknown>>(
    IG_SEARCH_ACTOR,
    { search: terms.join(","), searchType: "user", searchLimit: perTerm, liveSearch: true },
    { maxItems: max, maxChargeUsd: max * IG_SEARCH_PRICE_USD * 1.2, deadline, fallbackPrice: IG_SEARCH_PRICE_USD },
  );
  const accounts = items.flatMap((item): SocialAccount[] => {
    const handle = clean(item.username)?.toLowerCase();
    if (!handle || item.private === true) return [];
    return [
      {
        platform: "instagram",
        handle,
        name: clean(item.fullName) ?? clean(item.full_name),
        bio: clean(item.biography)?.slice(0, 300) ?? null,
        followers: int(item.followersCount),
        verified: item.verified === true,
        url: `https://www.instagram.com/${handle}/`,
        term: clean(item.searchTerm) ?? "",
      },
    ];
  });
  return { accounts, costUsd };
}

/** TikTok accounts matching each search query. */
export async function searchTikTokAccounts(terms: string[], perTerm: number, deadline: number): Promise<{ accounts: SocialAccount[]; costUsd: number }> {
  const max = terms.length * perTerm;
  const { items, costUsd } = await runActor<Record<string, unknown>>(
    TIKTOK_SEARCH_ACTOR,
    { searchQueries: terms, maxProfilesPerQuery: perTerm },
    { maxItems: max, maxChargeUsd: max * TIKTOK_SEARCH_PRICE_USD * 1.2, deadline, fallbackPrice: TIKTOK_SEARCH_PRICE_USD },
  );
  const accounts = items.flatMap((item): SocialAccount[] => {
    const handle = clean(item.name)?.replace(/^@/, "").toLowerCase();
    if (!handle || item.privateAccount === true) return [];
    return [
      {
        platform: "tiktok",
        handle,
        name: clean(item.nickName),
        bio: clean(item.signature)?.slice(0, 300) ?? null,
        followers: int(item.fans),
        verified: item.verified === true,
        url: `https://www.tiktok.com/@${handle}`,
        term: clean(item.searchQuery) ?? clean(item.input) ?? "",
      },
    ];
  });
  return { accounts, costUsd };
}

/** Looks up Instagram handles: which exist, and their follower counts. Missing handles come back absent. */
export async function lookupInstagramProfiles(handles: string[], deadline: number): Promise<{ accounts: SocialAccount[]; costUsd: number }> {
  if (!handles.length) return { accounts: [], costUsd: 0 };
  const { items, costUsd } = await runActor<Record<string, unknown>>(
    IG_PROFILE_ACTOR,
    { usernames: handles, includeAboutSection: false },
    { maxItems: handles.length, maxChargeUsd: handles.length * IG_PROFILE_PRICE_USD * 1.2, deadline, fallbackPrice: IG_PROFILE_PRICE_USD },
  );
  const accounts = items.flatMap((item): SocialAccount[] => {
    const handle = clean(item.username)?.toLowerCase();
    const missing = Boolean(item.error) && !item.fullName && item.followersCount == null;
    if (!handle || missing) return [];
    return [
      {
        platform: "instagram",
        handle,
        name: clean(item.fullName),
        bio: clean(item.biography)?.slice(0, 300) ?? null,
        followers: int(item.followersCount),
        verified: item.verified === true,
        url: `https://www.instagram.com/${handle}/`,
        term: "lookup",
      },
    ];
  });
  return { accounts, costUsd };
}
