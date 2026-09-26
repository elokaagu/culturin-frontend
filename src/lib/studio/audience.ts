import { listEventRsvpsForStudio } from "@/lib/studio/eventRsvps";
import { listGalleryDownloadsForStudio } from "@/lib/studio/galleryDownloads";
import { listPartnerInquiriesForStudio } from "@/lib/studio/partnerInquiries";
import { listSubscribersForStudio } from "@/lib/studio/subscribers";

export type AudienceKind = "subscribers" | "partner-inquiries" | "event-rsvps" | "gallery-downloads";

type AudienceConfig = {
  table: string;
  adminPath: string;
  list: () => Promise<Array<{ id: string }>>;
};

export const AUDIENCE_KINDS: Record<AudienceKind, AudienceConfig> = {
  subscribers: {
    table: "newsletter_subscribers",
    adminPath: "/admin/subscribers",
    list: listSubscribersForStudio,
  },
  "partner-inquiries": {
    table: "partner_inquiries",
    adminPath: "/admin/partner-inquiries",
    list: listPartnerInquiriesForStudio,
  },
  "event-rsvps": {
    table: "event_rsvps",
    adminPath: "/admin/event-rsvps",
    list: listEventRsvpsForStudio,
  },
  "gallery-downloads": {
    table: "gallery_downloads",
    adminPath: "/admin/gallery-downloads",
    list: listGalleryDownloadsForStudio,
  },
};

export function isAudienceKind(value: unknown): value is AudienceKind {
  return typeof value === "string" && value in AUDIENCE_KINDS;
}
