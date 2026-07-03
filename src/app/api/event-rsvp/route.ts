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

  const o = body as {
    eventSlug?: unknown;
    firstName?: unknown;
    lastName?: unknown;
    email?: unknown;
    company?: unknown;
    title?: unknown;
    linkedin?: unknown;
  };

  const eventSlug = typeof o.eventSlug === "string" ? o.eventSlug.trim() : "";
  const firstName = typeof o.firstName === "string" ? o.firstName.trim() : "";
  const lastName = typeof o.lastName === "string" ? o.lastName.trim() : "";
  const email = typeof o.email === "string" ? o.email.trim().toLowerCase() : "";
  const company = typeof o.company === "string" ? o.company.trim() : "";
  const title = typeof o.title === "string" ? o.title.trim() : "";
  const linkedin = typeof o.linkedin === "string" ? o.linkedin.trim() : "";

  if (!eventSlug) {
    return NextResponse.json({ error: "Missing event." }, { status: 400 });
  }
  if (!firstName || !lastName) {
    return NextResponse.json({ error: "Enter your first and last name." }, { status: 400 });
  }
  if (!emailOk(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const admin = getSupabaseAdminOrNull();
  if (!admin) {
    return NextResponse.json(
      { error: "This form isn’t available right now. Please email us directly." },
      { status: 503 },
    );
  }

  const { error: rsvpError } = await admin.from("event_rsvps").insert({
    event_slug: eventSlug,
    first_name: firstName,
    last_name: lastName,
    email,
    company: company || null,
    title: title || null,
    linkedin_url: linkedin || null,
  });

  if (rsvpError) {
    return NextResponse.json(
      { error: "Could not save your RSVP. Try again in a moment." },
      { status: 500 },
    );
  }

  // Also add them to the general mailing list. A duplicate email here is
  // expected and not an error — they're just already subscribed.
  const { error: subscribeError } = await admin.from("newsletter_subscribers").insert({
    email,
    first_name: firstName,
    last_name: lastName,
    company: company || null,
    source: `event-rsvp:${eventSlug}`,
  });
  if (subscribeError && subscribeError.code !== "23505") {
    // Non-fatal: the RSVP itself already succeeded, so don't fail the request.
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
