import { Link } from "next-view-transitions";

import { ContentPageShell } from "@/app/components/layout/ContentPageShell";
import { ensureAppUser } from "@/lib/api/ensureAppUser";
import { appPageContainerClass } from "@/lib/appLayout";
import { loadGalleryTiles } from "@/lib/communityGallery/loadGalleryTiles";
import { listCommunitySuggestedTravelers } from "@/lib/repositories/followRepository";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import CommunityGalleryClient from "./CommunityGalleryClient";
import CommunitySuggestedTravelers from "./CommunitySuggestedTravelers";

export const metadata = {
  title: "Community | Culturin",
  description: "Explore Culturin imagery from stories, videos, and experiences—and share your own travel photos.",
};

export default async function CommunityPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user: sessionUser },
  } = await supabase.auth.getUser();
  const appUser = sessionUser?.email ? await ensureAppUser(sessionUser) : null;

  const [tiles, suggestedTravelers] = await Promise.all([
    loadGalleryTiles(),
    listCommunitySuggestedTravelers({ viewerUserId: appUser?.id ?? null, limit: 10 }).catch(() => []),
  ]);

  return (
    <ContentPageShell
      mainClassName="min-h-dvh pb-16 antialiased"
      innerClassName={`${appPageContainerClass} max-w-[1720px] gap-8`}
    >
      <nav className="mb-2" aria-label="Breadcrumb">
        <Link href="/" className="text-sm font-medium no-underline hover:opacity-80" style={{ color: "var(--c-accent)" }}>
          Home
        </Link>
        <span className="px-1" style={{ color: "var(--c-muted)" }} aria-hidden>
          /
        </span>
        <span className="text-sm" style={{ color: "var(--c-muted)" }}>Community</span>
      </nav>

      <header className="max-w-3xl">
        <h1
          className="m-0 text-3xl font-medium tracking-tight sm:text-4xl"
          style={{ fontFamily: "var(--font-display), 'Times New Roman', serif", color: "var(--c-ink)" }}
        >
          Community
        </h1>
        <p className="m-0 mt-2 text-base leading-relaxed" style={{ color: "var(--c-muted)" }}>
          A visual feed of stories, videos, and experiences from across Culturin—plus travel moments shared by members.
        </p>
      </header>

      <CommunitySuggestedTravelers travelers={suggestedTravelers} currentUserId={appUser?.id ?? null} />

      <CommunityGalleryClient initialTiles={tiles} />
    </ContentPageShell>
  );
}
