const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function parse(ymd: string | null | undefined): { y: number; m: number; d: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd ?? "");
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return { y, m: mo, d };
}

/**
 * The date text shown on the site, built from a start and optional end date:
 * "June 22, 2026", "June 22 to 26, 2026", "August 25 to September 7, 2026",
 * "December 30, 2026 to January 2, 2027". Returns "" when there's no valid start.
 */
export function formatEventDateRange(startsOn: string | null | undefined, endsOn?: string | null): string {
  const s = parse(startsOn);
  if (!s) return "";
  const e = parse(endsOn);
  const single = `${MONTHS[s.m - 1]} ${s.d}, ${s.y}`;
  if (!e) return single;
  if (e.y === s.y && e.m === s.m && e.d === s.d) return single;
  if (e.y !== s.y) return `${single} to ${MONTHS[e.m - 1]} ${e.d}, ${e.y}`;
  if (e.m !== s.m) return `${MONTHS[s.m - 1]} ${s.d} to ${MONTHS[e.m - 1]} ${e.d}, ${s.y}`;
  return `${MONTHS[s.m - 1]} ${s.d} to ${e.d}, ${s.y}`;
}

export const isYmd = (v: unknown): v is string => typeof v === "string" && parse(v) !== null;
