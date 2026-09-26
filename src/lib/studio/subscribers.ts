import { getSupabaseAdminFreshOrNull } from "@/lib/supabaseServiceRole";

export type StudioSubscriber = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  /** When they joined: Mailchimp's original opt-in date for imports, otherwise when the row was added. */
  joinedAt: string;
  createdAt: string;
  /** How this subscriber joined: "footer" for on-site sign-ups, or a CSV import's batch label (e.g. "NYFW 2025 attendee list"). */
  source: string;
  /** The useful parts of an imported row; ids, IPs and timezone offsets are left out. */
  profile: {
    role: string;
    channel: string;
    location: string;
    events: string[];
    phone: string;
    social: string;
    notes: string;
  };
  /** Fields that were filled in by inference (e.g. a name read from the email address). */
  inferred: string[];
};

/** Renders a raw `source` value into something readable in Studio. */
export function formatSubscriberSource(source: string): string {
  if (!source || source === "footer") return "Site footer";
  if (source === "csv_import") return "CSV import";
  if (source === "mailchimp") return "Mailchimp";
  if (source.startsWith("event-rsvp:")) return `Event RSVP (${source.slice("event-rsvp:".length)})`;
  return source;
}

const pick = (raw: Record<string, unknown>, ...keys: string[]): string => {
  for (const k of keys) {
    const v = String(raw[k] ?? "").trim();
    if (v && v !== "-") return v;
  }
  return "";
};

function parseTags(v: string): string[] {
  const quoted = Array.from(v.matchAll(/"([^"]+)"/g), (m) => m[1].trim());
  return (quoted.length > 0 ? quoted : v.split(","))
    .map((t) => t.trim())
    .filter((t) => t && t.toLowerCase() !== "event attendee" && !/^campaign pasted segment/i.test(t));
}

let regionNames: Intl.DisplayNames | null = null;
function country(code: string): string {
  const cc = code.toUpperCase() === "UK" ? "GB" : code.toUpperCase();
  if (!/^[A-Z]{2}$/.test(cc)) return code;
  try {
    regionNames ??= new Intl.DisplayNames(["en"], { type: "region" });
    return regionNames.of(cc) ?? cc;
  } catch {
    return cc;
  }
}

function toSubscriber(row: Record<string, unknown>): StudioSubscriber {
  const raw =
    row.raw_data && typeof row.raw_data === "object" && !Array.isArray(row.raw_data) ? (row.raw_data as Record<string, unknown>) : {};
  const createdAt = String(row.created_at ?? "");
  const optin = pick(raw, "OPTIN_TIME", "CONFIRM_TIME");
  const joinedAt = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(optin) ? `${optin.replace(" ", "T")}Z` : createdAt;
  const cc = pick(raw, "CC", "Country", "COUNTRY");
  const region = pick(raw, "REGION");
  const inferred = Array.isArray(raw._inferred) ? (raw._inferred as unknown[]).map(String) : [];
  return {
    id: String(row.id ?? ""),
    firstName: String(row.first_name ?? ""),
    lastName: String(row.last_name ?? ""),
    email: String(row.email ?? ""),
    company: String(row.company ?? ""),
    joinedAt,
    createdAt,
    source: String(row.source ?? ""),
    profile: {
      role: pick(raw, "Role", "Title", "Job Title", "JOBTITLE"),
      channel: pick(raw, "Source"),
      location: [region.length > 3 ? region : region.toUpperCase(), cc ? country(cc) : ""].filter(Boolean).join(", "),
      events: parseTags(pick(raw, "TAGS", "Tags")),
      phone: pick(raw, "Phone Number", "Phone", "PHONE"),
      social: pick(raw, "Social Media", "Instagram", "LinkedIn"),
      notes: pick(raw, "NOTES", "Notes"),
    },
    inferred,
  };
}

const PAGE = 1000;

/** Supabase caps a single select at 1,000 rows, so read the table page by page. */
async function selectAll(columns: string): Promise<{ rows: Array<Record<string, unknown>>; error: unknown }> {
  const admin = getSupabaseAdminFreshOrNull();
  if (!admin) return { rows: [], error: null };
  const rows: Array<Record<string, unknown>> = [];
  for (let from = 0; from < 100_000; from += PAGE) {
    const { data, error } = await admin
      .from("newsletter_subscribers")
      .select(columns)
      .order("created_at", { ascending: false })
      .order("id", { ascending: true })
      .range(from, from + PAGE - 1);
    if (error || !data) return { rows, error: error ?? new Error("No data") };
    rows.push(...(data as unknown as Array<Record<string, unknown>>));
    if (data.length < PAGE) break;
  }
  return { rows, error: null };
}

export async function listSubscribersForStudio(): Promise<StudioSubscriber[]> {
  if (!getSupabaseAdminFreshOrNull()) return [];

  const full = await selectAll("id, first_name, last_name, email, company, created_at, source, raw_data");
  if (!full.error) return full.rows.map(toSubscriber).sort((a, b) => b.joinedAt.localeCompare(a.joinedAt));

  // `source`/`raw_data` are newer columns (migration 037); if that hasn't been
  // run yet against this database, fall back to the original columns instead
  // of silently showing zero subscribers.
  console.error("listSubscribersForStudio: full select failed, falling back to base columns", full.error);
  const fallback = await selectAll("id, first_name, last_name, email, company, created_at");
  if (fallback.error) {
    console.error("listSubscribersForStudio: fallback select also failed", fallback.error);
    return [];
  }
  return fallback.rows.map(toSubscriber);
}
