import { NextResponse } from "next/server";

import { getCurrentAdminState } from "@/lib/studio/admin";
import { SUPABASE_PUBLIC_MEDIA_BUCKET } from "@/lib/storageConstants";
import { getSupabaseAdminFreshOrNull } from "@/lib/supabaseServiceRole";

export const dynamic = "force-dynamic";

const MAX_FILES = 50;

type Slot = { path: string; token: string; publicUrl: string };
export type GalleryUploadSlots = { name: string; grid: Slot; large: Slot; original: Slot };

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * `{ eventKey, files: string[] }` → signed upload slots for each photo's grid copy, lightbox copy and
 * untouched original under `media/events/{eventKey}/`, plus the next free sort position for the event.
 */
export async function POST(request: Request) {
  const { isAdmin } = await getCurrentAdminState();
  if (!isAdmin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const body = (await request.json().catch(() => ({}))) as { eventKey?: unknown; files?: unknown };
  const eventKey = slug(String(body.eventKey ?? ""));
  const files = Array.isArray(body.files) ? body.files.filter((f): f is string => typeof f === "string" && f.trim() !== "") : [];
  if (!eventKey) return NextResponse.json({ message: "An event name is required." }, { status: 400 });
  if (files.length === 0 || files.length > MAX_FILES) {
    return NextResponse.json({ message: `Send between 1 and ${MAX_FILES} files at a time.` }, { status: 400 });
  }

  const admin = getSupabaseAdminFreshOrNull();
  if (!admin) return NextResponse.json({ message: "Uploads aren't available right now." }, { status: 503 });
  const bucket = admin.storage.from(SUPABASE_PUBLIC_MEDIA_BUCKET);

  const sign = async (path: string): Promise<Slot> => {
    const { data, error } = await bucket.createSignedUploadUrl(path);
    if (error || !data) throw new Error(error?.message ?? "Couldn't prepare the upload.");
    return { path: data.path, token: data.token, publicUrl: bucket.getPublicUrl(data.path).data.publicUrl };
  };

  try {
    const slots: GalleryUploadSlots[] = await Promise.all(
      files.map(async (name) => {
        const dot = name.lastIndexOf(".");
        const ext = (dot > 0 ? name.slice(dot + 1) : "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
        const base = `${slug(dot > 0 ? name.slice(0, dot) : name) || "photo"}-${Math.random().toString(36).slice(2, 8)}`;
        const [grid, large, original] = await Promise.all([
          sign(`events/${eventKey}/${base}.jpg`),
          sign(`events/${eventKey}/large/${base}.jpg`),
          sign(`events/${eventKey}/original/${base}.${ext}`),
        ]);
        return { name, grid, large, original };
      }),
    );

    const { data: last } = await admin
      .from("gallery_images")
      .select("sort_order")
      .eq("event_key", eventKey)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    return NextResponse.json({ eventKey, nextSortOrder: (last?.sort_order ?? -1) + 1, slots });
  } catch (err) {
    return NextResponse.json({ message: err instanceof Error ? err.message : "Couldn't prepare the upload." }, { status: 500 });
  }
}
