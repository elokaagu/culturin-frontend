export type CreatorContentType = "blog" | "video" | "provider";

/**
 * Save a creator submission for admin review (does not publish to the live CMS).
 */
export async function postCreatorSubmission(
  contentType: CreatorContentType,
  payload: Record<string, unknown>,
): Promise<{ ok: true; data: { message?: string } } | { ok: false; message: string }> {
  const response = await fetch("/api/creator/submissions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content_type: contentType, payload }),
  });

  const data = (await response.json().catch(() => ({}))) as { message?: string; error?: string };
  if (!response.ok) {
    return { ok: false, message: data.error ?? data.message ?? "Could not submit." };
  }
  return { ok: true, data: { message: data.message } };
}
