import { notFound } from "next/navigation";

import IslandNav from "../components/IslandNav";
import HomeFooter from "../components/HomeFooter";
import { SURFACE_DARK, ON_DARK_TEXT } from "@/lib/theme/culturinTokens";
import StreamClient from "./StreamClient";
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
    if (!bySlug) {
      notFound();
    }
  }
  const allVideos = raw;
  const selectedSlug = playParam;

  return (
    <>
      <IslandNav />
      <main className="min-h-dvh pb-16" style={{ background: SURFACE_DARK, color: ON_DARK_TEXT, paddingTop: "8rem" }}>
        <StreamClient videos={allVideos} selectedSlug={selectedSlug} />
      </main>
      <HomeFooter />
    </>
  );
}
