export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export function isValidSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length >= 2 && value.length <= 64;
}

export function deckSharePath(deck: {
  share_token: string;
  custom_slug?: string | null;
}): string {
  return `/d/${deck.custom_slug || deck.share_token}`;
}

export function deckShareUrl(deck: {
  share_token: string;
  custom_slug?: string | null;
}): string {
  if (typeof window === "undefined") return deckSharePath(deck);
  return `${window.location.origin}${deckSharePath(deck)}`;
}

export function partnerShareUrl(slug: string): string {
  if (typeof window === "undefined") return `/d/${slug}`;
  return `${window.location.origin}/d/${slug}`;
}

export function formatDuration(seconds: number): string {
  if (!seconds || seconds < 1) return "0s";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

export function formatBytes(bytes: number | null | undefined): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
