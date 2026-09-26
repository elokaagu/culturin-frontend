import { NextResponse } from "next/server";

import { notifyTeam, siteOrigin, teamRecipients } from "@/lib/email/culturinEmail";
import { getCurrentAdminState } from "@/lib/studio/admin";

export const dynamic = "force-dynamic";

/** Sends a branded test alert to the team inboxes, so you can confirm Resend is set up. */
export async function POST() {
  const { isAdmin, email } = await getCurrentAdminState();
  if (!isAdmin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ message: "RESEND_API_KEY isn't set in this environment. Add it in Vercel and redeploy." }, { status: 503 });
  }

  const to = teamRecipients();
  const result = await notifyTeam({
    subject: "Culturin test email",
    eyebrow: "Test email",
    headline: "Email alerts are working.",
    intro: "This is a test from the Culturin admin. From now on you'll get an email like this whenever something needs your attention.",
    details: [
      { label: "Partner inquiries", value: "Every new request from /partner" },
      { label: "Event RSVPs", value: "Every new RSVP, with the guest's role and company" },
      { label: "Report downloads", value: "Every request for The In Real Life Advantage" },
      { label: "Sent to", value: to.join(", ") },
      { label: "Triggered by", value: email ?? "an admin" },
    ],
    note: "Replying to an alert goes straight to the person who filled in the form.",
    cta: { label: "Open the admin", href: `${siteOrigin()}/admin` },
  });

  if (!result.ok) return NextResponse.json({ message: `Resend said: ${result.error}` }, { status: 502 });
  return NextResponse.json({ ok: true, to });
}
