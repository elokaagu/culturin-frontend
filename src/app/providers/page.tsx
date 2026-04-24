/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import Header from "../components/Header";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { PROVIDER_DEMO_COVER } from "@/lib/remoteImageUrls";
import { IMAGE_BLUR_DATA_URL } from "../../lib/imagePlaceholder";
import { Button } from "@/components/ui/button";

export default function Providers() {
  return (
    <>
      <Header />
      <div
        className="flex min-h-full flex-col items-start bg-background px-6 py-10 pt-[var(--header-offset)] text-foreground sm:px-10"
        style={{ lineHeight: 2 }}
      >
        <Link
          href="/"
          className="fixed left-12 top-[12.5rem] z-10 hidden min-[429px]:inline-flex"
          aria-label="Back to home"
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
        <div className="mx-auto flex w-full max-w-3xl flex-col items-start pr-2">
          <h1 className="mb-0 w-full pt-5 pr-5 text-3xl text-foreground sm:pl-0">Dogpound</h1>
          <h3 className="pr-5 text-xl text-muted-foreground sm:pl-0">Fitness Company</h3>
          <div className="mb-4 flex w-full max-w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
            <div className="min-w-0 sm:pr-2">
              <div className="mb-0 inline-block overflow-hidden rounded-2xl shadow-md [&>img]:m-0 [&>img]:rounded-lg">
                <Image
                  src={PROVIDER_DEMO_COVER}
                  alt="mainImage"
                  width={600}
                  height={400}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                  className="relative m-0 rounded-lg object-cover"
                  draggable={false}
                />
              </div>
            </div>
            <div className="flex min-w-0 flex-col gap-2">
              <div className="inline-block overflow-hidden rounded-2xl shadow-md">
                <Image
                  src={PROVIDER_DEMO_COVER}
                  alt="mainImage"
                  width={300}
                  height={195}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                  className="relative object-cover"
                  draggable={false}
                />
              </div>
              <div className="inline-block overflow-hidden rounded-2xl shadow-md">
                <Image
                  src={PROVIDER_DEMO_COVER}
                  alt="mainImage"
                  width={300}
                  height={195}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                  className="relative object-cover"
                  draggable={false}
                />
              </div>
            </div>
          </div>
          <section>
            <h2 className="text-xl text-muted-foreground">About</h2>
            <p className="text-lg text-foreground">
              Dogpound is a fitness company that offers a variety of services. They offer personal training, group
              classes, and nutrition coaching. Dogpound is known for its high energy workouts and its celebrity clientele.
              The gym is located in New York City and Los Angeles.
            </p>
          </section>
          <div>
            <p>Location: London</p>
            <p>Contact: Eloka Agu</p>
            <p>Website: www.eloka@satellitelabs.xyz</p>
          </div>
          <div>
            <Button asChild className="mt-5 w-[100px]">
              <Link
                href="https://www.thedogpound.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline"
              >
                Book
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
