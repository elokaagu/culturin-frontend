import type { Metadata } from "next";

import { EDITORIAL_BG, EDITORIAL_INK, editorialScopeClass } from "@/lib/theme/culturinTokens";
import SiteHeader from "@/app/components/SiteHeader";
import HomeFooter from "@/app/components/HomeFooter";
import { blurForSrc } from "@/lib/culturinImages";
import { getSiteImagesMap, manifestDefault, resolveSiteImage } from "@/lib/siteImages";
import { PartnerExperience, type PartnerImage } from "./PartnerForm";

export const metadata: Metadata = {
  title: "Create an Experience | Culturin",
  description:
    "Tell us what you want to create. Culturin builds cultural programming and intelligence for brands launching in new territories.",
};

const IMAGE_KEYS: Record<string, string> = {
  intelligence: "homepage-service-intelligence",
  programming: "homepage-service-programming",
  moments: "homepage-service-moments",
  "cultural-marketing": "homepage-hero",
};

export default async function PartnerPage({ searchParams }: { searchParams: { service?: string | string[] } }) {
  const service = typeof searchParams.service === "string" ? searchParams.service : undefined;
  const siteImages = await getSiteImagesMap();

  const images: Record<string, PartnerImage> = {};
  for (const [choice, key] of Object.entries(IMAGE_KEYS)) {
    const img = resolveSiteImage(siteImages, key, manifestDefault(key));
    if (img.src) images[choice] = { src: img.src, alt: img.alt, blur: blurForSrc(img.src) };
  }

  return (
    <div style={{ background: EDITORIAL_BG, color: EDITORIAL_INK }} className={`${editorialScopeClass} font-sans antialiased`}>
      <SiteHeader />
      <main className="px-3 pb-3 pt-[5.25rem] sm:px-4 sm:pt-24">
        <PartnerExperience initialInterest={service} images={images} />
      </main>
      <HomeFooter />
    </div>
  );
}
