import type { simpleBlogCard } from "@/lib/interface";

type VideoLike = { title: string; currentSlug: string };

/**
 * Remove specific legacy / unwanted CMS items from the public app.
 * Adjust patterns here if slugs or titles differ in your database.
 */
function norm(s: string) {
  return s.toLowerCase().trim();
}

export function isBlogHiddenFromSite(blog: { title: string; currentSlug: string }): boolean {
  const t = norm(blog.title);
  const s = norm(blog.currentSlug);
  if (t.includes("drums of tomorrow") || (s.includes("drum") && s.includes("tomorrow"))) return true;
  if (t.includes("cynthia bailey")) return true;
  if (t.includes("culturin convos") && t.includes("cynthia")) return true;
  return false;
}

export function isVideoHiddenFromSite(v: VideoLike): boolean {
  const t = norm(v.title);
  const s = norm(v.currentSlug);
  if (t.includes("drums of tomorrow") || (s.includes("drum") && s.includes("tomorrow"))) return true;
  if (t.includes("cynthia bailey") && t.includes("convos")) return true;
  return false;
}

export function filterPublicBlogs(cards: simpleBlogCard[]): simpleBlogCard[] {
  return cards.filter((c) => !isBlogHiddenFromSite(c));
}

/** Use for `videoCard[]` and `fullVideo[]` (stream). */
export function filterPublicVideos<T extends VideoLike>(cards: T[]): T[] {
  return cards.filter((c) => !isVideoHiddenFromSite(c));
}
