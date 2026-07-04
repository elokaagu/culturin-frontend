import { NextResponse } from "next/server";

import { getSupabaseAdminOrNull } from "@/lib/supabaseServiceRole";

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const VALID_INTERESTS = new Set(["sponsorship", "activation", "attend", "other"]);

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const o = body as {
    name?: unknown;
    email?: unknown;
    company?: unknown;
    interest?: unknown;
    message?: unknown;
  };

  const name = typeof o.name === "string" ? o.name.trim() : "";
  const email = typeof o.email === "string" ? o.email.trim().toLowerCase() : "";
  const company = typeof o.company === "string" ? o.company.trim() : "";
  const interestRaw = typeof o.interest === "string" ? o.interest.trim() : "";
  const message = typeof o.message === "string" ? o.message.trim() : "";
  const interest = VALID_INTERESTS.has(interestRaw) ? interestRaw : "other";

  if (!name) {
    return NextResponse.json({ error: "Enter your name." }, { status: 400 });
  }
  if (!emailOk(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const admin = getSupabaseAdminOrNull();
  if (!admin) {
    return NextResponse.json(
      { error: "This form isn’t available right now. Please email unik@culturin.com directly." },
      { status: 503 },
    );
  }

  const { error } = await admin.from("partner_inquiries").insert({
    name,
    email,
    company: company || null,
    interest,
    message: message || null,
  });

  if (error) {
    return NextResponse.json(
      { error: "Could not send your inquiry. Try again in a moment, or email unik@culturin.com directly." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
