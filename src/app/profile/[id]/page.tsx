"use client";

import Image from "next/image";

import {
  IMAGE_BLUR_DATA_URL,
  isBundledPlaceholderSrc,
  resolveContentImageSrc,
} from "../../../lib/imagePlaceholder";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAppAuth } from "../../components/SupabaseAuthProvider";

import Header from "../../components/Header";
import type { simpleBlogCard } from "../../../libs/interface";
import { device } from "../../styles/breakpoints";

import { getCmsBrowserClient } from "../../../lib/cms/browser";
import { listBlogs } from "../../../lib/cms/queries";

export default function ProfileByIdPage() {
  const { data: session } = useAppAuth();
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [articleData, setArticleData] = useState<simpleBlogCard[]>([]);

  useEffect(() => {
    if (!session?.user?.id) return;
    fetch(`/api/users/${session.user.id}`)
      .then((res) => res.json())
      .then((data: { name?: string; email?: string }) => {
        setUserData({
          name: data.name ?? "",
          email: data.email ?? "",
        });
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }, [session?.user?.id]);

  useEffect(() => {
    void (async () => {
      const db = getCmsBrowserClient();
      if (!db) return;
      setArticleData(await listBlogs(db));
    })();
  }, []);

  const first = session?.user?.name?.trim()?.split(/\s+/)[0];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50 px-5 pb-16 pt-[var(--header-offset)] text-neutral-900 dark:bg-black dark:text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">
              {first ? `${first}'s profile` : "Your profile"}
            </h1>
            {userData.email ? (
              <p className="mt-2 text-sm text-neutral-600 dark:text-white/60">{userData.email}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold">Articles</h2>
            <p className="text-sm text-neutral-600 dark:text-white/65">Latest stories (saved list coming soon).</p>
          </div>

          <div className="flex flex-row flex-wrap gap-4 overflow-x-auto py-2">
            {articleData.map((cardData) => {
              const imgSrc = resolveContentImageSrc(cardData.titleImageUrl);
              return (
              <Card key={cardData.currentSlug}>
                <Link href={`/articles/${cardData.currentSlug}`}>
                  <CardBody>
                    <Image
                      src={imgSrc}
                      alt={cardData.title}
                      fill
                      loading="lazy"
                      draggable={false}
                      style={{ objectFit: "cover" }}
                      placeholder="blur"
                      blurDataURL={IMAGE_BLUR_DATA_URL}
                      unoptimized={isBundledPlaceholderSrc(imgSrc)}
                    />
                  </CardBody>
                </Link>

                <CardText>
                  <h2>{cardData.title}</h2>
                  <CardAuthor>
                    <p>{cardData.summary}</p>
                  </CardAuthor>
                </CardText>
              </Card>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}

const Card = styled.div`
  padding-bottom: 20px;
  padding-right: 20px;
`;

const CardBody = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: flex-start;
  height: 300px;
  width: 200px;
  padding: 20px;
  border-radius: 8px;
  background: #1a1a1a;
  cursor: pointer;
  box-shadow: 0px 6px 8px rgba(25, 50, 47, 0.08),
    0px 4px 4px rgba(18, 71, 52, 0.02), 0px 1px 16px rgba(18, 71, 52, 0.03);

  img {
    border-radius: 8px;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  &:hover {
    background-color: #44444444;
    opacity: 0.4;
    transform: scale(0.98);
    transition: 0.3s ease-in-out;
  }

  @media ${device.laptop} {
    height: 200px;
  }

  @media ${device.mobile} {
    height: 200px;
    width: 150px;
  }
`;

const CardText = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 20px;
  color: ${(props) => props.theme.title};

  h2 {
    cursor: pointer;
    font-size: 16px;
    padding-bottom: 10px;
    margin: 0;

    @media ${device.laptop} {
      font-size: 16px;
    }

    @media ${device.mobile} {
      font-size: 14px;
    }
  }

  p {
    cursor: pointer;
    font-size: 14px;
    color: ${(props) => props.theme.subtitle};

    @media ${device.laptop} {
      font-size: 12px;
      color: grey;
    }

    @media ${device.mobile} {
      font-size: 12px;
    }
  }
`;

const CardAuthor = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
