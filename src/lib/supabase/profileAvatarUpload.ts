/** Keep in sync with `supabase/migrations/004_storage_media_bucket.sql` (+ 007 for HEIC). */
const ALLOWED_IMAGE_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
]);

function extensionContentType(fileName: string): string | null {
  const ext = fileName.toLowerCase().split(".").pop();
  if (!ext) return null;
  const map: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    heic: "image/heic",
    heif: "image/heif",
  };
  return map[ext] ?? null;
}

/** Resolve a MIME type Supabase Storage will accept for the bucket allow-list. */
export function resolveProfileImageContentType(file: File): string | null {
  const fromName = extensionContentType(file.name);
  const t = (file.type || "").trim().toLowerCase();
  if (t && t !== "application/octet-stream" && ALLOWED_IMAGE_MIME.has(t)) return t;
  if (fromName && ALLOWED_IMAGE_MIME.has(fromName)) return fromName;
  return null;
}

export function isProfileImageFileAccepted(file: File): boolean {
  return resolveProfileImageContentType(file) !== null;
}

export function profileAvatarStoragePath(userId: string, fileName: string): string {
  const safe = fileName.replace(/[^\w.+-]+/g, "-").replace(/^-+|-+$/g, "") || "upload.bin";
  return `${userId}/avatar/${Date.now()}-${safe}`;
}

export function formatStorageUploadError(error: { message?: string }): string {
  const msg = (error.message || "").toLowerCase();
  if (msg.includes("row-level security") || msg.includes("rls") || error.message?.includes("403")) {
    return "We couldn’t save this file. Ask your administrator to check storage permissions, or try again in a few minutes.";
  }
  if (msg.includes("bucket not found") || msg.includes("not found")) {
    return "File storage isn’t ready yet. Try again later or contact support.";
  }
  if (msg.includes("mime type") || msg.includes("mime_type") || msg.includes("invalid")) {
    return "This file type isn’t supported. Use JPEG, PNG, WebP, GIF, or HEIC from your phone.";
  }
  return error.message || "Upload failed.";
}
