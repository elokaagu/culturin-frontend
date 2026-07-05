import { NextResponse } from "next/server";

import { getCurrentAdminState } from "@/lib/studio/admin";
import { getSupabaseAdminOrNull } from "@/lib/supabaseServiceRole";

export async function POST(request: Request) {
  const { isAdmin } = await getCurrentAdminState();
  if (!isAdmin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as { id?: unknown };
  const rsvpId = typeof body.id === "string" ? body.id.trim() : "";
  if (!rsvpId) {
    return NextResponse.json({ message: "An RSVP id is required." }, { status: 400 });
  }

  const admin = getSupabaseAdminOrNull();
  if (!admin) {
    return NextResponse.json(
      { message: "Nominating isn’t available—your workspace isn’t fully connected. Try again later." },
      { status: 503 },
    );
  }

  const { data: existingNomination, error: existingError } = await admin
    .from("card_applications")
    .select("id")
    .eq("source_rsvp_id", rsvpId)
    .maybeSingle();

  if (existingError) {
    return NextResponse.json({ message: existingError.message }, { status: 500 });
  }
  if (existingNomination) {
    return NextResponse.json({ message: "This RSVP has already been nominated." }, { status: 409 });
  }

  const { data: rsvp, error: rsvpError } = await admin
    .from("event_rsvps")
    .select("id, event_slug, first_name, last_name, email, company, title, linkedin_url")
    .eq("id", rsvpId)
    .maybeSingle();

  if (rsvpError) {
    return NextResponse.json({ message: rsvpError.message }, { status: 500 });
  }
  if (!rsvp) {
    return NextResponse.json({ message: "RSVP not found." }, { status: 404 });
  }

  const { error: insertError } = await admin.from("card_applications").insert({
    email: rsvp.email,
    first_name: rsvp.first_name,
    last_name: rsvp.last_name,
    company: rsvp.company,
    title: rsvp.title,
    linkedin_url: rsvp.linkedin_url,
    source: "event_rsvp",
    source_event_slug: rsvp.event_slug,
    source_rsvp_id: rsvp.id,
  });

  if (insertError) {
    return NextResponse.json({ message: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
