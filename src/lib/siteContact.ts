/**
 * Public inbox for guide and marketplace questions. Override with
 * `NEXT_PUBLIC_CONTACT_EMAIL` in production.
 */
export const PUBLIC_CONTACT_EMAIL =
  (typeof process.env.NEXT_PUBLIC_CONTACT_EMAIL === "string" && process.env.NEXT_PUBLIC_CONTACT_EMAIL.trim()) ||
  "hello@culturin.com";
