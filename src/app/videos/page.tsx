/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { videoCard } from "../../libs/interface";
import { getCmsBrowserClient } from "../../lib/cms/browser";
import { listVideos } from "../../lib/cms/queries";
import { VideoCardFromCms } from "@/components/cms/VideoCard";

export default function Videos() {
  const [data, setData] = useState<videoCard[]>([]);

  useEffect(() => {
    async function fetchData() {
      const db = getCmsBrowserClient();
      if (!db) return;
      setData(await listVideos(db));
    }
    void fetchData();
  }, []);

  return (
    <>
      <Header />
      <div className="flex min-h-full flex-col items-center bg-background px-10 py-10 pt-[var(--header-offset)] text-foreground max-[428px]:items-start max-[428px]:pl-0">
        <div className="flex w-full cursor-pointer flex-col items-start pr-5 max-[428px]:ml-0 max-[428px]:mt-5 max-[428px]:w-full">
          <h1 className="text-2xl max-[428px]:ml-7">Top Videos</h1>
        </div>
        <div className="mb-3 flex w-full flex-col items-start pr-5 max-[428px]:ml-[3.75rem] max-[428px]:w-full">
          <p className="text-xl text-muted-foreground">Only on Culturin</p>
        </div>
        <div
          className="mx-auto grid w-full grid-cols-1 place-items-center gap-5 py-2 max-[428px]:p-2 min-[800px]:grid-cols-3"
          style={{ lineHeight: 2 }}
        >
          {data.map((video) => (
            <VideoCardFromCms key={video.currentSlug} video={video} />
          ))}
        </div>
      </div>
    </>
  );
}
