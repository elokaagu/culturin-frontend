import { getSupabaseAdminOrNull } from "@/lib/supabaseServiceRole";

export type StudioContentCounts = {
  blogs: number;
  videos: number;
  providers: number;
  curators: number;
  galleryImages: number;
  subscribers: number;
  partnerInquiries: number;
  eventRsvps: number;
  galleryDownloads: number;
  cardApplications: number;
};

export async function getStudioCounts(): Promise<StudioContentCounts> {
  const db = getSupabaseAdminOrNull();
  if (!db) {
    return {
      blogs: 0,
      videos: 0,
      providers: 0,
      curators: 0,
      galleryImages: 0,
      subscribers: 0,
      partnerInquiries: 0,
      eventRsvps: 0,
      galleryDownloads: 0,
      cardApplications: 0,
    };
  }
  const [
    blogs,
    videos,
    providers,
    curators,
    galleryImages,
    subscribers,
    partnerInquiries,
    eventRsvps,
    galleryDownloads,
    cardApplications,
  ] = await Promise.all([
    db.from("cms_blogs").select("id", { count: "exact", head: true }),
    db.from("cms_videos").select("id", { count: "exact", head: true }),
    db.from("cms_providers").select("id", { count: "exact", head: true }),
    db.from("cms_curators").select("id", { count: "exact", head: true }),
    db.from("gallery_images").select("id", { count: "exact", head: true }),
    db.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
    db.from("partner_inquiries").select("id", { count: "exact", head: true }),
    db.from("event_rsvps").select("id", { count: "exact", head: true }),
    db.from("gallery_downloads").select("id", { count: "exact", head: true }),
    // Badge reflects applications still awaiting a decision, not the full history.
    db.from("card_applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  return {
    blogs: blogs.count ?? 0,
    videos: videos.count ?? 0,
    providers: providers.count ?? 0,
    curators: curators.count ?? 0,
    galleryImages: galleryImages.count ?? 0,
    subscribers: subscribers.count ?? 0,
    partnerInquiries: partnerInquiries.count ?? 0,
    eventRsvps: eventRsvps.count ?? 0,
    galleryDownloads: galleryDownloads.count ?? 0,
    cardApplications: cardApplications.count ?? 0,
  };
}
