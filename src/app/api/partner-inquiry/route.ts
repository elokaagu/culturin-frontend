import { NextResponse } from "next/server";

import { notifyTeam, siteOrigin } from "@/lib/email/culturinEmail";
import { detectSpam, logSpam } from "@/lib/spamGuard";
import { getSupabaseAdminOrNull } from "@/lib/supabaseServiceRole";

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const INTEREST_LABELS: Record<string, string> = {
  intelligence: "Intelligence",
  programming: "Programming",
  moments: "Moments",
  "cultural-marketing": "Not sure yet",
};

const VALID_INTERESTS = new Set([
  "intelligence",
  "programming",
  "moments",
  "cultural-marketing",
  "new-territory",
  "cultural-intelligence",
  "sponsorship",
  "activation",
  "attend",
  "other",
]);

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

  const spam = detectSpam(o as Record<string, unknown>, { email, names: [name] });
  if (spam) {
    // Look like success so bots don't adapt; nothing is saved or emailed.
    logSpam("partner-inquiry", spam, email);
    return NextResponse.json({ ok: true }, { status: 201 });
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

  await notifyTeam({
    subject: `New partner inquiry: ${name}${company ? `, ${company}` : ""}`,
    eyebrow: "Partner inquiry",
    headline: `${name}${company ? ` from ${company}` : ""} wants to talk.`,
    intro: "Someone just asked for a call through Create an experience. Reply to this email to answer them directly.",
    details: [
      { label: "Name", value: name },
      { label: "Email", value: email, href: `mailto:${email}` },
      { label: "Company", value: company },
      { label: "Interested in", value: INTEREST_LABELS[interest] ?? interest },
      { label: "Message", value: message },
    ],
    cta: { label: "View in admin", href: `${siteOrigin()}/admin/partner-inquiries` },
    replyTo: email,
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
