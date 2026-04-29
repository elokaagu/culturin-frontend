import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getCurrentAdminState } from "@/lib/studio/admin";
import { getSupabaseAdminOrNull } from "@/lib/supabaseServiceRole";

type CmsType = "blog" | "video" | "provider";

function parseCsvArray(input: unknown): string[] {
  const value = String(input ?? "").trim();
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function asSlug(input: unknown) {
  const base = String(input ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  return base.replace(/^-|-$/g, "");
}

export async function POST(request: Request) {
  const { isAdmin } = await getCurrentAdminState();
  if (!isAdmin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as {
    type?: CmsType;
    entry?: Record<string, unknown>;
  };
  const type = body.type;
  const entry = body.entry ?? {};

  if (!type || !["blog", "video", "provider"].includes(type)) {
    return NextResponse.json({ message: "Invalid type." }, { status: 400 });
  }

  const slug = asSlug(entry.slug ?? entry.title ?? entry.name ?? entry.event_name);
  if (!slug) {
    return NextResponse.json({ message: "Slug or title/name is required." }, { status: 400 });
  }

  const admin = getSupabaseAdminOrNull();
  if (!admin) {
    return NextResponse.json(
      { message: "Saving isn’t available—your workspace isn’t fully connected. Try again later or contact support." },
      { status: 503 },
    );
  }

  if (type === "blog") {
    const originalSlug = asSlug(entry.original_slug);
    const payload = {
      slug,
      title: String(entry.title ?? "").trim(),
      summary: String(entry.summary ?? "").trim() || null,
      title_image_url: String(entry.title_image_url ?? "").trim() || null,
      published_at: String(entry.published_at ?? "").trim() || new Date().toISOString(),
    };
    const { error } =
      originalSlug && originalSlug !== slug
        ? await admin.from("cms_blogs").update(payload).eq("slug", originalSlug)
        : await admin.from("cms_blogs").upsert(payload, { onConflict: "slug" });
    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    revalidatePath("/articles");
    revalidatePath(`/articles/${slug}`);
    return NextResponse.json({ message: "Blog saved", slug });
  }

  if (type === "video") {
    const originalSlug = asSlug(entry.original_slug);
    const payload = {
      slug,
      title: String(entry.title ?? "").trim(),
      uploader: String(entry.uploader ?? "").trim() || null,
      description: String(entry.description ?? "").trim() || null,
      thumbnail_url: String(entry.thumbnail_url ?? "").trim() || null,
      playback_id: String(entry.playback_id ?? "").trim() || null,
      published_at: String(entry.published_at ?? "").trim() || new Date().toISOString(),
    };
    const { error } =
      originalSlug && originalSlug !== slug
        ? await admin.from("cms_videos").update(payload).eq("slug", originalSlug)
        : await admin.from("cms_videos").upsert(payload, { onConflict: "slug" });
    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    revalidatePath("/videos");
    return NextResponse.json({ message: "Video saved", slug });
  }

  const originalSlug = asSlug(entry.original_slug);
  const payload = {
    slug,
    name: String(entry.name ?? "").trim() || null,
    event_name: String(entry.event_name ?? "").trim() || null,
    description: String(entry.description ?? "").trim() || null,
    location: String(entry.location ?? "").trim() || null,
    avatar_image_url: String(entry.avatar_image_url ?? "").trim() || null,
    languages: parseCsvArray(entry.languages),
    specialties: parseCsvArray(entry.specialties),
    contact_email: String(entry.contact_email ?? "").trim() || null,
    contact_phone: String(entry.contact_phone ?? "").trim() || null,
    contact_website: String(entry.contact_website ?? "").trim() || null,
    banner_image_url: String(entry.banner_image_url ?? "").trim() || null,
    published_at: String(entry.published_at ?? "").trim() || new Date().toISOString(),
  };
  const { error } =
    originalSlug && originalSlug !== slug
      ? await admin.from("cms_providers").update(payload).eq("slug", originalSlug)
      : await admin.from("cms_providers").upsert(payload, { onConflict: "slug" });
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  revalidatePath("/providers");
  revalidatePath("/curated-experiences");
  return NextResponse.json({ message: "Provider saved", slug });
}
