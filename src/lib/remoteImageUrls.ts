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

/** Header Nearby rail — Imgix returns 404 for some legacy Unsplash slugs; re-check with `curl -I` when changing. */
export const NEARBY_CARD_IMAGES = {
  dining: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
  /** Food / evening scene (distinct from `finks` coffee id below in data). */
  sushi: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
  /** Calm body / land — wellness, not a flaky spa-interior id. */
  spa: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
} as const;
