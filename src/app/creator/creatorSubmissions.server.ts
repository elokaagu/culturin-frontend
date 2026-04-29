import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CreatorSubmissionRow = {
  id: string;
  content_type: string;
  status: string;
  created_at: string;
  payload: Record<string, unknown> | null;
};

export async function fetchMyCreatorSubmissions(
  contentType?: "blog" | "video" | "provider",
): Promise<CreatorSubmissionRow[]> {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("creator_submissions")
    .select("id,content_type,status,created_at,payload")
    .order("created_at", { ascending: false });
  if (contentType) {
    query = query.eq("content_type", contentType);
  }
  const { data, error } = await query;
  if (error || !data) return [];
  return data as CreatorSubmissionRow[];
}
