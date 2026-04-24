"use client";

import React from "react";
import Header from "../components/Header";
import Link from "next/link";
import { FeedCard } from "../components/Feed";

const SPOTLIGHT_CARD = {
  title: "Introducing Cynthia Bailey",
  description: "American star talks travel, culture and health",
  href: "/spotlight/posts",
  imageSrc:
    "https://res.cloudinary.com/drfkw9rgh/image/upload/v1705493709/ojcn4o1quyu8e6fdyaws.webp",
  imageAlt: "Cynthia Bailey for Culturin spotlight interview",
  publishedAt: "2024-01-17",
  dateLabel: "17 January 2024",
  blurDataURL:
    "https://res.cloudinary.com/drfkw9rgh/image/upload/v1704889319/htsnt5rzrvjcfnrixbqy.jpg",
} as const;

export default function Spotlight() {
  return (
    <>
      <Header />
      <div
        className="flex h-full min-h-full flex-col items-start overflow-x-hidden bg-background px-10 py-10 pt-[var(--header-offset)] text-foreground max-[428px]:pl-0"
        style={{ lineHeight: 2 }}
      >
        <nav
          aria-label="Spotlight section"
          className="mb-4 w-full max-w-3xl self-center px-2 sm:px-4"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-amber-400 no-underline transition-colors hover:text-amber-200 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
          >
            <span aria-hidden>←</span>
            Back to home
          </Link>
        </nav>
        <div className="p-2.5 pl-4 sm:ml-80 sm:pl-0 max-[428px]:ml-2.5">
          <h1 className="text-3xl"> News</h1>
        </div>
        <div className="flex w-full max-w-3xl flex-col items-center gap-8 self-center max-[428px]:ml-5 max-[428px]:items-start">
          {[0, 1, 2].map((i) => (
            <FeedCard key={i} {...SPOTLIGHT_CARD} />
          ))}
        </div>
      </div>
    </>
  );
}
