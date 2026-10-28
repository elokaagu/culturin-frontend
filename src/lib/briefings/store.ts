import "server-only";

import { getSupabaseAdminFreshOrNull } from "@/lib/supabaseServiceRole";

import {
  EMPTY_SECTIONS,
  type BriefingKind,
  type BriefingRequest,
  type BriefingSections,
  type BriefingSource,
  type Confidence,
  type Progress,
  type RequestStatus,
  type RunCost,
  type SourceKind,
} from "./types";

type Row = Record<string, unknown>;

export function briefingsDb() {
  const db = getSupabaseAdminFreshOrNull();
  if (!db) throw new Error("The database isn't connected.");
  return db;
}

const str = (v: unknown) => (typeof v === "string" ? v : null);

export function toRequest(r: Row): BriefingRequest {
  return {
    id: String(r.id),
    kind: (r.kind as BriefingKind) ?? "briefing",
    place: String(r.place ?? ""),
    country: String(r.country ?? ""),
    countryCode: str(r.country_code),
    slug: String(r.slug ?? ""),
    audience: String(r.audience ?? ""),
    objective: String(r.objective ?? ""),
    category: String(r.category ?? ""),
    timeframeStart: String(r.timeframe_start ?? ""),
    timeframeEnd: String(r.timeframe_end ?? ""),
    buyerName: str(r.buyer_name),
    buyerEmail: str(r.buyer_email),
    buyerCompany: str(r.buyer_company),
    status: (r.status as RequestStatus) ?? "queued",
    progress: (r.progress as Progress) ?? {},
    cost: (r.cost as RunCost) ?? {},
    error: str(r.error),
    createdAt: String(r.created_at ?? ""),
    updatedAt: String(r.updated_at ?? ""),
  };
}

export type Briefing = {
  id: string;
  requestId: string;
  version: number;
  sections: BriefingSections;
  summary: string;
  confidence: Confidence | null;
  curatorId: string | null;
  localNotes: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  publishedAt: string | null;
  deliveredAt: string | null;
  shareToken: string;
  createdAt: string;
  updatedAt: string;
};

export function toBriefing(r: Row): Briefing {
  return {
    id: String(r.id),
    requestId: String(r.request_id),
    version: Number(r.version ?? 1),
    sections: { ...EMPTY_SECTIONS, ...((r.sections as Partial<BriefingSections>) ?? {}) },
    summary: String(r.summary ?? ""),
    confidence: (r.confidence as Confidence | null) ?? null,
    curatorId: str(r.curator_id),
    localNotes: String(r.local_notes ?? ""),
    reviewedBy: str(r.reviewed_by),
    reviewedAt: str(r.reviewed_at),
    publishedAt: str(r.published_at),
    deliveredAt: str(r.delivered_at),
    shareToken: String(r.share_token ?? ""),
    createdAt: String(r.created_at ?? ""),
    updatedAt: String(r.updated_at ?? ""),
  };
}

export function toSource(r: Row): BriefingSource {
  return {
    key: String(r.source_key),
    url: str(r.url),
    title: str(r.title),
    publisher: str(r.publisher),
    publishedDate: str(r.published_date),
    excerpt: str(r.excerpt),
    kind: (r.kind as SourceKind) ?? "web",
    meta: (r.meta as Record<string, unknown>) ?? {},
  };
}

export async function getRequest(id: string): Promise<BriefingRequest | null> {
  const { data } = await briefingsDb().from("briefing_requests").select("*").eq("id", id).maybeSingle();
  return data ? toRequest(data) : null;
}

export async function listRequests(): Promise<(BriefingRequest & { latest: Briefing | null })[]> {
  const db = briefingsDb();
  const [{ data: requests }, { data: briefings }] = await Promise.all([
    db.from("briefing_requests").select("*").order("created_at", { ascending: false }).limit(200),
    db.from("briefings").select("*").order("version", { ascending: false }).limit(500),
  ]);
  const latest = new Map<string, Briefing>();
  for (const b of (briefings ?? []).map(toBriefing)) if (!latest.has(b.requestId)) latest.set(b.requestId, b);
  return (requests ?? []).map((r) => {
    const req = toRequest(r);
    return { ...req, latest: latest.get(req.id) ?? null };
  });
}

