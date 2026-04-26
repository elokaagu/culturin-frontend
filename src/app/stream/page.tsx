import { notFound } from "next/navigation";

import Header from "../components/Header";
import StreamClient from "./StreamClient";
import { isVideoHiddenFromSite, filterPublicVideos } from "../../lib/cms/blockedFromSite";
import { getCmsDbOrNull } from "../../lib/cms/server";
import { listFullVideos } from "../../lib/cms/queries";
import { getShowcaseFullVideos } from "../../lib/cms/showcaseContent";

export default async function StreamLandingPage({
  searchParams,
}: {
  searchParams?: { play?: string };
}) {
  const db = getCmsDbOrNull();
  const videos = db ? await listFullVideos(db) : [];
  const raw = videos.length > 0 ? videos : getShowcaseFullVideos();
  const playParam = typeof searchParams?.play === "string" ? searchParams.play : undefined;
  if (playParam) {
    const bySlug = raw.find((v) => v.currentSlug === playParam);
    if (!bySlug || isVideoHiddenFromSite(bySlug)) {
      notFound();
    }
  }
  const allVideos = filterPublicVideos(raw);
  const selectedSlug = playParam;

  return (
    <>
      <Header />
      <main className="min-h-dvh bg-black pb-16 pt-[var(--header-offset)] text-white">
        <StreamClient videos={allVideos} selectedSlug={selectedSlug} />
      </main>
    </>
  );
}
