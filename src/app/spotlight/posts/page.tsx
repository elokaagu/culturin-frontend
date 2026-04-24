/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import Header from "../../components/Header";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { SPOTLIGHT_DEMO } from "@/lib/remoteImageUrls";
import VideoPlayer from "../../components/VideoPlayer";
import { IMAGE_BLUR_DATA_URL } from "../../../lib/imagePlaceholder";

export default function SpotlightPosts() {
  return (
    <>
      <Header />
      <div
        className="flex h-full min-h-full flex-col items-center bg-background px-6 py-10 pt-[var(--header-offset)] text-foreground sm:px-10"
        style={{ lineHeight: 2 }}
      >
        <Link
          href="/spotlight"
          className="fixed left-12 top-[12.5rem] z-10 hidden min-[429px]:inline-flex"
          aria-label="Back to spotlight"
        >
          <span className="inline-flex items-center gap-1 pb-5 text-amber-400 no-underline transition hover:text-foreground">
            <svg
              width="16"
              height="16"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
            <span>back</span>
          </span>
        </Link>
        <div className="mx-2.5 flex w-full max-w-3xl flex-col items-center sm:pl-7">
          <h1 className="w-full pl-0 pt-5 pr-5 text-3xl max-[428px]:ml-10">Cynthia Bailey</h1>
          <h3 className="w-full pl-0 pr-5 text-xl text-muted-foreground sm:pl-0 max-[428px]:pl-2.5">
            Culturin Convos: A conversation with Cynthia Bailey
          </h3>
        </div>
        <div
          className="w-full max-w-3xl cursor-pointer px-2 pb-5 sm:pl-4 max-[428px]:pl-2.5 max-[428px]:[&>span>img]:w-[360px] max-[428px]:[&>span>img]:rounded-lg"
        >
          <span
            className="inline-block overflow-hidden rounded-2xl shadow-md [&>span]:rounded-2xl max-[428px]:[&>span>img]:ml-0"
          >
            <Image
              src={SPOTLIGHT_DEMO.hero}
              alt="mainImage"
              width={700}
              height={500}
              loading="lazy"
              placeholder="blur"
              blurDataURL={IMAGE_BLUR_DATA_URL}
              className="relative object-cover"
              draggable={false}
            />
          </span>
        </div>
        <div className="w-full max-w-3xl px-2 sm:pl-4">
          <VideoPlayer src="https://www.youtube.com/watch?v=IX8reBGLQFk" />
        </div>
        <div className="mx-auto w-full max-w-[50%] flex-col self-center sm:pl-6 sm:pr-4 max-[428px]:w-full max-[428px]:items-start max-[428px]:pl-5">
          <p className="pt-5 text-lg text-foreground max-[428px]:text-lg">
            Cynthia, often referred to as the "Coal City State," is a Nigerian city that boasts a diverse and vibrant
            cultural heritage. Located in the southeastern region of Nigeria, Enugu is not only known for its
            historical significance but also for the tapestry of cultures that have woven together to create a unique
            cultural identity. One of the most prominent aspects of Enugu&apos;s cultural heritage is its rich history.
            The city served as the capital of the short-lived Republic of Biafra during the Nigerian Civil War, making it
            a symbol of resilience and determination in the face of adversity. Visitors can explore the remnants of this
            turbulent period through various museums and memorials, gaining insight into the city&apos;s historical
            struggles and triumphs. Enugu&apos;s cultural heritage is also deeply intertwined with its indigenous people,
            primarily the Igbo.
          </p>
        </div>
      </div>
    </>
  );
}
