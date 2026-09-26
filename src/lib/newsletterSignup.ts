import { NextResponse } from "next/server";

import { getSupabaseAdminOrNull } from "@/lib/supabaseServiceRole";

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/** Validates a sign-up request body and stores it in `newsletter_subscribers` under `source`. */
export type NewsletterSignup = { email: string; firstName: string; lastName: string; company: string; alreadySubscribed: boolean };

export async function handleNewsletterSignup(
  req: Request,
  source: string,
  /** Runs after a successful sign-up (new or existing subscriber), e.g. to alert the team. Must not throw. */
  onSignup?: (signup: NewsletterSignup) => Promise<unknown>,
) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const o = body as {
    email?: unknown;
    firstName?: unknown;
    lastName?: unknown;
    company?: unknown;
    marketingConsent?: unknown;
  };
  const emailRaw = typeof o.email === "string" ? o.email.trim() : "";
  const firstNameRaw = typeof o.firstName === "string" ? o.firstName.trim() : "";
  const lastNameRaw = typeof o.lastName === "string" ? o.lastName.trim() : "";
  const companyRaw = typeof o.company === "string" ? o.company.trim() : "";
  const consent = o.marketingConsent === true;

  if (!consent) {
    return NextResponse.json(
      { error: "You need to accept the privacy policy to subscribe." },
      { status: 400 },
    );
  }

  if (!firstNameRaw || !lastNameRaw) {
    return NextResponse.json({ error: "Enter your first and last name." }, { status: 400 });
  }

  if (!emailOk(emailRaw)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const email = emailRaw.toLowerCase();
  const admin = getSupabaseAdminOrNull();
  if (!admin) {
    return NextResponse.json(
      { error: "Sign-up isn’t available right now. Please try again later." },
      { status: 503 },
    );
  }

  const { error } = await admin.from("newsletter_subscribers").insert({
    email,
    first_name: firstNameRaw,
    last_name: lastNameRaw,
    company: companyRaw || null,
    source,
  });

  if (error) {
    // 23505 = unique_violation (already subscribed)
    if (error.code === "23505") {
      await onSignup?.({ email, firstName: firstNameRaw, lastName: lastNameRaw, company: companyRaw, alreadySubscribed: true });
      return NextResponse.json({ ok: true, alreadySubscribed: true }, { status: 200 });
    }
    console.error("[newsletter-signup] insert failed", { source, code: error.code, message: error.message });
    return NextResponse.json({ error: "Could not save your details. Try again in a moment." }, { status: 500 });
  }

  await onSignup?.({ email, firstName: firstNameRaw, lastName: lastNameRaw, company: companyRaw, alreadySubscribed: false });
  return NextResponse.json({ ok: true }, { status: 201 });
}
