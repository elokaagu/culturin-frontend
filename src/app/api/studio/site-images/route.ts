import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getCurrentAdminState } from "@/lib/studio/admin";
import { getSupabaseAdminOrNull } from "@/lib/supabaseServiceRole";
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

  const slot = SITE_IMAGE_SLOTS.find((s) => s.key === slotKey);
  if (!slot) {
    return NextResponse.json({ message: "Unknown image slot." }, { status: 400 });
  }
  if (!src) {
    return NextResponse.json({ message: "An image is required." }, { status: 400 });
  }

  const admin = getSupabaseAdminOrNull();
  if (!admin) {
    return NextResponse.json(
      { message: "Saving isn’t available—your workspace isn’t fully connected. Try again later or contact support." },
      { status: 503 },
    );
  }

  const { error } = await admin
    .from("site_images")
    .upsert(
      { slot_key: slotKey, label: slot.label, src, alt: alt || slot.defaultAlt, updated_at: new Date().toISOString() },
      { onConflict: "slot_key" },
    );

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/events/[slug]", "page");

  return NextResponse.json({ message: "Image updated" });
}
