"use client";

import MuxPlayer from "@mux/mux-player-react";
import { Link } from "next-view-transitions";

import { DetailPageShell } from "../../components/detail/DetailPageShell";
import type { fullVideo } from "@/lib/interface";

export default function VideoDetailClient({ data }: { data: fullVideo }) {
  return (
    <DetailPageShell contentMaxClassName="max-w-2xl sm:max-w-2xl">
      <nav className="mb-8" aria-label="Breadcrumb">
        <Link
          href="/stream"
          className="text-sm text-amber-400/90 no-underline transition hover:text-amber-300/95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-500/50"
        >
          ← All videos
        </Link>
      </nav>

      <header className="text-left">
        <h1 className="m-0 text-2xl font-medium leading-tight tracking-tight text-white sm:text-[1.6rem]">
          {data.title}
        </h1>
        {data.uploader ? (
          <p className="mt-2.5 text-sm font-normal text-[#9a9a9a] sm:text-base">{data.uploader}</p>
        ) : null}
      </header>

      <div className="mt-8 overflow-hidden rounded-3xl bg-neutral-950/80 ring-1 ring-white/[0.08]">
        <div className="w-full max-w-full">
          <MuxPlayer
            playbackId={data.playbackId || undefined}
            className="w-full max-w-full overflow-hidden rounded-3xl"
            style={{ borderRadius: "1.5rem" }}
            metadata={{
              video_id: data._id ?? "",
              video_title: data.title ?? "",
              viewer_user_id: "user-id-dynamic",
            }}
          />
        </div>
      </div>

      {data.description ? (
        <p className="mb-0 mt-8 text-base font-normal leading-[1.7] text-white/[0.78]">{data.description}</p>
      ) : null}
    </DetailPageShell>
  );
}
