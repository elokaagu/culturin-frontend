import "server-only";

/** Minimal client for Exa's search and contents APIs (https://exa.ai/docs/reference/search). Server-only. */

export type ExaCategory = "company" | "news" | "people" | "personal site" | "financial report";

export type ExaSearchOptions = {
  query: string;
  numResults?: number;
  category?: ExaCategory;
  includeDomains?: string[];
  excludeDomains?: string[];
  /** ISO date or date-time. */
  startPublishedDate?: string;
  /** Guides which passages come back as highlights. */
  highlightsQuery?: string;
  highlightsMaxCharacters?: number;
  signal?: AbortSignal;
};

export type ExaResult = {
  title: string | null;
  url: string;
  publishedDate: string | null;
  author: string | null;
  highlights: string[];
};

export function exaConfigured(): boolean {
  return Boolean(process.env.EXA_API_KEY?.trim());
}

/** Search results plus what Exa billed for the call (its `costDollars.total`). */
export async function exaSearch(options: ExaSearchOptions): Promise<{ results: ExaResult[]; costUsd: number }> {
  const apiKey = process.env.EXA_API_KEY?.trim();
  if (!apiKey) throw new Error("EXA_API_KEY is not configured");

  const body: Record<string, unknown> = {
    query: options.query,
    type: "auto",
    numResults: options.numResults ?? 8,
    contents: {
      highlights: {
        ...(options.highlightsQuery ? { query: options.highlightsQuery } : {}),
        maxCharacters: options.highlightsMaxCharacters ?? 1200,
      },
    },
  };
  if (options.category) body.category = options.category;
  if (options.includeDomains?.length) body.includeDomains = options.includeDomains;
  if (options.excludeDomains?.length) body.excludeDomains = options.excludeDomains;
  if (options.startPublishedDate) body.startPublishedDate = options.startPublishedDate;

  const response = await fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "x-api-key": apiKey, "content-type": "application/json" },
    body: JSON.stringify(body),
    signal: options.signal,
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Exa search failed (${response.status}): ${text.slice(0, 300)}`);
  }

  const payload = (await response.json()) as { results?: Array<Record<string, unknown>>; costDollars?: { total?: number } };
  const results = (payload.results ?? []).map((r) => ({
    title: typeof r.title === "string" ? r.title.replace(/\s+/g, " ").trim() || null : null,
    url: String(r.url),
    publishedDate: typeof r.publishedDate === "string" ? r.publishedDate.slice(0, 10) : null,
    author: typeof r.author === "string" ? r.author : null,
    highlights: Array.isArray(r.highlights) ? (r.highlights as string[]) : [],
  }));
  return { results, costUsd: typeof payload.costDollars?.total === "number" ? payload.costDollars.total : 0 };
}

export type ExaPageText = { url: string; title: string | null; text: string };

/** Full text for a batch of URLs via Exa's /contents (cached, live crawl as fallback). */
export async function exaContents(urls: string[], signal?: AbortSignal): Promise<{ pages: ExaPageText[]; costUsd: number }> {
  const apiKey = process.env.EXA_API_KEY?.trim();
  if (!apiKey || !urls.length) return { pages: [], costUsd: 0 };
  const response = await fetch("https://api.exa.ai/contents", {
    method: "POST",
    headers: { "x-api-key": apiKey, "content-type": "application/json" },
    body: JSON.stringify({ urls: urls.slice(0, 50), text: { maxCharacters: 12_000 } }),
    signal,
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Exa contents failed (${response.status}): ${detail.slice(0, 300)}`);
  }
  const payload = (await response.json()) as {
    results?: Array<{ url?: string; title?: string | null; text?: string | null }>;
    costDollars?: { total?: number };
  };
  const pages = (payload.results ?? [])
    .filter((r) => r.url && r.text)
    .map((r) => ({ url: String(r.url), title: r.title ?? null, text: String(r.text) }));
  return { pages, costUsd: typeof payload.costDollars?.total === "number" ? payload.costDollars.total : 0 };
}

/** "https://www.example.com/path" → "example.com" */
export function domainOf(url: string | null | undefined): string | null {
  const raw = url?.trim();
  if (!raw) return null;
  try {
    return new URL(raw.includes("://") ? raw : `https://${raw}`).hostname.replace(/^www\./, "") || null;
  } catch {
    return null;
  }
}
