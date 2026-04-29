/**
 * Builds iframe URLs for Culturin CMS `playback_id` fields (opaque hosted player IDs).
 * Uses `NEXT_PUBLIC_VIDEO_PLAYER_ORIGIN` from the Next.js env (see `next.config.js`).
 */
export function hostedVideoIframeSrc(playbackId: string, title: string): string {
  const id = playbackId.trim();
  if (!id) return "";
  const origin =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_VIDEO_PLAYER_ORIGIN?.replace(/\/$/, "").trim()
      : "";
  if (!origin) return "";
  const params = new URLSearchParams({ "metadata-video-title": title });
  return `${origin}/${id}?${params.toString()}`;
}
