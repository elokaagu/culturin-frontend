import { formatSubscriberSource } from "@/lib/studio/subscribers";
import { getSupabaseAdminFreshOrNull } from "@/lib/supabaseServiceRole";

export type RangeKey = "30" | "90" | "365" | "all";
export const RANGES: { key: RangeKey; label: string; days: number | null }[] = [
  { key: "30", label: "30 days", days: 30 },
  { key: "90", label: "90 days", days: 90 },
  { key: "365", label: "12 months", days: 365 },
  { key: "all", label: "All time", days: null },
];

export type Bucket = { label: string; count: number };

export type Kpi = { label: string; total: number; inRange: number; previous: number | null };

export type AnalyticsData = {
  connected: boolean;
  rangeLabel: string;
  kpis: Kpi[];
  /** New contacts per week (subscribers + RSVPs + inquiries), oldest first. */
  weekly: { weekStart: string; subscribers: number; rsvps: number; inquiries: number }[];
  sources: Bucket[];
  seniority: Bucket[];
  emailKind: Bucket[];
  topCompanies: Bucket[];
  topDomains: Bucket[];
  rsvpByEvent: Bucket[];
  inquiryInterest: Bucket[];
  topPhotos: { src: string; count: number }[];
  deckViews: { title: string; views: number; avgSeconds: number; completed: number }[];
  uniquePeople: number;
  repeatPeople: number;
};

const PERSONAL_DOMAINS = new Set([
  "gmail.com", "googlemail.com", "icloud.com", "me.com", "mac.com", "yahoo.com", "yahoo.co.uk", "ymail.com",
  "outlook.com", "hotmail.com", "hotmail.co.uk", "live.com", "msn.com", "aol.com", "proton.me", "protonmail.com",
  "gmx.com", "mail.com", "btinternet.com", "sky.com", "comcast.net", "verizon.net", "att.net",
]);

/** Group job titles into broad seniority bands. Titles are free text, so this is a best-effort read. */
export function seniorityOf(title: string): string {
  const t = title.trim().toLowerCase();
  if (!t) return "Not given";
  if (/\b(ceo|cfo|coo|cmo|cto|cio|chief|founder|co-?founder|owner|president|chair(man|woman)?|managing (partner|director)|partner|principal)\b/.test(t)) {
    return "Founder / C-suite / Partner";
  }
  if (/\b(vp|vice president|svp|evp|director|head of|head)\b/.test(t)) return "VP / Director / Head";
  if (/\b(manager|lead|senior|sr\.?)\b/.test(t)) return "Manager / Senior";
  return "Other roles";
}

const bucketsFrom = (map: Map<string, number>, limit: number): Bucket[] =>
  Array.from(map.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, limit);

const inc = (map: Map<string, number>, key: string, by = 1) => map.set(key, (map.get(key) ?? 0) + by);

function weekStartIso(d: Date): string {
  const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dow = (x.getUTCDay() + 6) % 7; // Monday = 0
  x.setUTCDate(x.getUTCDate() - dow);
  return x.toISOString().slice(0, 10);
}

const emailDomain = (email: string) => email.split("@")[1]?.toLowerCase() ?? "";
const companyKey = (c: string) => c.trim().replace(/\s+/g, " ");

type Row = Record<string, unknown>;

async function fetchAll(table: string, columns: string): Promise<Row[]> {
  const db = getSupabaseAdminFreshOrNull();
  if (!db) return [];
  const pageSize = 1000;
  const out: Row[] = [];
  for (let from = 0; from < 20000; from += pageSize) {
    const { data, error } = await db.from(table).select(columns).range(from, from + pageSize - 1);
    if (error || !data) break;
    out.push(...(data as unknown as Row[]));
    if (data.length < pageSize) break;
  }
  return out;
}

