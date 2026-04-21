import { client } from "./lib/sanity";
import HomePageClient from "./components/HomePageClient";
import type { providerHeroCard, simpleBlogCard, videoCard } from "../libs/interface";

const BLOG_QUERY = `
  *[_type== 'blog'] | order(_createdAt desc) {
    title,
    titleImage,
    summary,
    "currentSlug": slug.current,
  }
`;

const VIDEO_QUERY = `
  *[_type== 'video'] | order(_createdAt desc) {
    title,
    uploader,
    videoThumbnail,
    description,
    "currentSlug": slug.current,
  }
`;

const PROVIDER_QUERY = `
  *[_type == "providers"] {
    name,
    eventName,
    "slug": slug.current,
    "bannerImage": {
      "image": {
        "url": bannerImage.image.asset->url,
        "alt": bannerImage.caption
      }
    },
  }
`;

export default async function Home() {
  const [blogs, videos, providers] = await Promise.all([
    client.fetch<simpleBlogCard[]>(BLOG_QUERY).catch(() => []),
    client.fetch<videoCard[]>(VIDEO_QUERY).catch(() => []),
    client.fetch<providerHeroCard[]>(PROVIDER_QUERY).catch(() => []),
  ]);

  return (
    <HomePageClient
      initialBlogs={blogs ?? []}
      initialVideos={videos ?? []}
      initialProviders={providers ?? []}
    />
  );
}
