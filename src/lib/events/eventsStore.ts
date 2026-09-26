import { getCmsDbFreshOrNull, getCmsDbOrNull } from "@/lib/cms/server";
import { events as builtinEvents, type CulturinEvent, type EventSection } from "@/lib/eventsData";
import { formatEventDateRange, isYmd } from "@/lib/events/dateRange";

type DbRow = { slug: string; data: unknown; starts_on: string | null };

/** Start dates for the built-in events, used to order them once imported. */
export const BUILTIN_START_DATES: Record<string, string> = {
  "cannes-lions-2026": "2026-06-22",
  "us-open-2026": "2026-08-25",
  "unga-2026": "2026-09-16",
};

/** End dates for the built-in events, used when they're imported. */
export const BUILTIN_END_DATES: Record<string, string> = {
  "cannes-lions-2026": "2026-06-26",
  "us-open-2026": "2026-09-07",
  "unga-2026": "2026-09-26",
};

const PHOTO_POSITIONS = [
  "top-16 left-[5%] w-56 rotate-[-1.5deg]",
  "top-44 right-[7%] w-64 rotate-[2deg]",
  "top-20 left-[7%] w-72 rotate-[1deg]",
  "bottom-16 right-[5%] w-56 rotate-[-1.5deg]",
  "top-10 right-[9%] w-52 rotate-[2deg]",
  "bottom-12 left-[5%] w-64 rotate-[-1deg]",
];

const LIMITS = { short: 300, long: 4000, sections: 8, photos: 6, stats: 8 };

