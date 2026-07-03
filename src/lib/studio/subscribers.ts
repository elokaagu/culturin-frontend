import { getSupabaseAdminOrNull } from "@/lib/supabaseServiceRole";

export type StudioSubscriber = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  createdAt: string;
};

export async function listSubscribersForStudio(): Promise<StudioSubscriber[]> {
  const admin = getSupabaseAdminOrNull();
  if (!admin) return [];

  const { data, error } = await admin
    .from("newsletter_subscribers")
    .select("id, first_name, last_name, email, company, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return (data as Array<Record<string, unknown>>).map((row) => ({
    id: String(row.id ?? ""),
    firstName: String(row.first_name ?? ""),
    lastName: String(row.last_name ?? ""),
    email: String(row.email ?? ""),
    company: String(row.company ?? ""),
    createdAt: String(row.created_at ?? ""),
  }));
}