export async function latestBriefing(requestId: string): Promise<Briefing | null> {
  const { data } = await briefingsDb()
    .from("briefings")
    .select("*")
    .eq("request_id", requestId)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data ? toBriefing(data) : null;
}

export async function getSources(requestId: string): Promise<BriefingSource[]> {
  const { data } = await briefingsDb().from("briefing_sources").select("*").eq("request_id", requestId).order("created_at");
  return (data ?? []).map(toSource).sort((a, b) => Number(a.key.slice(1)) - Number(b.key.slice(1)));
}

/** Saves new sources, numbering them after the ones already held ("S1", "S2", …). Dedupes by URL. */
export async function addSources(
  requestId: string,
  incoming: Omit<BriefingSource, "key">[],
): Promise<BriefingSource[]> {
  const existing = await getSources(requestId);
  const byUrl = new Map(existing.filter((s) => s.url).map((s) => [s.url as string, s]));
  let next = existing.reduce((n, s) => Math.max(n, Number(s.key.slice(1)) || 0), 0) + 1;
  const fresh: BriefingSource[] = [];
  for (const s of incoming) {
    if (s.url && byUrl.has(s.url)) continue;
    const source = { ...s, key: `S${next++}` };
    if (s.url) byUrl.set(s.url, source);
    fresh.push(source);
  }
  if (fresh.length) {
    const { error } = await briefingsDb()
      .from("briefing_sources")
      .insert(
        fresh.map((s) => ({
          request_id: requestId,
          source_key: s.key,
          url: s.url,
          title: s.title?.slice(0, 500) ?? null,
          publisher: s.publisher,
          published_date: s.publishedDate && /^\d{4}-\d{2}-\d{2}$/.test(s.publishedDate) ? s.publishedDate : null,
          excerpt: s.excerpt?.slice(0, 4000) ?? null,
          kind: s.kind,
          meta: s.meta,
        })),
      );
    if (error) throw new Error(`Couldn't save sources: ${error.message}`);
  }
  return fresh;
}

export async function updateRequest(id: string, patch: Row): Promise<void> {
  const { error } = await briefingsDb().from("briefing_requests").update(patch).eq("id", id);
  if (error) throw new Error(`Couldn't update the request: ${error.message}`);
}

/** Adds spend to the request's running cost. */
export async function addCost(id: string, add: RunCost): Promise<void> {
  const req = await getRequest(id);
  if (!req) return;
  const c = { ...req.cost };
  for (const k of ["exa", "apify", "llm", "llmInputTokens", "llmOutputTokens"] as const) {
    if (add[k]) c[k] = Math.round(((c[k] ?? 0) + (add[k] ?? 0)) * 10_000) / 10_000;
  }
  c.total = Math.round(((c.exa ?? 0) + (c.apify ?? 0) + (c.llm ?? 0)) * 10_000) / 10_000;
  await updateRequest(id, { cost: c });
}

export async function getBriefingByToken(token: string): Promise<{ briefing: Briefing; request: BriefingRequest; sources: BriefingSource[] } | null> {
  if (!/^[a-f0-9]{16,64}$/.test(token)) return null;
  const db = briefingsDb();
  const { data } = await db.from("briefings").select("*").eq("share_token", token).maybeSingle();
  if (!data) return null;
  const briefing = toBriefing(data);
  const request = await getRequest(briefing.requestId);
  if (!request) return null;
  return { briefing, request, sources: await getSources(request.id) };
}

/** The published public guide for a city slug, newest first. */
export async function getPublishedGuide(slug: string): Promise<{ briefing: Briefing; request: BriefingRequest; sources: BriefingSource[] } | null> {
  const db = briefingsDb();
  const { data: requests } = await db.from("briefing_requests").select("id").eq("slug", slug);
  const ids = (requests ?? []).map((r) => String(r.id));
  if (!ids.length) return null;
  const { data } = await db
    .from("briefings")
    .select("*")
    .in("request_id", ids)
    .not("published_at", "is", null)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!data) return null;
  const briefing = toBriefing(data);
  const request = await getRequest(briefing.requestId);
  if (!request) return null;
  return { briefing, request, sources: await getSources(request.id) };
}
