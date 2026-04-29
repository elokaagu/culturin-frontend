/** Default Mux player origin when `NEXT_PUBLIC_VIDEO_PLAYER_ORIGIN` is not set (matches next.config.js). */
const DEFAULT_PLAYER_ORIGIN = "https://player.mux.com";

/**
 * Builds iframe URLs for Culturin CMS `playback_id` fields (opaque hosted player IDs).
 * Uses `NEXT_PUBLIC_VIDEO_PLAYER_ORIGIN` when set; otherwise Mux (`https://player.mux.com`).
 */
export function hostedVideoIframeSrc(playbackId: string, title: string): string {
  const id = playbackId.trim();
  if (!id) return "";
  const origin =
    (typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_VIDEO_PLAYER_ORIGIN?.replace(/\/$/, "").trim()
      : "") || DEFAULT_PLAYER_ORIGIN;
  const params = new URLSearchParams({ "metadata-video-title": title });
  return `${origin}/${id}?${params.toString()}`;
}
