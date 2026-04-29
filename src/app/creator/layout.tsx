import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import CreatorLayoutClient from "@/app/creator/CreatorLayoutClient";
import { getCurrentAdminState } from "@/lib/studio/admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Culturin Creator", template: "%s | Culturin Creator" },
  description: "Submit articles, videos, and experiences for review before they go live.",
  robots: { index: false, follow: false },
};

export default async function CreatorLayout({ children }: { children: ReactNode }) {
  const state = await getCurrentAdminState();

  if (!state.userId) {
    redirect("/login?next=/creator");
  }

  if (state.isAdmin) {
    redirect("/studio");
  }

  return <CreatorLayoutClient email={state.email}>{children}</CreatorLayoutClient>;
}
