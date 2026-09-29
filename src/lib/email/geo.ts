import "server-only";

export type Place = { city: string | null; region: string | null; country: string | null };

/**
 * City/region/country for an IP via ipwho.is (HTTPS, free tier ~10k lookups/month; set
 * IPWHOIS_KEY to use the paid ipwhois.pro endpoint instead). Never throws and gives up fast,
 * since it runs inside the Resend webhook. The IP is only used for the lookup, never stored.
 */
export async function lookupPlace(ip: string | null | undefined): Promise<Place | null> {
  const addr = (ip ?? "").trim();
  if (!addr || !/^[0-9a-f.:]+$/i.test(addr)) return null;
  const key = process.env.IPWHOIS_KEY?.trim();
  const url = key ? `https://ipwhois.pro/${encodeURIComponent(addr)}?key=${encodeURIComponent(key)}` : `https://ipwho.is/${encodeURIComponent(addr)}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2500);
  try {
    const res = await fetch(url, { signal: controller.signal, cache: "no-store" });
    const d = (await res.json().catch(() => ({}))) as { success?: boolean; city?: string; region?: string; country?: string };
    if (!res.ok || d.success === false) return null;
    return { city: d.city || null, region: d.region || null, country: d.country || null };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
