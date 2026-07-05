import { NextResponse } from "next/server";

import { getSupabaseAdminOrNull } from "@/lib/supabaseServiceRole";

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const o = body as {
    email?: unknown;
    billingCycle?: unknown;
    firstName?: unknown;
    lastName?: unknown;
    company?: unknown;
  };
  const email = typeof o.email === "string" ? o.email.trim().toLowerCase() : "";
  const billingCycle = typeof o.billingCycle === "string" ? o.billingCycle : "";
  const firstName = typeof o.firstName === "string" ? o.firstName.trim() : "";
  const lastName = typeof o.lastName === "string" ? o.lastName.trim() : "";
  const company = typeof o.company === "string" ? o.company.trim() : "";

  if (!emailOk(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  if (billingCycle !== "monthly" && billingCycle !== "annual") {
    return NextResponse.json({ error: "Invalid billing selection." }, { status: 400 });
  }
  // billingCycle is validated but not persisted — card_applications has no such
  // column; billing only applies once someone is an active Card member.

  const admin = getSupabaseAdminOrNull();
  if (!admin) {
    return NextResponse.json(
      { error: "This form isn’t available right now. Please email us directly." },
      { status: 503 },
    );
  }

  const { error } = await admin.from("card_applications").insert({
    email,
    first_name: firstName || null,
    last_name: lastName || null,
    company: company || null,
    source: "advisor_application",
  });

  if (error) {
    return NextResponse.json({ error: "Could not save your application. Try again in a moment." }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
