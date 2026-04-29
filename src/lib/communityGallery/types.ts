export type GalleryTileKind = "blog" | "video" | "provider" | "travel";

export type GalleryTile = {
  id: string;
  kind: GalleryTileKind;
  imageUrl: string;
  href: string;
  title: string;
  subtitle?: string | null;
  /** ISO timestamp for sorting (newest first) */
  sortAt: string;
};
