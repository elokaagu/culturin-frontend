import { getSupabaseAdminOrNull } from "@/lib/supabaseServiceRole";

export type StudioContentCounts = {
  blogs: number;
  videos: number;
  providers: number;
  curators: number;
  galleryImages: number;
  subscribers: number;
  partnerInquiries: number;
};

export async function getStudioCounts(): Promise<StudioContentCounts> {
  const db = getSupabaseAdminOrNull();
  if (!db) {
    return { blogs: 0, videos: 0, providers: 0, curators: 0, galleryImages: 0, subscribers: 0, partnerInquiries: 0 };
  }
  const [blogs, videos, providers, curators, galleryImages, subscribers, partnerInquiries] = await Promise.all([
    db.from("cms_blogs").select("id", { count: "exact", head: true }),
    db.from("cms_videos").select("id", { count: "exact", head: true }),
    db.from("cms_providers").select("id", { count: "exact", head: true }),
    db.from("cms_curators").select("id", { count: "exact", head: true }),
    db.from("gallery_images").select("id", { count: "exact", head: true }),
    db.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
    db.from("partner_inquiries").select("id", { count: "exact", head: true }),
  ]);

  return {
    blogs: blogs.count ?? 0,
    videos: videos.count ?? 0,
    providers: providers.count ?? 0,
    curators: curators.count ?? 0,
    galleryImages: galleryImages.count ?? 0,
    subscribers: subscribers.count ?? 0,
    partnerInquiries: partnerInquiries.count ?? 0,
  };
}
