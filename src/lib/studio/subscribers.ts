import { getSupabaseAdminOrNull } from "@/lib/supabaseServiceRole";

export type StudioSubscriber = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  createdAt: string;
  /** How this subscriber joined: "footer" for on-site sign-ups, or a CSV import's batch label (e.g. "NYFW 2025 attendee list"). */
  source: string;
  /** Every column from the original CSV row for this subscriber, keyed by its source header. Empty for footer sign-ups. */
  rawData: Record<string, string>;
};

/** Renders a raw `source` value into something readable in Studio. */
export function formatSubscriberSource(source: string): string {
  if (!source || source === "footer") return "Site footer";
  if (source === "csv_import") return "CSV import";
  return source;
}

function toSubscriber(row: Record<string, unknown>): StudioSubscriber {
  return {
    id: String(row.id ?? ""),
    firstName: String(row.first_name ?? ""),
    lastName: String(row.last_name ?? ""),
    email: String(row.email ?? ""),
    company: String(row.company ?? ""),
    createdAt: String(row.created_at ?? ""),
    source: String(row.source ?? ""),
    rawData:
      row.raw_data && typeof row.raw_data === "object" && !Array.isArray(row.raw_data)
        ? Object.fromEntries(Object.entries(row.raw_data as Record<string, unknown>).map(([k, v]) => [k, String(v ?? "")]))
        : {},
  };
}

export async function listSubscribersForStudio(): Promise<StudioSubscriber[]> {
  const admin = getSupabaseAdminOrNull();
  if (!admin) return [];

  const { data, error } = await admin
    .from("newsletter_subscribers")
    .select("id, first_name, last_name, email, company, created_at, source, raw_data")
    .order("created_at", { ascending: false });

  if (!error && data) return (data as Array<Record<string, unknown>>).map(toSubscriber);

  // `source`/`raw_data` are newer columns (migration 037); if that hasn't been
  // run yet against this database, fall back to the original columns instead
  // of silently showing zero subscribers.
  console.error("listSubscribersForStudio: full select failed, falling back to base columns", error);

  const fallback = await admin
    .from("newsletter_subscribers")
    .select("id, first_name, last_name, email, company, created_at")
    .order("created_at", { ascending: false });

  if (fallback.error || !fallback.data) {
    console.error("listSubscribersForStudio: fallback select also failed", fallback.error);
    return [];
  }

  return (fallback.data as Array<Record<string, unknown>>).map(toSubscriber);
}
