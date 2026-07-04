import type { Metadata } from "next";

import { listCuratorsForStudio } from "@/lib/cms/queries";
import { getCmsDbOrNull } from "@/lib/cms/server";

import type { CuratorFormInitial } from "./StudioCuratorForm";
import { StudioCuratorsPageClient } from "./StudioCuratorsPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Curators",
  description: "Create or update syndication partner and curator profiles.",
};

type StudioCuratorsPageProps = {
  searchParams?: { edit?: string };
};

export default async function StudioCuratorsPage({ searchParams }: StudioCuratorsPageProps) {
  const db = getCmsDbOrNull();
  const curators = db ? await listCuratorsForStudio(db) : [];
  const editSlug = searchParams?.edit?.trim() || "";
  const editing =
    db && editSlug
      ? await db
          .from("cms_curators")
          .select("slug,name,tagline,description,website_url,instagram_url,shop_url,avatar_url,banner_url,specialties,published_at")
          .eq("slug", editSlug)
          .maybeSingle()
      : null;
  const editEntry: CuratorFormInitial | null =
    editing?.data && !editing.error
      ? {
          slug: String(editing.data.slug ?? ""),
          name: String(editing.data.name ?? ""),
          tagline: String(editing.data.tagline ?? ""),
          description: String(editing.data.description ?? ""),
          website_url: String(editing.data.website_url ?? ""),
          instagram_url: String(editing.data.instagram_url ?? ""),
          shop_url: String(editing.data.shop_url ?? ""),
          avatar_url: String(editing.data.avatar_url ?? ""),
          banner_url: String(editing.data.banner_url ?? ""),
          specialties: Array.isArray(editing.data.specialties) ? editing.data.specialties.join(", ") : "",
          published_at: String(editing.data.published_at ?? ""),
        }
      : null;

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-culturin-700 dark:text-culturin-300">Content</p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl dark:text-white">Curators</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-white/65">
        Syndication partners and editorial curators whose content is featured on Culturin.
      </p>

      <StudioCuratorsPageClient curators={curators} hasDb={Boolean(db)} editEntry={editEntry} />
    </div>
  );
}
