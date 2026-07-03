import type { Metadata } from "next";

import { listPartnerInquiriesForStudio } from "@/lib/studio/partnerInquiries";
import { getSupabaseAdminOrNull } from "@/lib/supabaseServiceRole";

import { StudioPartnerInquiriesPageClient } from "./StudioPartnerInquiriesPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Partner Inquiries",
  description: "Every submission from the /partner form.",
};

export default async function StudioPartnerInquiriesPage() {
  const hasDb = Boolean(getSupabaseAdminOrNull());
  const inquiries = hasDb ? await listPartnerInquiriesForStudio() : [];

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">Audience</p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl dark:text-white">Partner inquiries</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-white/65">
        Everyone who has submitted the /partner form: sponsorship, activations, and event attendance requests.
      </p>

      <StudioPartnerInquiriesPageClient inquiries={inquiries} hasDb={hasDb} />
    </div>
  );
}
