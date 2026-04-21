"use client";

import React, { useMemo, useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { useSession } from "next-auth/react";

import Header from "../../components/Header";
import { device } from "../../styles/breakpoints";
import { urlFor } from "../../lib/sanity";
import type { fullBlog } from "../../../libs/interface";

type ToastState =
  | { open: false }
  | { open: true; message: string; variant: "success" | "info" | "error" };

export default function ArticleClient({ data }: { data: fullBlog }) {
  const { data: session, status } = useSession();
  const [toast, setToast] = useState<ToastState>({ open: false });

  const imageUrl = useMemo(() => {
    if (!data?.titleImage) return null;
    return urlFor(data.titleImage).url();
  }, [data?.titleImage]);

  const portableTextComponents: PortableTextComponents = useMemo(
    () => ({
      block: {
        h2: ({ children }) => <H2>{children}</H2>,
        h3: ({ children }) => <H3>{children}</H3>,
        normal: ({ children }) => <P>{children}</P>,
      },
    }),
    []
  );

  const showToast = (next: Omit<Extract<ToastState, { open: true }>, "open">) => {
    setToast({ open: true, ...next });
    window.setTimeout(() => setToast({ open: false }), 3000);
  };

  const handleSaveArticle = async () => {
    if (status === "loading") return;

    if (!session) {
      showToast({
        variant: "error",
        message: "Sign in to save articles to your profile.",
      });
      return;
    }

    try {
      const res = await fetch("/api/save-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId: data._id }),
      });

      if (!res.ok) {
        throw new Error("Failed to save the article.");
      }

      showToast({ variant: "success", message: "Saved to your profile." });
    } catch (error) {
      console.error("Error saving article:", error);
      showToast({ variant: "error", message: "Could not save this article." });
    }
  };

  const handleShareArticle = async () => {
    const articleUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: data.title,
          text: "Check out this article on Culturin.",
          url: articleUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(articleUrl);
      showToast({ variant: "info", message: "Link copied to clipboard." });
    } catch (error) {
      console.error("Error sharing article:", error);
      showToast({ variant: "error", message: "Could not share or copy link." });
    }
  };

  return (
    <>
      <Header />
      <Page>
        <Content>
          <article>
            <header>
              <Title>{data.title}</Title>
              {data.summary ? <Lead>{data.summary}</Lead> : null}
            </header>

            {imageUrl ? (
              <Hero>
                <Image
                  src={imageUrl}
                  alt={data.title ? `${data.title} cover image` : "Article cover image"}
                  width={980}
                  height={560}
                  sizes="(max-width: 900px) 100vw, 900px"
                  priority
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: 16,
                    objectFit: "cover",
                  }}
                />
              </Hero>
            ) : null}

            <ArticleBody>
              <PortableText
                value={data.body as any}
                components={portableTextComponents}
              />
            </ArticleBody>

            <ActionRow aria-label="Article actions">
              <ActionButton type="button" onClick={handleSaveArticle}>
                Add to profile
              </ActionButton>
              <ActionButton type="button" onClick={handleShareArticle}>
                Share article
              </ActionButton>
            </ActionRow>
          </article>
        </Content>
      </Page>

      {toast.open ? (
        <Toast role="status" aria-live="polite" data-variant={toast.variant}>
          {toast.message}
        </Toast>
      ) : null}
    </>
  );
}

const Page = styled.main`
  padding: 40px 20px;
  padding-top: 150px;
  display: flex;
  justify-content: center;
  background: black;
  min-height: 100%;
  line-height: 1.75;
  color: white;

  @media ${device.mobile} {
    padding-top: 120px;
  }
`;

const Content = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(28px, 4vw, 44px);
  line-height: 1.12;
`;

const Lead = styled.p`
  margin: 0;
  margin-top: 12px;
  font-size: clamp(16px, 2.2vw, 20px);
  color: rgba(255, 255, 255, 0.88);
`;

const Hero = styled.div`
  width: 100%;
`;

const ArticleBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const P = styled.p`
  margin: 0;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.86);
`;

const H2 = styled.h2`
  margin: 18px 0 0;
  font-size: 22px;
  line-height: 1.25;
`;

const H3 = styled.h3`
  margin: 16px 0 0;
  font-size: 18px;
  line-height: 1.25;
  color: rgba(255, 255, 255, 0.92);
`;

const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 10px;
`;

const ActionButton = styled.button`
  border: 0;
  border-radius: 10px;
  padding: 10px 14px;
  background: white;
  color: black;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background: #d9d9d9;
  }

  &:active {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.85);
    outline-offset: 3px;
  }
`;

const Toast = styled.div`
  position: fixed;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  z-index: 2000;
  max-width: min(720px, calc(100vw - 32px));
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(20, 20, 20, 0.92);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);

  &[data-variant="success"] {
    border-color: rgba(46, 204, 113, 0.35);
  }

  &[data-variant="info"] {
    border-color: rgba(250, 193, 0, 0.35);
  }

  &[data-variant="error"] {
    border-color: rgba(255, 107, 107, 0.35);
  }
`;
