import { getSupabaseAdminOrNull } from "@/lib/supabaseServiceRole";

export type StudioContentCounts = {
  blogs: number;
  videos: number;
  providers: number;
};

/**
 * Counts of CMS records for the Studio shell (sidebar + overview).
 * Returns zeros when the service role client is unavailable.
 */
export async function getStudioCounts(): Promise<StudioContentCounts> {
  const db = getSupabaseAdminOrNull();
  if (!db) {
    return { blogs: 0, videos: 0, providers: 0 };
  }
  const [blogs, videos, providers] = await Promise.all([
    db.from("cms_blogs").select("id", { count: "exact", head: true }),
    db.from("cms_videos").select("id", { count: "exact", head: true }),
    db.from("cms_providers").select("id", { count: "exact", head: true }),
  ]);

  return {
    blogs: blogs.count ?? 0,
    videos: videos.count ?? 0,
    providers: providers.count ?? 0,
  };
}
