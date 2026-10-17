/** Browser-only helpers for making web-sized copies of photos before upload. */

/** Decodes a photo with its EXIF rotation applied. Fails for formats the browser can't read (e.g. HEIC outside Safari). */
export async function decodePhoto(file: Blob): Promise<ImageBitmap> {
  return createImageBitmap(file, { imageOrientation: "from-image" });
}

/** A JPEG no larger than `longEdge` pixels on its longest side. Metadata (including GPS) is not carried over. */
export function resizeToJpeg(bitmap: ImageBitmap, longEdge: number, quality: number): Promise<Blob> {
  const scale = Math.min(1, longEdge / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.reject(new Error("This browser can't resize images."));
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, width, height);
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Couldn't resize this photo."))), "image/jpeg", quality),
  );
}
