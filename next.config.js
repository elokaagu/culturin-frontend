const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
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
