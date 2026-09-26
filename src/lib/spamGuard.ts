/**
 * Cheap, invisible bot checks for the public forms (no CAPTCHA):
 * - a honeypot field people can't see but form-filling bots do fill in
 * - a minimum time between the form appearing and being sent (bots post instantly, or skip the form entirely)
 * - gibberish person names like "krhRuFDzKGFvnAer" or "Dvfxbrqre" (company names are not checked:
 *   real ones like "XTRND" or "BTRFLY" look random too)
 * - Gmail addresses stuffed with dots ("o.he.mer.u.b86@gmail.com"), a common throwaway pattern
 * Suspected bots get the normal success response but nothing is saved or emailed.
 */

export const HONEYPOT_FIELD = "website";
export const STARTED_AT_FIELD = "formStartedAt";
const MIN_FILL_MS = 3000;

/** A word that no real name looks like: long consonant runs or random mid-word capitals. */
export function looksLikeGibberish(word: string): boolean {
  const w = word.replace(/[^A-Za-z]/g, "");
  if (w.length < 5) return false;
  const consonantRun = Math.max(0, ...(w.toLowerCase().match(/[bcdfghjklmnpqrstvwxz]+/g) ?? []).map((r) => r.length));
  // Six+ in a row: real names top out around five ("Armstrong", "Deutschmann").
  if (consonantRun >= 6) return true;
  const inner = w.slice(1);
  const innerCaps = (inner.match(/[A-Z]/g) ?? []).length;
  const isAllCaps = w === w.toUpperCase();
  return !isAllCaps && innerCaps >= 4 && innerCaps / inner.length > 0.25;
}

function suspiciousEmail(email: string): boolean {
  const [local = "", domain = ""] = email.toLowerCase().split("@");
  if (domain !== "gmail.com" && domain !== "googlemail.com") return false;
  return (local.match(/\./g) ?? []).length >= 3;
}

export function detectSpam(body: Record<string, unknown>, opts: { email?: string; names?: string[] }): string | null {
  const honeypot = body[HONEYPOT_FIELD];
  if (typeof honeypot === "string" && honeypot.trim() !== "") return "honeypot";

  const started = Number(body[STARTED_AT_FIELD]);
  if (!Number.isFinite(started) || started <= 0) return "no-timing";
  if (Date.now() - started < MIN_FILL_MS) return "too-fast";

  if (opts.email && suspiciousEmail(opts.email)) return "dotted-gmail";

  // Real names essentially never contain a 5-consonant run or random inner capitals, so one such word is enough.
  if ((opts.names ?? []).flatMap((n) => n.split(/[\s'’-]+/)).some(looksLikeGibberish)) return "gibberish";

  return null;
}

export function logSpam(form: string, reason: string, email?: string) {
  console.warn("[spam-guard] dropped submission", { form, reason, domain: email?.split("@")[1] ?? "" });
}
