const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

// Mirror non-public env names so the **browser** bundle gets auth. Next only embeds
// `NEXT_PUBLIC_*` unless we copy them here (Vercel often has SUPABASE_URL but no NEXT_PUBLIC copy).
const publicSupabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const publicAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: publicSupabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: publicAnonKey,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.forbes.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      // Project ref subdomains: `https://<ref>.supabase.co/storage/...`
      { protocol: "https", hostname: "**.supabase.co", pathname: "/storage/**" },
      // Legacy: rows imported before the Sanity→Supabase migration may still store CDN URLs
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" },
    ],
  },
};

module.exports = withBundleAnalyzer(nextConfig);
