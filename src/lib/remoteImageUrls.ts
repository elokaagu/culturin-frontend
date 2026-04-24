/**
 * High-quality public demo/hero image URLs. Prefer CMS/Supabase data in production.
 * Static Unsplash fallbacks (no third-party host lock-in) — not Cloudinary.
 */
export const REMOTE_DEMO_IMAGES = {
  /** Portrait / vertical hero */
  portrait: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop&q=80",
  /** fitness / group energy */
  fitness: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=80",
  /** detail / texture */
  texture: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop&q=80",
} as const;

/** Spotlight card header / blur-style secondary image */
export const SPOTLIGHT_DEMO = {
  hero: REMOTE_DEMO_IMAGES.portrait,
  accent: REMOTE_DEMO_IMAGES.texture,
} as const;

/** Provider / marketing static examples */
export const PROVIDER_DEMO_COVER = REMOTE_DEMO_IMAGES.fitness;
