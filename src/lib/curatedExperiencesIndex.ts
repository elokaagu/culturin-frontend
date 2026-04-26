import type { providerCard } from "@/lib/interface";

export type CuratedProviderEntry = {
  provider: providerCard;
  city: string;
  country: string;
};

export type CuratedCountryGroup = {
  country: string;
  anchorId: string;
  entries: CuratedProviderEntry[];
};

/** Parse CMS location strings like "Lagos, Nigeria" or "London, United Kingdom". */
export function parseProviderLocation(location: string | undefined): { city: string; country: string } {
  const raw = (location || "").trim();
  if (!raw) return { city: "", country: "Other locations" };

  const parts = raw
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length >= 2) {
    const city = parts[0] || "";
    const country = parts.slice(1).join(", ") || "Other locations";
    return { city, country };
  }

  return { city: raw, country: "Other locations" };
}

function slugifyAnchorId(country: string): string {
  const s = country
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return s || "other-locations";
}

/**
 * Group providers by country; within each country sort by city then experience name.
 * Countries are ordered A–Z with "Other locations" last.
 */
export function groupCuratedProvidersByCountry(providers: providerCard[]): CuratedCountryGroup[] {
  const byCountry = new Map<string, CuratedProviderEntry[]>();

  for (const provider of providers) {
    const { city, country } = parseProviderLocation(provider.location);
    const list = byCountry.get(country);
    const entry: CuratedProviderEntry = { provider, city, country };
    if (list) list.push(entry);
    else byCountry.set(country, [entry]);
  }

  const countries = Array.from(byCountry.keys()).sort((a, b) => {
    const aOther = a === "Other locations" ? 1 : 0;
    const bOther = b === "Other locations" ? 1 : 0;
    if (aOther !== bOther) return aOther - bOther;
    return a.localeCompare(b, undefined, { sensitivity: "base" });
  });

  return countries.map((country) => {
    const entries = (byCountry.get(country) ?? []).slice().sort((x, y) => {
      const c = x.city.localeCompare(y.city, undefined, { sensitivity: "base" });
      if (c !== 0) return c;
      return x.provider.eventName.localeCompare(y.provider.eventName, undefined, { sensitivity: "base" });
    });
    return {
      country,
      anchorId: slugifyAnchorId(country),
      entries,
    };
  });
}
