import { getSupabaseAdminOrNull } from "@/lib/supabaseServiceRole";

export type CardApplicationStatus = "pending" | "invited" | "active" | "declined";
export type CardApplicationSource = "event_rsvp" | "advisor_application" | "manual";

export type StudioCardApplication = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  title: string;
  linkedinUrl: string;
  source: CardApplicationSource;
  sourceEventSlug: string;
  status: CardApplicationStatus;
  inviteToken: string;
  inviteTokenExpiresAt: string;
  invitedAt: string;
  activatedAt: string;
  createdAt: string;
};

export async function listCardApplicationsForStudio(): Promise<StudioCardApplication[]> {
  const admin = getSupabaseAdminOrNull();
  if (!admin) return [];

  const { data, error } = await admin
    .from("card_applications")
    .select(
      "id, email, first_name, last_name, company, title, linkedin_url, source, source_event_slug, status, invite_token, invite_token_expires_at, invited_at, activated_at, created_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[studio] failed to list card applications:", error.message);
    return [];
  }
  if (!data) return [];

  return (data as Array<Record<string, unknown>>).map((row) => ({
    id: String(row.id ?? ""),
    email: String(row.email ?? ""),
    firstName: String(row.first_name ?? ""),
    lastName: String(row.last_name ?? ""),
    company: String(row.company ?? ""),
    title: String(row.title ?? ""),
    linkedinUrl: String(row.linkedin_url ?? ""),
    source: (row.source as CardApplicationSource) ?? "manual",
    sourceEventSlug: String(row.source_event_slug ?? ""),
    status: (row.status as CardApplicationStatus) ?? "pending",
    inviteToken: String(row.invite_token ?? ""),
    inviteTokenExpiresAt: String(row.invite_token_expires_at ?? ""),
    invitedAt: String(row.invited_at ?? ""),
    activatedAt: String(row.activated_at ?? ""),
    createdAt: String(row.created_at ?? ""),
  }));
}
