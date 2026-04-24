import type { Metadata } from "next";

import HomePageClient from "./components/HomePageClient";
import { getShowcaseBlogCards, getShowcaseVideoCards } from "../lib/cms/showcaseContent";
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
  const [blogsFromCms, videosFromCms, providers] = db
    ? await Promise.all([listBlogs(db), listVideos(db), listProviders(db)])
    : [[], [], []];

  const blogs = blogsFromCms.length > 0 ? blogsFromCms : getShowcaseBlogCards();
  const videos = videosFromCms.length > 0 ? videosFromCms : getShowcaseVideoCards();

  return (
    <HomePageClient
      initialBlogs={blogs}
      initialVideos={videos}
      initialProviders={providers}
    />
  );
}
