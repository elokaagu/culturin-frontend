import type { Metadata } from "next";

import HomePageClient from "../components/HomePageClient";
import { getShowcaseBlogCards } from "../../lib/cms/showcaseContent";
import { getCmsDbOrNull } from "../../lib/cms/server";
import { filterPublicBlogs } from "../../lib/cms/blockedFromSite";
import { listBlogs, listProviders } from "../../lib/cms/queries";

export const metadata: Metadata = {
  title: "Platform | Culturin",
  description:
    "Discover trending travel stories, video highlights, and curated experiences from around the world.",
};

export const revalidate = 120;

export default async function PlatformHomePage() {
  const db = getCmsDbOrNull();
  const [blogsFromCms, providersFromCms] = db
    ? await Promise.all([listBlogs(db), listProviders(db)])
    : [[], []];

  const blogs = filterPublicBlogs(blogsFromCms.length > 0 ? blogsFromCms : getShowcaseBlogCards());
  const providers = providersFromCms;

  return (
    <HomePageClient
      initialBlogs={blogs}
      initialProviders={providers}
    />
  );
}
