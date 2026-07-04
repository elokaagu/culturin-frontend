import { NextResponse } from "next/server";

import { getSupabaseAdminOrNull } from "@/lib/supabaseServiceRole";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const imageSrc = String(body.imageSrc ?? "").trim();
  const imageAlt = String(body.imageAlt ?? "").trim();
  const firstName = String(body.firstName ?? "").trim();
  const lastName = String(body.lastName ?? "").trim();
  const email = String(body.email ?? "").trim();

  if (!imageSrc) {
    return NextResponse.json({ message: "Missing image." }, { status: 400 });
  }
  if (!firstName || !lastName) {
    return NextResponse.json({ message: "First and last name are required." }, { status: 400 });
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ message: "A valid email is required." }, { status: 400 });
  }

  const admin = getSupabaseAdminOrNull();
  if (!admin) {
    return NextResponse.json(
      { message: "Downloads aren’t available right now. Please try again shortly." },
      { status: 503 },
    );
  }

  const { error } = await admin.from("gallery_downloads").insert({
    image_src: imageSrc,
    image_alt: imageAlt || null,
    first_name: firstName,
    last_name: lastName,
    email,
  });

  if (error) {
    return NextResponse.json({ message: "Could not record your download. Try again in a moment." }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
