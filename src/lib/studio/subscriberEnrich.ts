/**
 * Fills gaps in subscriber records from what we already have, conservatively:
 * - names from a full-name column, or from "first.last@" style emails
 * - a missing last name when the email is "firstnamelastname@" and the first name is known
 * - fixes ALL-CAPS / all-lowercase names
 * Company is never guessed: domains like "creativetheory.agency" can't be turned into a reliable name.
 * Anything inferred is listed in `inferred` so it can be marked as a guess.
 */

/** Shared mailboxes: never guess a person's name from these. */
const GENERIC_LOCAL_PARTS = new Set([
  "info", "hello", "hi", "contact", "admin", "office", "team", "press", "media", "marketing", "sales", "support", "booking",
  "bookings", "events", "enquiries", "inquiries", "partnerships", "studio", "mail", "work", "werk", "management", "general",
  "accounts", "billing", "jobs", "careers", "noreply", "no-reply", "pr", "news", "newsletter", "shop", "store", "service",
]);

const HONORIFICS = new Set(["mr", "mrs", "ms", "miss", "dr", "prof", "sir"]);

/** Words that show up in handles but aren't names ("welcometothehills.nyc", "jane.official"). */
const NOT_NAMES = new Set([
  "nyc", "la", "ldn", "uk", "us", "usa", "official", "music", "art", "arts", "studio", "studios", "media", "the", "tv", "films",
  "film", "photo", "photos", "design", "designs", "creative", "creatives", "agency", "group", "global", "world", "live", "online",
]);

const WORD = /^[a-z][a-z'-]{1,13}$/i;

/** "o'neil" -> "O'Neil", "mary-jane" -> "Mary-Jane", "mcdonald" -> "McDonald". */
export function titleCaseName(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/(^|[\s'-])([a-z])/g, (_, sep: string, c: string) => sep + c.toUpperCase())
    .replace(/\bMc([a-z])/g, (_, c: string) => `Mc${c.toUpperCase()}`);
}

/** Only touch names typed entirely in upper or lower case; leave deliberate casing (e.g. "DeShawn") alone. */
function fixCase(s: string): string {
  const t = s.trim();
  if (!/[a-z]/i.test(t)) return t;
  if (t === t.toLowerCase() || (t === t.toUpperCase() && t.replace(/[^A-Za-z]/g, "").length > 1)) return titleCaseName(t);
  return t;
}

export type EnrichInput = { email: string; firstName: string; lastName: string; company: string; fullName?: string };
export type EnrichResult = { firstName: string; lastName: string; company: string; inferred: string[] };

export function enrichSubscriber(input: EnrichInput): EnrichResult {
  const inferred: string[] = [];
  let first = input.firstName.trim();
  let last = input.lastName.trim();
  const company = input.company.trim();
  const [localRaw = ""] = input.email.trim().toLowerCase().split("@");
  const local = localRaw.split("+")[0];

  // 1. A full-name column (Mailchimp's "name").
  const full = (input.fullName ?? "").trim().replace(/\s+/g, " ");
  if (full && (!first || !last) && !full.includes("@")) {
    const bits = full.split(" ");
    if (!first && bits[0]) {
      first = bits[0];
      inferred.push("first_name");
    }
    if (!last && bits.length > 1 && bits[0].toLowerCase() === first.toLowerCase()) {
      last = bits.slice(1).join(" ");
      inferred.push("last_name");
    }
  }

  // 2. "first.last@" / "first_last@" / "first-last@" (middle initials are skipped).
  const tokens = local.split(/[._-]/).filter((t) => t && !HONORIFICS.has(t));
  const hasNonName = tokens.some((t) => NOT_NAMES.has(t));
  const nameTokens = tokens.filter((t) => WORD.test(t) && !/\d/.test(t));
  const usable = !hasNonName && !GENERIC_LOCAL_PARTS.has(local) && !GENERIC_LOCAL_PARTS.has(tokens[0] ?? "") && tokens.length >= 2 && nameTokens.length === tokens.filter((t) => !/^[a-z]$/i.test(t)).length;
  if (usable) {
    const long = tokens.filter((t) => t.length >= 2 && WORD.test(t));
    if (long.length >= 2) {
      if (!first) {
        first = titleCaseName(long[0]);
        inferred.push("first_name");
      }
      if (!last && long[0].toLowerCase() === first.toLowerCase()) {
        last = titleCaseName(long[long.length - 1]);
        inferred.push("last_name");
      }
    }
  }

  // 3. "leilaessaoui@" with first name "Leila" -> last name "Essaoui".
  if (first && !last && /^[a-z]+$/.test(local) && !GENERIC_LOCAL_PARTS.has(local)) {
    const f = first.toLowerCase().replace(/[^a-z]/g, "");
    if (f.length >= 2 && local.startsWith(f) && local.length - f.length >= 3) {
      last = titleCaseName(local.slice(f.length));
      inferred.push("last_name");
    }
  }

  return { firstName: fixCase(first), lastName: fixCase(last), company, inferred };
}
