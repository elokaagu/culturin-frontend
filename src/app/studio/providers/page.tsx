import type { Metadata } from "next";
import { StudioProviderForm } from "./StudioProviderForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Providers & experiences",
  description: "Create or update provider and experience cards in the CMS.",
};

export default function StudioProvidersPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">CMS</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Providers &amp; experiences</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-white/65">
        Listings are available on <span className="text-neutral-800 dark:text-white/80">/providers</span>, experience rails, and
        destination-adjacent flows.
      </p>
      <StudioProviderForm />
    </div>
  );
}
