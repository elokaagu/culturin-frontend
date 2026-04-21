import { NextResponse } from "next/server";

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const o = body as { email?: unknown; billingCycle?: unknown };
  const email = typeof o.email === "string" ? o.email.trim() : "";
  const billingCycle = typeof o.billingCycle === "string" ? o.billingCycle : "";

  if (!emailOk(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  if (billingCycle !== "monthly" && billingCycle !== "annual") {
    return NextResponse.json({ error: "Invalid billing selection." }, { status: 400 });
  }

  // Hook for CRM, email provider, or Supabase insert — validated payload is ready here.
  return NextResponse.json({ ok: true }, { status: 201 });
}
