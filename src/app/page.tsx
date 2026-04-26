import type { Metadata } from "next";

import HomePageClient from "./components/HomePageClient";
import {
  getShowcaseBlogCards,
  getShowcaseProviderCards,
  getShowcaseVideoCards,
} from "../lib/cms/showcaseContent";
import { getCmsDbOrNull } from "../lib/cms/server";
import { filterPublicBlogs, filterPublicVideos } from "../lib/cms/blockedFromSite";
import { listBlogs, listProviders, listVideos } from "../lib/cms/queries";

export const metadata: Metadata = {
  title: "Culturin | Travel, culture, and inspiration",
  description:
    "Discover trending travel stories, video highlights, and curated experiences from around the world.",
};

export const revalidate = 120;

export default async function Home() {
  const db = getCmsDbOrNull();
  const [blogsFromCms, videosFromCms, providersFromCms] = db
    ? await Promise.all([listBlogs(db), listVideos(db), listProviders(db)])
    : [[], [], []];

  const blogs = filterPublicBlogs(blogsFromCms.length > 0 ? blogsFromCms : getShowcaseBlogCards());
  const videos = filterPublicVideos(videosFromCms.length > 0 ? videosFromCms : getShowcaseVideoCards());
  const providers = providersFromCms.length > 0 ? providersFromCms : getShowcaseProviderCards();

  return (
    <HomePageClient
      initialBlogs={blogs}
      initialVideos={videos}
      initialProviders={providers}
    />
  );
}
