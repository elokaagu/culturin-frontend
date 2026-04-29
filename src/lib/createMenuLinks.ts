import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Building2,
  Handshake,
  ImageIcon,
  LayoutDashboard,
  ListTree,
  Video,
} from "lucide-react";

export type CreateMenuLinkItem = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

/**
 * Create dropdown destinations: admins use Culturin Studio (`/studio/*`);
 * signed-in non-admins use Creator Studio (`/creator/*`) for drafts/submissions.
 */
export function getCreateMenuLinks(isAdmin: boolean): CreateMenuLinkItem[] {
  const cmsRoot = isAdmin ? "/studio" : "/creator";

  return [
    {
      title: "Article",
      description: "Guides and stories for destinations, trending rails, and search.",
      href: `${cmsRoot}/articles`,
      icon: BookOpen,
    },
    {
      title: "Video",
      description: "Clips and field notes for /videos, stream, and home highlights.",
      href: `${cmsRoot}/videos`,
      icon: Video,
    },
    {
      title: "Experience",
      description: "Provider cards, curated experiences, and travel-guide hosts.",
      href: `${cmsRoot}/providers`,
      icon: Building2,
    },
    {
      title: "Spot list",
      description: "Itineraries and saved places on your profile to plan and share.",
      href: "/profile#spot-lists",
      icon: ListTree,
    },
    {
      title: "Advisor application",
      description: "Partner with Culturin as a travel and culture advisor.",
      href: "/join-us/advisors",
      icon: Handshake,
    },
    {
      title: "Media upload",
      description: "Images for articles, banners, and thumbnails across Culturin.",
      href: "/create/upload",
      icon: ImageIcon,
    },
    isAdmin
      ? {
          title: "Studio overview",
          description: "Counts, shortcuts, and everything you publish in one workspace.",
          href: "/studio",
          icon: LayoutDashboard,
        }
      : {
          title: "Creator home",
          description: "Your submissions workspace — drafts are reviewed before going live.",
          href: "/creator",
          icon: LayoutDashboard,
        },
  ];
}
