import Header from "../components/Header";
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
  const allVideos = videos.length > 0 ? videos : getShowcaseFullVideos();
  const selectedSlug = typeof searchParams?.play === "string" ? searchParams.play : undefined;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black pb-16 pt-[var(--header-offset)] text-white">
        <StreamClient videos={allVideos} selectedSlug={selectedSlug} />
      </main>
    </>
  );
}