export function slugify(input: unknown): string {
  return String(input ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const str = (v: unknown, max: number): string => (typeof v === "string" ? v.trim().slice(0, max) : "");

/**
 * Turn untrusted admin input into a well-formed event. Returns an error message when the
 * event can't be saved (missing name/slug), otherwise the cleaned event plus its start date.
 */
export function normalizeEvent(
  input: unknown,
  startsOn: unknown,
): { ok: true; event: CulturinEvent; startsOn: string | null } | { ok: false; message: string } {
  const o = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;

  const name = str(o.name, LIMITS.short);
  const slug = slugify(o.slug || name);
  if (!name) return { ok: false, message: "Give the event a name." };
  if (!slug) return { ok: false, message: "The web address (slug) can't be empty." };

  const rawSections = Array.isArray(o.sections) ? o.sections.slice(0, LIMITS.sections) : [];
  const sections: EventSection[] = rawSections
    .map((raw, si) => {
      const s = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
      const rawPhotos = Array.isArray(s.photos) ? s.photos.slice(0, LIMITS.photos) : [];
      const photos = rawPhotos
        .map((p, pi) => {
          const ph = (p && typeof p === "object" ? p : {}) as Record<string, unknown>;
          const src = str(ph.src, 1000);
          if (!src) return null;
          return {
            src,
            alt: str(ph.alt, LIMITS.short),
            position: str(ph.position, 200) || PHOTO_POSITIONS[(si * 2 + pi) % PHOTO_POSITIONS.length],
          };
        })
        .filter((p): p is NonNullable<typeof p> => p !== null);
      const label = str(s.label, LIMITS.short);
      const headline = str(s.headline, LIMITS.long);
      const body = str(s.body, LIMITS.long);
      if (!label && !headline && !body && photos.length === 0) return null;
      return { id: slugify(s.id || label) || `section-${si + 1}`, label, headline, body, photos };
    })
    .filter((s): s is EventSection => s !== null);

  const stats = (Array.isArray(o.stats) ? o.stats.slice(0, LIMITS.stats) : [])
    .map((raw) => {
      const st = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
      return { value: str(st.value, 40), label: str(st.label, LIMITS.short) };
    })
    .filter((st) => st.value || st.label);

  const start = isYmd(startsOn) ? startsOn : null;
  const rawEnd = isYmd(o.endsOn) ? o.endsOn : null;
  if (start && rawEnd && rawEnd < start) return { ok: false, message: "The end date can't be before the start date." };
  const endsOn = start && rawEnd && rawEnd !== start ? rawEnd : undefined;
  // With a start date, the displayed date is always generated from it, so it can't drift out of sync.
  const generatedDate = start ? formatEventDateRange(start, endsOn) : "";

  const event: CulturinEvent = {
    slug,
    name,
    navLabel: str(o.navLabel, LIMITS.short) || name.toUpperCase(),
    tagline: str(o.tagline, LIMITS.long),
    subtagline: str(o.subtagline, LIMITS.long),
    shortDescription: str(o.shortDescription, LIMITS.long),
    date: generatedDate || str(o.date, LIMITS.short),
    endsOn,
    location: str(o.location, LIMITS.short),
    category: str(o.category, LIMITS.short),
    heroImage: str(o.heroImage, 1000),
    heroImageAlt: str(o.heroImageAlt, LIMITS.short),
    sections,
    stats,
    signalHeadline: str(o.signalHeadline, LIMITS.long),
    signalBody: str(o.signalBody, LIMITS.long),
    isPast: o.isPast === true,
    galleryEventKey: str(o.galleryEventKey, 120) || undefined,
    rsvpHeadline: str(o.rsvpHeadline, LIMITS.long),
    rsvpSubtext: str(o.rsvpSubtext, LIMITS.long),
  };
  return { ok: true, event, startsOn: start };
}

function rowsToEvents(rows: DbRow[]): CulturinEvent[] {
  const out: CulturinEvent[] = [];
  for (const row of rows) {
    const parsed = normalizeEvent(row.data, row.starts_on);
    if (parsed.ok) out.push({ ...parsed.event, slug: row.slug });
  }
  return out;
}

async function readDbEvents(db: NonNullable<ReturnType<typeof getCmsDbOrNull>>): Promise<CulturinEvent[] | null> {
  const { data, error } = await db
    .from("cms_events")
    .select("slug, data, starts_on")
    .order("starts_on", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true });
  // Table missing (migration not run yet) or unreadable: caller falls back to built-ins.
  if (error || !data) return null;
  return rowsToEvents(data as DbRow[]);
}

/**
 * The events the public site shows. Once any event exists in the admin, that list is the
 * source of truth; before that (or if the table isn't set up) the built-in events are used.
 */
export async function getEvents(): Promise<CulturinEvent[]> {
  const db = getCmsDbOrNull();
  if (!db) return builtinEvents;
  const fromDb = await readDbEvents(db);
  return fromDb && fromDb.length > 0 ? fromDb : builtinEvents;
}

export async function getEventBySlug(slug: string): Promise<CulturinEvent | undefined> {
  return (await getEvents()).find((e) => e.slug === slug);
}

export type AdminEvents = {
  events: CulturinEvent[];
  /** "db": managed in the admin. "builtin": still the code defaults (not imported yet). */
  source: "db" | "builtin";
  /** False when the cms_events table doesn't exist yet (migration 043 not run). */
  tableReady: boolean;
  startsOn: Record<string, string | null>;
};

/** Live (never cached) event list for the admin. */
export async function getAdminEvents(): Promise<AdminEvents> {
  const db = getCmsDbFreshOrNull();
  const builtinStarts: Record<string, string | null> = { ...BUILTIN_START_DATES };
  if (!db) return { events: builtinEvents, source: "builtin", tableReady: false, startsOn: builtinStarts };

  const { data, error } = await db
    .from("cms_events")
    .select("slug, data, starts_on")
    .order("starts_on", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true });

  if (error || !data) return { events: builtinEvents, source: "builtin", tableReady: false, startsOn: builtinStarts };
  if (data.length === 0) return { events: builtinEvents, source: "builtin", tableReady: true, startsOn: builtinStarts };

  const rows = data as DbRow[];
  return {
    events: rowsToEvents(rows),
    source: "db",
    tableReady: true,
    startsOn: Object.fromEntries(rows.map((r) => [r.slug, r.starts_on])),
  };
}
