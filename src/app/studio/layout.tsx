import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Link } from "next-view-transitions";

import StudioLayoutClient from "@/app/studio/StudioLayoutClient";
import { getCurrentAdminState } from "@/lib/studio/admin";
import { getStudioCounts } from "@/lib/studio/getStudioCounts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Culturin Studio", template: "%s | Culturin Studio" },
  description: "Create and manage articles, videos, and experiences across Culturin.",
  robots: { index: false, follow: false },
};

function AccessDenied() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-neutral-50 px-4 py-12 text-neutral-900 dark:bg-black dark:text-white">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-neutral-950/90">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">Culturin Studio</p>
        <h1 className="mt-2 text-2xl font-semibold">Access denied</h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-white/65">
          Your account is signed in, but it does not have admin access to Studio yet.
        </p>
        <p className="mt-6 flex flex-col gap-3 text-sm">
          <Link
            href="/creator"
            className="font-medium text-amber-800 underline-offset-2 hover:underline dark:text-amber-400/90"
          >
            Open Creator workspace (drafts &amp; submissions)
          </Link>
          <Link href="/" className="font-medium text-neutral-600 underline-offset-2 hover:underline dark:text-white/55">
            ← Back to Culturin
          </Link>
        </p>
      </div>
    </main>
  );
}

export default async function StudioLayout({ children }: { children: ReactNode }) {
  const state = await getCurrentAdminState();

  if (!state.userId) {
    redirect("/login?next=/studio");
  }

  if (!state.isAdmin) {
    return <AccessDenied />;
  }

  const counts = await getStudioCounts();

  return (
    <StudioLayoutClient
      email={state.email}
      blogCount={counts.blogs}
      videoCount={counts.videos}
      providerCount={counts.providers}
    >
      {children}
    </StudioLayoutClient>
  );
}
