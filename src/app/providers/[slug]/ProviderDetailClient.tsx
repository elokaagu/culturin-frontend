"use client";

import React from "react";
import Image from "next/image";

import Header from "../../components/Header";
import type { fullProvider, imageAsset } from "../../../libs/interface";
import {
  IMAGE_BLUR_DATA_URL,
  isBundledPlaceholderSrc,
  resolveContentImageSrc,
} from "../../../lib/imagePlaceholder";
import { Button } from "@/components/ui/button";

function imageUrl(img: imageAsset | undefined) {
  const u = img?.url;
  if (typeof u !== "string") return "";
  const t = u.trim();
  if (!t) return "";
  if (t.startsWith("https://") || t.startsWith("http://") || t.startsWith("/")) return t;
  return "";
}

function externalBookHref(raw: string | undefined): string {
  const s = (raw || "").trim();
  if (!s) return "#";
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return `https://${s}`;
}

export default function ProviderDetailClient({ data }: { data: fullProvider }) {
  const bookUrl = externalBookHref(data.contactWebsite);
  const images = data.images ?? [];
  const primarySrc = resolveContentImageSrc(imageUrl(images[0]));
  const secondarySrc = resolveContentImageSrc(imageUrl(images[1]));
  const tertiarySrc = resolveContentImageSrc(imageUrl(images[2]));
  const primaryAlt = images[0]?._id ? `Image ${images[0]._id}` : data.eventName || "Experience image";
  const secondaryAlt = images[1]?._id ? `Image ${images[1]._id}` : `${data.eventName || "Experience"} — gallery`;
  const tertiaryAlt = images[2]?._id ? `Image ${images[2]._id}` : `${data.eventName || "Experience"} — gallery`;

  return (
    <>
      <Header />
      <div
        className="flex min-h-full flex-col items-start bg-background px-6 py-10 pt-[var(--header-offset)] text-foreground sm:px-10"
        style={{ lineHeight: 2 }}
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col items-start pr-2 max-[428px]:w-[300px] max-[428px]:overflow-y-auto sm:max-w-3xl">
          <h1 className="mb-0 w-full pt-5 pr-5 text-3xl sm:pl-0 sm:ml-2.5">{data.eventName}</h1>
          <h3 className="pr-5 text-xl text-muted-foreground sm:ml-2.5 sm:pl-0">{data.name}</h3>
          <div className="mb-4 flex w-full max-w-full flex-col gap-3 sm:flex-row sm:flex-wrap max-[428px]:flex-col">
            <div className="min-w-0 pr-0 sm:pr-2">
              <div className="mb-0 inline-block overflow-hidden rounded-2xl shadow-md max-[428px]:[&>img]:w-[300px]">
                <Image
                  src={primarySrc}
                  alt={primaryAlt}
                  width={600}
                  height={400}
                  loading="lazy"
                  quality={90}
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                  className="relative object-cover"
                  style={{ position: "relative" }}
                  draggable={false}
                  unoptimized={isBundledPlaceholderSrc(primarySrc)}
                />
              </div>
            </div>
            <div className="flex min-w-0 flex-col gap-2">
              <div className="inline-block overflow-hidden rounded-2xl shadow-md max-[428px]:[&>img]:w-[300px]">
                <Image
                  src={secondarySrc}
                  alt={secondaryAlt}
                  width={300}
                  height={195}
                  loading="lazy"
                  quality={90}
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                  className="relative object-cover"
                  style={{ position: "relative" }}
                  draggable={false}
                  unoptimized={isBundledPlaceholderSrc(secondarySrc)}
                />
              </div>
              <div className="inline-block overflow-hidden rounded-2xl shadow-md max-[428px]:[&>img]:w-[300px]">
                <Image
                  src={tertiarySrc}
                  alt={tertiaryAlt}
                  width={300}
                  height={195}
                  loading="lazy"
                  quality={90}
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                  className="relative object-cover"
                  style={{ position: "relative" }}
                  draggable={false}
                  unoptimized={isBundledPlaceholderSrc(tertiarySrc)}
                />
              </div>
            </div>
          </div>
          <section>
            <h2 className="text-xl text-muted-foreground">About</h2>
            <p className="text-lg text-foreground max-[428px]:pb-9">{data.description}</p>
          </section>
          <div>
            <p>Location: {data.location}</p>
            <p>Contact: {data.contactEmail}</p>
            <p>Website: {data.contactWebsite}</p>
          </div>
          <div>
            {bookUrl !== "#" ? (
              <Button asChild className="mt-5 w-[100px]">
                <a href={bookUrl} target="_blank" rel="noopener noreferrer" className="no-underline">
                  Book
                </a>
              </Button>
            ) : (
              <Button className="mt-5 w-[100px] cursor-not-allowed opacity-50" disabled>
                Book
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
