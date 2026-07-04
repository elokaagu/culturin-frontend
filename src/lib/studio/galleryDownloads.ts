import { getSupabaseAdminOrNull } from "@/lib/supabaseServiceRole";

export type StudioGalleryDownload = {
  id: string;
  imageSrc: string;
  imageAlt: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
};

export async function listGalleryDownloadsForStudio(): Promise<StudioGalleryDownload[]> {
  const admin = getSupabaseAdminOrNull();
  if (!admin) return [];

  const { data, error } = await admin
    .from("gallery_downloads")
    .select("id, image_src, image_alt, first_name, last_name, email, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[studio] failed to list gallery downloads:", error.message);
    return [];
  }
  if (!data) return [];

  return (data as Array<Record<string, unknown>>).map((row) => ({
    id: String(row.id ?? ""),
    imageSrc: String(row.image_src ?? ""),
    imageAlt: String(row.image_alt ?? ""),
    firstName: String(row.first_name ?? ""),
    lastName: String(row.last_name ?? ""),
    email: String(row.email ?? ""),
    createdAt: String(row.created_at ?? ""),
  }));
}
