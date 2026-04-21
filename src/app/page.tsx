import type { Metadata } from "next";

import HomePageClient from "./components/HomePageClient";
import { getCmsDbOrNull } from "../lib/cms/server";
import { listBlogs, listProviders, listVideos } from "../lib/cms/queries";

export const metadata: Metadata = {
  title: "Culturin | Travel, culture, and inspiration",
  description:
    "Discover trending travel stories, video highlights, and curated experiences from around the world.",
};

export const revalidate = 120;

export default async function Home() {
  const db = getCmsDbOrNull();
  const [blogs, videos, providers] = db
    ? await Promise.all([listBlogs(db), listVideos(db), listProviders(db)])
    : [[], [], []];

  return (
    <HomePageClient
      initialBlogs={blogs}
      initialVideos={videos}
      initialProviders={providers}
    />
  );
}
