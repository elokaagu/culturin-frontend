export type CmsEntryType = "blog" | "video" | "provider";

/**
 * Create or update a CMS document via the admin API.
 * Caller must be authenticated as admin (enforced on the server).
 */
export async function postCmsEntry(
  type: CmsEntryType,
  entry: Record<string, unknown>
): Promise<{ ok: true; data: { message?: string; slug?: string } } | { ok: false; message: string }> {
  const response = await fetch("/api/studio/cms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, entry }),
  });

  const data = (await response.json().catch(() => ({}))) as { message?: string; slug?: string; error?: string };
  if (!response.ok) {
    return { ok: false, message: data.error ?? data.message ?? "Could not save entry." };
  }
  return { ok: true, data: { message: data.message, slug: data.slug } };
}
