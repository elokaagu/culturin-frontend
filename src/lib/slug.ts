/** Decode dynamic [slug] segment for DB lookup (handles encoded characters in URLs). */
export function normalizeSlugParam(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}
