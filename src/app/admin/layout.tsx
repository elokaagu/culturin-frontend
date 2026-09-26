import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Link } from "next-view-transitions";

import StudioLayoutClient from "@/app/admin/StudioLayoutClient";
import { getCurrentAdminState } from "@/lib/studio/admin";
import { getStudioCounts } from "@/lib/studio/getStudioCounts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Culturin Admin", template: "%s | Culturin Admin" },
  description: "Manage Culturin's articles, gallery, sales decks, and audience.",
  robots: { index: false, follow: false },
};

function AccessDenied() {
  return (
    <main
      className="culturin-editorial flex min-h-dvh flex-col items-center justify-center px-4 py-12 font-sans antialiased"
      style={{ background: "var(--c-bg)", color: "var(--c-ink)" }}
    >
      <div className="w-full max-w-md rounded-2xl border border-[color:var(--c-rule)] bg-[color:color-mix(in_srgb,var(--c-bg)_55%,white)] p-6 shadow-sm dark:bg-[#1c1a17]/90">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--c-accent)]">Culturin Admin</p>
        <h1 className="mt-2 font-display text-2xl font-semibold">Access denied</h1>
        <p className="mt-2 text-sm text-[color:var(--c-muted)]">
          Your account is signed in, but it does not have admin access yet.
        </p>
        <p className="mt-6 flex flex-col gap-3 text-sm">
          <Link
            href="/creator"
            className="font-medium text-[color:var(--c-accent)] underline-offset-2 hover:underline"
          >
            Open Creator workspace (drafts &amp; submissions)
          </Link>
          <Link
            href="/"
            className="font-medium text-[color:var(--c-muted)] underline-offset-2 hover:underline"
          >
            ← Back to Culturin
          </Link>
        </p>
      </div>
    </main>
  );
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const state = await getCurrentAdminState();

  if (!state.userId) {
    redirect("/login?next=/admin");
  }

  if (!state.isAdmin) {
    return <AccessDenied />;
  }

  const counts = await getStudioCounts();

  return (
    <StudioLayoutClient
      email={state.email}
      blogCount={counts.blogs}
      galleryCount={counts.galleryImages}
      salesDeckCount={counts.salesDecks}
      subscriberCount={counts.subscribers}
      partnerInquiryCount={counts.partnerInquiries}
      eventRsvpCount={counts.eventRsvps}
      galleryDownloadCount={counts.galleryDownloads}
    >
      {children}
    </StudioLayoutClient>
  );
}
