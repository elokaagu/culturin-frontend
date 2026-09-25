import type { Metadata } from "next";

import HomePageClient from "../components/HomePageClient";
import { getCmsDbOrNull } from "../../lib/cms/server";
import { listBlogs, listProviders } from "../../lib/cms/queries";

export const metadata: Metadata = {
  title: "Reports | Culturin",
  description:
    "Stories, video, and rooms from Culturin.",
};

export const revalidate = 120;

export default async function PlatformHomePage() {
  const db = getCmsDbOrNull();
  const [blogsFromCms, providersFromCms] = db
    ? await Promise.all([listBlogs(db), listProviders(db)])
    : [[], []];

  const blogs = blogsFromCms;
  const providers = providersFromCms;

  return (
    <HomePageClient
      initialBlogs={blogs}
      initialProviders={providers}
    />
  );
}
