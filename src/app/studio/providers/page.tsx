import type { Metadata } from "next";

import { listProvidersForStudio } from "@/lib/cms/queries";
import { getCmsDbOrNull } from "@/lib/cms/server";

import type { ProviderFormInitial } from "./StudioProviderForm";
import { StudioProvidersPageClient } from "./StudioProvidersPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Experiences",
  description: "Create or update experience listings and partner cards.",
};

type StudioProvidersPageProps = {
  searchParams?: { edit?: string };
};

export default async function StudioProvidersPage({ searchParams }: StudioProvidersPageProps) {
  const db = getCmsDbOrNull();
  const providers = db ? await listProvidersForStudio(db) : [];
  const editSlug = searchParams?.edit?.trim() || "";
  const editing = db && editSlug
    ? await db
        .from("cms_providers")
        .select(
          "slug,name,event_name,description,location,avatar_image_url,languages,specialties,contact_email,contact_phone,contact_website,banner_image_url,published_at",
        )
        .eq("slug", editSlug)
        .maybeSingle()
    : null;
  const editEntry: ProviderFormInitial | null =
    editing?.data && !editing.error
      ? {
          slug: String(editing.data.slug ?? ""),
          name: String(editing.data.name ?? ""),
          event_name: String(editing.data.event_name ?? ""),
          description: String(editing.data.description ?? ""),
          location: String(editing.data.location ?? ""),
          avatar_image_url: String(editing.data.avatar_image_url ?? ""),
          languages: Array.isArray(editing.data.languages) ? editing.data.languages.join(", ") : "",
          specialties: Array.isArray(editing.data.specialties) ? editing.data.specialties.join(", ") : "",
          contact_email: String(editing.data.contact_email ?? ""),
          contact_phone: String(editing.data.contact_phone ?? ""),
          contact_website: String(editing.data.contact_website ?? ""),
          banner_image_url: String(editing.data.banner_image_url ?? ""),
          published_at: String(editing.data.published_at ?? ""),
        }
      : null;

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">Content</p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl dark:text-white">Experiences</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-white/65">
        Listings can appear on Providers, experience rails, and destination pages.
      </p>

      <StudioProvidersPageClient providers={providers} hasDb={Boolean(db)} editEntry={editEntry} />
    </div>
  );
}
