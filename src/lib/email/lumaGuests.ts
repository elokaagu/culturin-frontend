import { parseSubscriberCsv } from "@/lib/studio/parseCsv";

export type Guest = {
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  /** Kept columns from the export, plus Title / LinkedIn / Source under the keys Studio's subscriber view reads. */
  raw: Record<string, string>;
  approved: boolean;
  checkedIn: boolean;
};

/** Luma columns that are noise for us (check-in links, ad-click ids, ticket pricing, wallets). */
const DROP = /^(qr_code_url|.*_click_id|amount.*|currency|coupon_code|ticket_type_id|eth_address|solana_address|phone_number)$/i;

const norm = (k: string) => k.trim().toLowerCase().replace(/[^a-z]/g, "");

/** First matching column with a value; an empty matching column only counts when nothing else matches. */
function pick(raw: Record<string, string>, test: (key: string) => boolean): string | undefined {
  let found: string | undefined;
  for (const [k, v] of Object.entries(raw)) {
    if (!test(norm(k)) || DROP.test(k.trim())) continue;
    if (v.trim()) return v;
    found ??= v;
  }
  return found;
}

/** Free-text answers that mean "nothing" ("N/A", "-", "none"). */
const blankIfJunk = (v: string) => (/^(n\/?a|none|nil|null|no|-+|\.+|\?+|x)$/i.test(v.trim()) ? "" : v.trim());

/** "KEVIN PARKER" / "ines abel" → "Kevin Parker" / "Ines Abel"; mixed-case names are left as typed. */
function tidyName(v: string): string {
  const s = v.trim().replace(/\s+/g, " ");
  if (s.length < 2 || (s !== s.toUpperCase() && s !== s.toLowerCase())) return s;
  return s.toLowerCase().replace(/(^|[\s\-'’])(\p{L})/gu, (_, sep: string, ch: string) => sep + ch.toUpperCase());
}

function cleanLinkedIn(v: string | undefined): string {
  const url = (v ?? "").trim();
  const handle = url.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, "").replace(/\/$/, "");
  return !url || ["non", "none", "na", "no", "nil", ""].includes(handle.toLowerCase().replace(/[^a-z]/g, "")) ? "" : url;
}

/** Reads a Luma guest export (or any CSV with an email column). */
export function parseGuestCsv(text: string): { guests: Guest[]; hasStatus: boolean; hasCheckIn: boolean } {
  const { rows } = parseSubscriberCsv(text);
  let hasStatus = false;
  let hasCheckIn = false;
  const guests = rows
    .filter((r) => r.email)
    .map((r) => {
      const status = pick(r.raw, (k) => k === "approvalstatus");
      const checkedInAt = pick(r.raw, (k) => k === "checkedinat");
      if (status !== undefined) hasStatus = true;
      if (checkedInAt !== undefined) hasCheckIn = true;

      let { firstName, lastName } = r;
      const fullName = (pick(r.raw, (k) => k === "name" || k === "fullname") ?? "").trim();
      if (!firstName && !lastName) {
        const [first, ...rest] = fullName.split(/\s+/);
        firstName = first ?? "";
        lastName = rest.join(" ");
      } else if (!lastName && fullName.toLowerCase().startsWith(firstName.toLowerCase() + " ")) {
        lastName = fullName.slice(firstName.length).trim();
      }

      // Luma registration questions arrive as free-text headers ("What company do you work for?").
      firstName = tidyName(firstName);
      lastName = tidyName(lastName);
      const company = blankIfJunk(r.company || (pick(r.raw, (k) => k.includes("company") || k.includes("organisation") || k.includes("organization")) ?? ""));
      const title = blankIfJunk(pick(r.raw, (k) => k.includes("title") || k.includes("role") || k.includes("position")) ?? "");
      const linkedIn = cleanLinkedIn(pick(r.raw, (k) => k.includes("linkedin")));
      const heardFrom = (pick(r.raw, (k) => k.includes("learnabout") || k.includes("hearabout"))?.trim() || pick(r.raw, (k) => k === "referrer") || "").trim();

      const raw: Record<string, string> = {};
      for (const [k, v] of Object.entries(r.raw)) if (v && !DROP.test(k.trim())) raw[k] = v;
      if (title) raw.Title = title;
      if (linkedIn) raw.LinkedIn = linkedIn;
      if (heardFrom) raw.Source = heardFrom;

      return {
        email: r.email,
        firstName,
        lastName,
        company,
        raw,
        approved: status === undefined || status.trim().toLowerCase() === "approved",
        checkedIn: Boolean(checkedInAt?.trim()),
      };
    });
  return { guests, hasStatus, hasCheckIn };
}
