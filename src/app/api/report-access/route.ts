import { notifyTeam, siteOrigin } from "@/lib/email/culturinEmail";
import { handleNewsletterSignup } from "@/lib/newsletterSignup";
import { REPORT_SOURCE } from "@/app/reports/the-irl-advantage/reportContent";

/** Separate from /api/newsletter because content blockers commonly block URLs containing "newsletter". */
export async function POST(req: Request) {
  return handleNewsletterSignup(req, REPORT_SOURCE, (s) =>
    notifyTeam({
      subject: `Report download: ${s.firstName} ${s.lastName}${s.company ? `, ${s.company}` : ""}`,
      eyebrow: "The IRL Advantage",
      headline: `${s.firstName} ${s.lastName} requested the report.`,
      intro: s.alreadySubscribed
        ? "They were already on the mailing list, so this is a returning reader."
        : "They're new to Culturin and have been added to the mailing list.",
      details: [
        { label: "Name", value: `${s.firstName} ${s.lastName}` },
        { label: "Email", value: s.email, href: `mailto:${s.email}` },
        { label: "Company", value: s.company },
      ],
      cta: { label: "View subscribers", href: `${siteOrigin()}/admin/subscribers` },
      replyTo: s.email,
    }),
  );
}
