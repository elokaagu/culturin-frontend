import { handleNewsletterSignup } from "@/lib/newsletterSignup";
import { REPORT_SOURCE } from "@/app/reports/the-irl-advantage/reportContent";

/** Separate from /api/newsletter because content blockers commonly block URLs containing "newsletter". */
export async function POST(req: Request) {
  return handleNewsletterSignup(req, REPORT_SOURCE);
}
