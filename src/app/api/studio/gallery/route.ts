import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getCurrentAdminState } from "@/lib/studio/admin";
import { getSupabaseAdminOrNull } from "@/lib/supabaseServiceRole";

function asOrientation(input: unknown): "portrait" | "landscape" {
  return input === "portrait" ? "portrait" : "landscape";
}

function asEventKey(input: unknown): string {
  return String(input ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(request: Request) {
  const { isAdmin } = await getCurrentAdminState();
  if (!isAdmin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const entry = (await request.json()) as Record<string, unknown>;
  const src = String(entry.src ?? "").trim();
  const eventKey = asEventKey(entry.event_key ?? entry.event_label);

  if (!src) {
    return NextResponse.json({ message: "An image is required." }, { status: 400 });
  }
  if (!eventKey) {
    return NextResponse.json({ message: "An event name is required." }, { status: 400 });
  }

  const admin = getSupabaseAdminOrNull();
  if (!admin) {
    return NextResponse.json(
      { message: "Saving isn’t available—your workspace isn’t fully connected. Try again later or contact support." },
      { status: 503 },
    );
  }

  const payload = {
    event_key: eventKey,
    event_label: String(entry.event_label ?? "").trim() || eventKey,
    caption: String(entry.caption ?? "").trim(),
    location: String(entry.location ?? "").trim(),
    src,
    large_src: String(entry.large_src ?? "").trim() || src,
    alt: String(entry.alt ?? "").trim(),
    orientation: asOrientation(entry.orientation),
    sort_order: Number.isFinite(Number(entry.sort_order)) ? Number(entry.sort_order) : 0,
  };

  const { error } = await admin.from("gallery_images").insert(payload);
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  revalidatePath("/gallery");
  return NextResponse.json({ message: "Image added" });
}

export async function DELETE(request: Request) {
  const { isAdmin } = await getCurrentAdminState();
  if (!isAdmin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "id is required." }, { status: 400 });
  }

  const admin = getSupabaseAdminOrNull();
  if (!admin) {
    return NextResponse.json(
      { message: "Deleting isn’t available—your workspace isn’t fully connected. Try again later or contact support." },
      { status: 503 },
    );
  }

  const { error } = await admin.from("gallery_images").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  revalidatePath("/gallery");
  return NextResponse.json({ message: "Deleted" });
}
