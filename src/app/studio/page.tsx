import type { Metadata } from "next";
import { redirect } from "next/navigation";

import Header from "@/app/components/Header";
import SiteFooter from "@/app/components/SiteFooter";
import StudioManager from "@/app/studio/StudioManager";
import { getCurrentAdminState } from "@/lib/studio/admin";
import { getSupabaseAdminOrNull } from "@/lib/supabaseServiceRole";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Culturin Studio",
  description: "Create and update travel guides, videos, and provider listings (admin only).",
  robots: { index: false, follow: false },
};

async function getStudioCounts() {
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

export default async function StudioPage() {
  const state = await getCurrentAdminState();

  if (!state.userId) {
    redirect("/login?next=/studio");
  }

  if (!state.isAdmin) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-neutral-50 px-4 pb-16 pt-[var(--header-offset)] text-neutral-900 dark:bg-black dark:text-white sm:px-6">
          <div className="mx-auto mt-10 w-full max-w-2xl rounded-2xl border border-neutral-200 bg-white p-6 dark:border-white/10 dark:bg-neutral-950/90">
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">Culturin Studio</p>
            <h1 className="mt-2 text-2xl font-semibold">Access denied</h1>
            <p className="mt-2 text-sm text-neutral-600 dark:text-white/65">
              Your account is signed in, but does not have admin access yet.
            </p>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  const counts = await getStudioCounts();

  return (
    <>
      <Header />
      <StudioManager
        blogCount={counts.blogs}
        videoCount={counts.videos}
        providerCount={counts.providers}
        email={state.email}
      />
      <SiteFooter />
    </>
  );
}
