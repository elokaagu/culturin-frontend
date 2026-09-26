import { handleNewsletterSignup } from "@/lib/newsletterSignup";

export async function POST(req: Request) {
  return handleNewsletterSignup(req, "footer");
}
