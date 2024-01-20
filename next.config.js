const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: ["res.cloudinary.com", "images.unsplash.com", "cdn.pixabay.com"],
    loader: "cloudinary",
    path: "https://res.cloudinary.com/drfkw9rgh/image/upload/",
  },
};

module.exports = withBundleAnalyzer(nextConfig);
