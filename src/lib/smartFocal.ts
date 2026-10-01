import "server-only";

import sharp from "sharp";

import { getSupabasePublicConfig } from "@/lib/supabase/publicConfig";

const MAX_BYTES = 25 * 1024 * 1024;
const WORK_WIDTH = 640;
const SLICE = 0.35;

/** Only our own Supabase Storage is fetched, so this can't be pointed at arbitrary URLs. */
function allowed(src: string): boolean {
  try {
    const url = new URL(src);
    const ours = new URL(getSupabasePublicConfig().url);
    return url.protocol === "https:" && url.host === ours.host && url.pathname.startsWith("/storage/v1/object/public/");
  } catch {
    return false;
  }
}

/**
 * Where the subject of a photo is, as percentages from the top-left. Uses sharp's "attention"
 * strategy (faces, skin tones, saturation, contrast) on a tall slice to find x and a wide slice
 * to find y. Falls back to the centre if anything goes wrong.
 */
export async function smartFocalPoint(src: string): Promise<{ x: number; y: number } | null> {
  if (!allowed(src)) return null;
  const res = await fetch(src, { cache: "no-store", signal: AbortSignal.timeout(15_000) }).catch(() => null);
  if (!res?.ok) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length > MAX_BYTES) return null;

  const base = await sharp(buf).rotate().resize({ width: WORK_WIDTH, withoutEnlargement: true }).toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = base.info;
  if (!W || !H) return null;

  /** sharp's attention point, in source pixels (a same-height slice keeps the scale at 1). */
  const attention = async (data: Buffer, w: number, h: number) => {
    const out = await sharp(data).resize(Math.max(1, Math.round(w * SLICE)), h, { fit: "cover", position: sharp.strategy.attention }).toBuffer({ resolveWithObject: true });
    const info = out.info as typeof out.info & { attentionX?: number; attentionY?: number };
    return typeof info.attentionX === "number" && typeof info.attentionY === "number" ? { x: info.attentionX, y: info.attentionY } : null;
  };

  // x from the whole photo; y from the top 70%, because in event photography the faces are
  // usually up there and bare shoulders or tables lower down otherwise pull the point down.
  const topH = Math.round(H * 0.7);
  const [whole, upper] = await Promise.all([attention(base.data, W, H), sharp(base.data).extract({ left: 0, top: 0, width: W, height: topH }).toBuffer().then((b) => attention(b, W, topH))]);
  if (!whole && !upper) return null;
  const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n * 10) / 10));
  return { x: clamp(((whole ?? upper)!.x / W) * 100), y: clamp(((upper ?? whole)!.y / H) * 100) };
}
