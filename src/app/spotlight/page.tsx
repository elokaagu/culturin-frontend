"use client";
import React from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Link from "next/link";
import { device } from "../styles/breakpoints";
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
      <AppBody>
        <nav aria-label="Spotlight section" className="mb-4 w-full max-w-3xl self-center px-2 sm:px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-amber-400 no-underline transition-colors hover:text-amber-200 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
          >
            <span aria-hidden>←</span>
            Back to home
          </Link>
        </nav>
        <SpotlightTitle>
          <h1> News</h1>
        </SpotlightTitle>
        <FeedContainer className="flex w-full flex-col items-center gap-8">
          {[0, 1, 2].map((i) => (
            <FeedCard key={i} {...SPOTLIGHT_CARD} />
          ))}
        </FeedContainer>
      </AppBody>
    </>
  );
}

const AppBody = styled.div`
  height: 100%;
  padding: 40px;
  display: flex;
  padding-top: var(--header-offset);
  align-items: flex-start;
  background: black;
  flex-direction: column;
  height: 100%;
  line-height: 2;
  color: white;
  overflow: none;

  @media ${device.mobile} {
    padding-left: 0px;
    align-items: flex-start;
  }
`;

const SpotlightTitle = styled.div`
  padding: 10px;
  margin-left: 320px;

  @media ${device.mobile} {
    align-items: flex-start;
    margin-left: 10px;
  }
`;

const FeedContainer = styled.div`
  @media ${device.mobile} {
    align-items: flex-start;
    margin-left: 20px;
  }
`;
