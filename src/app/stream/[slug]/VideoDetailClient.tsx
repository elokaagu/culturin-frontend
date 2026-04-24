"use client";

import React from "react";
import MuxPlayer from "@mux/mux-player-react";

import Header from "../../components/Header";
import type { fullVideo } from "../../../libs/interface";

export default function VideoDetailClient({ data }: { data: fullVideo }) {
  return (
    <>
      <Header />
      <div
        className="flex min-h-full flex-col items-center bg-background px-6 py-10 pt-[var(--header-offset)] text-foreground sm:px-10"
        style={{ lineHeight: 2 }}
      >
        <div className="mx-auto w-full max-w-3xl cursor-pointer pr-2 max-[428px]:h-1/2 max-[428px]:w-full max-[428px]:overflow-hidden sm:pl-5">
          <div className="w-full max-w-full pb-5 max-[428px]:[&_img]:ml-0">
            <MuxPlayer
              playbackId={data.playbackId || undefined}
              className="w-full max-w-full overflow-hidden rounded-[20px]"
              style={{ borderRadius: "20px" }}
              metadata={{
                video_id: data._id ?? "",
                video_title: data.title ?? "",
                viewer_user_id: "user-id-dynamic",
              }}
            />
          </div>
          <div className="w-full pr-5 text-foreground sm:pl-0">
            <h1 className="text-3xl max-[428px]:ml-2.5">{data.title}</h1>
            <span className="text-lg text-muted-foreground max-[428px]:pl-2.5">{data.uploader}</span>
          </div>
          <div className="w-full pr-5 sm:pl-2.5">
            <p className="text-lg text-foreground max-[428px]:text-base">{data.description}</p>
          </div>
        </div>
      </div>
    </>
  );
}
