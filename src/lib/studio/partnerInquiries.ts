import { getSupabaseAdminOrNull } from "@/lib/supabaseServiceRole";

export type StudioPartnerInquiry = {
  id: string;
  name: string;
  email: string;
  company: string;
  interest: string;
  message: string;
  createdAt: string;
};

export async function listPartnerInquiriesForStudio(): Promise<StudioPartnerInquiry[]> {
  const admin = getSupabaseAdminOrNull();
  if (!admin) return [];

  const { data, error } = await admin
    .from("partner_inquiries")
    .select("id, name, email, company, interest, message, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return (data as Array<Record<string, unknown>>).map((row) => ({
    id: String(row.id ?? ""),
    name: String(row.name ?? ""),
    email: String(row.email ?? ""),
    company: String(row.company ?? ""),
    interest: String(row.interest ?? ""),
    message: String(row.message ?? ""),
    createdAt: String(row.created_at ?? ""),
  }));
}
