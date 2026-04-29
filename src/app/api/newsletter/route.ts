import { NextResponse } from "next/server";

import { getSupabaseAdminOrNull } from "@/lib/supabaseServiceRole";

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const o = body as { email?: unknown; marketingConsent?: unknown };
  const emailRaw = typeof o.email === "string" ? o.email.trim() : "";
  const consent = o.marketingConsent === true;

  if (!consent) {
    return NextResponse.json(
      { error: "You need to accept the privacy policy to subscribe." },
      { status: 400 },
    );
  }

  if (!emailOk(emailRaw)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const email = emailRaw.toLowerCase();
  const admin = getSupabaseAdminOrNull();
  if (!admin) {
    return NextResponse.json(
      { error: "Newsletter sign-up isn’t available right now. Please try again later." },
      { status: 503 },
    );
  }

  const { error } = await admin.from("newsletter_subscribers").insert({
    email,
    source: "footer",
  });

  if (error) {
    // 23505 = unique_violation (already subscribed)
    if (error.code === "23505") {
      return NextResponse.json({ ok: true, alreadySubscribed: true }, { status: 200 });
    }
    return NextResponse.json({ error: "Could not save your subscription. Try again in a moment." }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
