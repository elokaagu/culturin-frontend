import { getSupabaseAdminOrNull } from "@/lib/supabaseServiceRole";

export type StudioEventRsvp = {
  id: string;
  eventSlug: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  title: string;
  linkedinUrl: string;
  createdAt: string;
};

export async function listEventRsvpsForStudio(): Promise<StudioEventRsvp[]> {
  const admin = getSupabaseAdminOrNull();
  if (!admin) return [];

  const { data, error } = await admin
    .from("event_rsvps")
    .select("id, event_slug, first_name, last_name, email, company, title, linkedin_url, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return (data as Array<Record<string, unknown>>).map((row) => ({
    id: String(row.id ?? ""),
    eventSlug: String(row.event_slug ?? ""),
    firstName: String(row.first_name ?? ""),
    lastName: String(row.last_name ?? ""),
    email: String(row.email ?? ""),
    company: String(row.company ?? ""),
    title: String(row.title ?? ""),
    linkedinUrl: String(row.linkedin_url ?? ""),
    createdAt: String(row.created_at ?? ""),
  }));
}