export async function getAnalytics(range: RangeKey, eventNames: Record<string, string>): Promise<AnalyticsData> {
  const rangeDef = RANGES.find((r) => r.key === range) ?? RANGES[1];
  const empty: AnalyticsData = {
    connected: false, rangeLabel: rangeDef.label, kpis: [], weekly: [], sources: [], seniority: [], emailKind: [],
    topCompanies: [], topDomains: [], rsvpByEvent: [], inquiryInterest: [], topPhotos: [], deckViews: [],
    uniquePeople: 0, repeatPeople: 0,
  };
  if (!getSupabaseAdminFreshOrNull()) return empty;

  const [subs, rsvps, inquiries, downloads, sessions, decks] = await Promise.all([
    fetchAll("newsletter_subscribers", "email, company, source, created_at"),
    fetchAll("event_rsvps", "email, company, title, event_slug, created_at"),
    fetchAll("partner_inquiries", "email, company, interest, created_at"),
    fetchAll("gallery_downloads", "email, image_src, created_at"),
    fetchAll("deck_view_sessions", "deck_id, started_at, duration_seconds, completed"),
    fetchAll("sales_decks", "id, title"),
  ]);

  const now = Date.now();
  const days = rangeDef.days;
  const startMs = days ? now - days * 86_400_000 : 0;
  const prevStartMs = days ? startMs - days * 86_400_000 : 0;
  const ts = (r: Row, k: string) => {
    const v = r[k];
    const n = typeof v === "string" ? Date.parse(v) : NaN;
    return Number.isNaN(n) ? 0 : n;
  };
  const inRange = (r: Row, k: string) => ts(r, k) >= startMs;
  const inPrev = (r: Row, k: string) => days !== null && ts(r, k) >= prevStartMs && ts(r, k) < startMs;

  const kpi = (label: string, rows: Row[], k: string): Kpi => ({
    label,
    total: rows.length,
    inRange: rows.filter((r) => inRange(r, k)).length,
    previous: days === null ? null : rows.filter((r) => inPrev(r, k)).length,
  });

  const kpis = [
    kpi("Subscribers", subs, "created_at"),
    kpi("Event RSVPs", rsvps, "created_at"),
    kpi("Partner inquiries", inquiries, "created_at"),
    kpi("Gallery downloads", downloads, "created_at"),
    kpi("Deck views", sessions, "started_at"),
  ];

  // Weekly growth: last 12 weeks (or the range, whichever is shorter is fine; keep 12 for a stable chart).
  const weekKeys: string[] = [];
  const cursor = new Date(weekStartIso(new Date(now)));
  for (let i = 11; i >= 0; i--) {
    const d = new Date(cursor);
    d.setUTCDate(d.getUTCDate() - i * 7);
    weekKeys.push(d.toISOString().slice(0, 10));
  }
  const weekly = weekKeys.map((weekStart) => ({ weekStart, subscribers: 0, rsvps: 0, inquiries: 0 }));
  const weekIndex = new Map(weekKeys.map((k, i) => [k, i]));
  const bump = (rows: Row[], field: "subscribers" | "rsvps" | "inquiries") => {
    for (const r of rows) {
      const t = ts(r, "created_at");
      if (!t) continue;
      const i = weekIndex.get(weekStartIso(new Date(t)));
      if (i !== undefined) weekly[i][field] += 1;
    }
  };
  bump(subs, "subscribers");
  bump(rsvps, "rsvps");
  bump(inquiries, "inquiries");

  // Everyone who has given us an email, once each, with the strongest info we have about them.
  const people = new Map<string, { email: string; company: string; title: string; sources: Set<string>; inWindow: boolean }>();
  const addPerson = (r: Row, source: string) => {
    const email = String(r.email ?? "").trim().toLowerCase();
    if (!email) return;
    const p = people.get(email) ?? { email, company: "", title: "", sources: new Set<string>(), inWindow: false };
    const company = String(r.company ?? "").trim();
    const title = String(r.title ?? "").trim();
    if (company && !p.company) p.company = company;
    if (title && !p.title) p.title = title;
    p.sources.add(source);
    if (inRange(r, "created_at")) p.inWindow = true;
    people.set(email, p);
  };
  subs.forEach((r) => addPerson(r, "subscriber"));
  rsvps.forEach((r) => addPerson(r, "rsvp"));
  inquiries.forEach((r) => addPerson(r, "inquiry"));

  const windowPeople = Array.from(people.values()).filter((p) => p.inWindow);

  const seniority = new Map<string, number>();
  const emailKind = new Map<string, number>();
  const companies = new Map<string, number>();
  const domains = new Map<string, number>();
  for (const p of windowPeople) {
    // Seniority only from people who told us a title (RSVPs); "Not given" is reported separately.
    inc(seniority, seniorityOf(p.title));
    const domain = emailDomain(p.email);
    const personal = PERSONAL_DOMAINS.has(domain);
    inc(emailKind, personal ? "Personal email" : "Work email");
    if (!personal && domain) inc(domains, domain);
    if (p.company) inc(companies, companyKey(p.company));
  }

  const sources = new Map<string, number>();
  for (const r of subs.filter((r) => inRange(r, "created_at"))) inc(sources, formatSubscriberSource(String(r.source ?? "")));

  const rsvpByEvent = new Map<string, number>();
  for (const r of rsvps.filter((r) => inRange(r, "created_at"))) {
    const slug = String(r.event_slug ?? "");
    inc(rsvpByEvent, eventNames[slug] ?? slug);
  }

  const interests = new Map<string, number>();
  for (const r of inquiries.filter((r) => inRange(r, "created_at"))) inc(interests, String(r.interest ?? "other") || "other");

  const photos = new Map<string, number>();
  for (const r of downloads.filter((r) => inRange(r, "created_at"))) {
    const src = String(r.image_src ?? "");
    if (src) inc(photos, src);
  }

  const deckTitle = new Map(decks.map((d) => [String(d.id), String(d.title ?? "Untitled")]));
  const deckAgg = new Map<string, { views: number; seconds: number; completed: number }>();
  for (const s of sessions.filter((s) => inRange(s, "started_at"))) {
    const id = String(s.deck_id ?? "");
    const a = deckAgg.get(id) ?? { views: 0, seconds: 0, completed: 0 };
    a.views += 1;
    a.seconds += Number(s.duration_seconds ?? 0) || 0;
    if (s.completed === true) a.completed += 1;
    deckAgg.set(id, a);
  }

  return {
    connected: true,
    rangeLabel: rangeDef.label,
    kpis,
    weekly,
    sources: bucketsFrom(sources, 8),
    seniority: bucketsFrom(seniority, 6),
    emailKind: bucketsFrom(emailKind, 3),
    topCompanies: bucketsFrom(companies, 10),
    topDomains: bucketsFrom(domains, 8),
    rsvpByEvent: bucketsFrom(rsvpByEvent, 8),
    inquiryInterest: bucketsFrom(interests, 8),
    topPhotos: Array.from(photos.entries()).map(([src, count]) => ({ src, count })).sort((a, b) => b.count - a.count).slice(0, 6),
    deckViews: Array.from(deckAgg.entries())
      .map(([id, a]) => ({ title: deckTitle.get(id) ?? "Deleted deck", views: a.views, avgSeconds: a.views ? Math.round(a.seconds / a.views) : 0, completed: a.completed }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 8),
    uniquePeople: people.size,
    repeatPeople: Array.from(people.values()).filter((p) => p.sources.size > 1).length,
  };
}
