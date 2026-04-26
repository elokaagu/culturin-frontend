import type { Metadata } from "next";
import { redirect } from "next/navigation";

import Header from "@/app/components/Header";
import SiteFooter from "@/app/components/SiteFooter";
import StudioLayoutClient from "@/app/studio/StudioLayoutClient";
import { getCurrentAdminState } from "@/lib/studio/admin";
import { getStudioCounts } from "@/lib/studio/getStudioCounts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Culturin Studio", template: "%s | Culturin Studio" },
  description: "Create and manage articles, videos, and provider experiences across Culturin.",
  robots: { index: false, follow: false },
};

function AccessDenied() {
  return (
    <main className="min-h-dvh bg-neutral-50 px-4 pb-16 pt-[var(--header-offset)] text-neutral-900 dark:bg-black dark:text-white sm:px-6">
      <div className="mx-auto mt-10 w-full max-w-2xl rounded-2xl border border-neutral-200 bg-white p-6 dark:border-white/10 dark:bg-neutral-950/90">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">Culturin Studio</p>
        <h1 className="mt-2 text-2xl font-semibold">Access denied</h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-white/65">
          Your account is signed in, but it does not have admin access to Studio yet.
        </p>
      </div>
    </main>
  );
}

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const state = await getCurrentAdminState();

  if (!state.userId) {
    redirect("/login?next=/studio");
  }

  if (!state.isAdmin) {
    return (
      <>
        <Header />
        <AccessDenied />
        <SiteFooter />
      </>
    );
  }

  const counts = await getStudioCounts();

  return (
    <>
      <Header />
      <div className="w-full min-h-0 min-w-0 flex-1 bg-neutral-50 pt-[var(--header-offset)] text-neutral-900 dark:bg-black dark:text-white">
        <StudioLayoutClient
          email={state.email}
          blogCount={counts.blogs}
          videoCount={counts.videos}
          providerCount={counts.providers}
        >
          {children}
        </StudioLayoutClient>
      </div>
      <SiteFooter />
    </>
  );
}
