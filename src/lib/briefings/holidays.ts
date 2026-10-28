import "server-only";

/** Public holidays from Nager.Date (https://date.nager.at), free and keyless. */

const API = "https://date.nager.at/api/v3";

export type PublicHoliday = { date: string; name: string; localName: string; global: boolean; types: string[] };

const norm = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");

/** ISO 3166-1 alpha-2 code for a country name ("South Africa" → "ZA"), or null if Nager doesn't cover it. */
export async function countryCodeFor(country: string): Promise<string | null> {
  const trimmed = country.trim();
  if (/^[A-Za-z]{2}$/.test(trimmed)) return trimmed.toUpperCase();
  const res = await fetch(`${API}/AvailableCountries`, { signal: AbortSignal.timeout(15_000) });
  if (!res.ok) return null;
  const list = (await res.json()) as { countryCode: string; name: string }[];
  const wanted = norm(trimmed);
  return list.find((c) => norm(c.name) === wanted)?.countryCode ?? list.find((c) => norm(c.name).includes(wanted))?.countryCode ?? null;
}

/** Holidays between two ISO dates (inclusive), across however many years that spans. */
export async function publicHolidays(countryCode: string, from: string, to: string): Promise<PublicHoliday[]> {
  const startYear = Number(from.slice(0, 4));
  const endYear = Number(to.slice(0, 4));
  const out: PublicHoliday[] = [];
  for (let year = startYear; year <= endYear; year++) {
    const res = await fetch(`${API}/PublicHolidays/${year}/${encodeURIComponent(countryCode)}`, { signal: AbortSignal.timeout(15_000) });
    if (!res.ok) continue;
    const rows = (await res.json()) as { date: string; name: string; localName: string; global: boolean; types?: string[] }[];
    for (const r of rows) {
      if (r.date >= from && r.date <= to) out.push({ date: r.date, name: r.name, localName: r.localName, global: r.global, types: r.types ?? [] });
    }
  }
  return out;
}
