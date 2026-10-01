import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getCurrentAdminState } from "@/lib/studio/admin";
import { getSupabaseAdminFreshOrNull } from "@/lib/supabaseServiceRole";
import { SITE_IMAGE_SLOTS } from "@/lib/siteImages";

export async function PATCH(request: Request) {
  const { isAdmin } = await getCurrentAdminState();
  if (!isAdmin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const slotKey = String(body.slot_key ?? "").trim();
  const src = String(body.src ?? "").trim();
  const alt = String(body.alt ?? "").trim();
  const focal = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? Math.max(0, Math.min(100, Math.round(v * 10) / 10)) : null);
  const focalX = focal(body.focal_x);
  const focalY = focal(body.focal_y);

  const slot = SITE_IMAGE_SLOTS.find((s) => s.key === slotKey);
  if (!slot) {
    return NextResponse.json({ message: "Unknown image slot." }, { status: 400 });
  }
  if (!src) {
    return NextResponse.json({ message: "An image is required." }, { status: 400 });
  }

  const admin = getSupabaseAdminFreshOrNull();
  if (!admin) {
    return NextResponse.json(
      { message: "Saving isn’t available—your workspace isn’t fully connected. Try again later or contact support." },
      { status: 503 },
    );
  }

  const row = { slot_key: slotKey, label: slot.label, src, alt: alt || slot.defaultAlt, updated_at: new Date().toISOString() };
  let { error } = await admin.from("site_images").upsert({ ...row, focal_x: focalX, focal_y: focalY }, { onConflict: "slot_key" });
  // Before migration 048 there are no focal columns: save the photo anyway and say so.
  let focalSaved = true;
  if (error && /focal_/.test(error.message)) {
    focalSaved = false;
    ({ error } = await admin.from("site_images").upsert(row, { onConflict: "slot_key" }));
  }

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/events/[slug]", "page");

  revalidatePath("/services/[slug]", "page");
  revalidatePath("/partner");

  return NextResponse.json({ message: focalSaved ? "Image updated" : "Image updated (focal point needs migration 048 to save)" });
}
