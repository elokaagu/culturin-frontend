"use client";

import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Link from "next/link";
import { device } from "../styles/breakpoints";
import { CldImage } from "next-cloudinary";

export default function Posts() {
  const cmsBaseUrl = useMemo(() => {
    return (
      process.env.NEXT_PUBLIC_CMS_BASE_URL?.replace(/\/$/, "") ||
      "http://localhost:4000"
    );
  }, []);

  const [heading, setHeading] = useState<string>("");
  const [message, setMessage] = useState<string>("Loading…");

  useEffect(() => {
    const controller = new AbortController();

    const url = `${cmsBaseUrl}/api/pages/65b25faecac4c3b01971d7d2?locale=undefined&draft=false&depth=1`;

    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setHeading(data.layout[0].heading);
        setMessage(data.layout[0].text);
      })
      .catch((error) => {
        if (error?.name === "AbortError") return;
        console.error("Error fetching data:", error);
        setMessage("Unable to load this article right now.");
      });

    return () => controller.abort();
  }, [cmsBaseUrl]);

  return (
    <>
      <Header />
      <Page>
        <Content>
          <TopBar>
            <BackLink href="/" aria-label="Back to home">
              <BackIcon aria-hidden="true" viewBox="0 0 12 12">
                <path
                  d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                />
              </BackIcon>
              Back
            </BackLink>
          </TopBar>

          <section aria-labelledby="article-heading">
            <ArticleTitle id="article-heading">{heading || "Articles"}</ArticleTitle>
            <Lead>{message}</Lead>
          </section>

          <Hero>
            <CldImage
              src="https://res.cloudinary.com/drfkw9rgh/image/upload/v1704889319/hdfbvawg6isdoft0sghq.jpg"
              alt="Enugu cultural scene"
              placeholder="blur"
              width={980}
              height={560}
              sizes="(max-width: 900px) 100vw, 900px"
              blurDataURL="https://res.cloudinary.com/drfkw9rgh/image/upload/v1704889319/htsnt5rzrvjcfnrixbqy.jpg"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "cover",
                borderRadius: 16,
              }}
              draggable={false}
            />
          </Hero>

          <ArticleBody>
            <p>
              Enugu, often referred to as the &quot;Coal City State,&quot; is a
              Nigerian city that boasts a diverse and vibrant cultural heritage.
              Located in the southeastern region of Nigeria, Enugu is not only
              known for its historical significance but also for the tapestry of
              cultures that have woven together to create a unique cultural
              identity. One of the most prominent aspects of Enugu&apos;s cultural
              heritage is its rich history. The city served as the capital of the
              short-lived Republic of Biafra during the Nigerian Civil War, making
              it a symbol of resilience and determination in the face of
              adversity. Visitors can explore the remnants of this turbulent period
              through various museums and memorials, gaining insight into the
              city&apos;s historical struggles and triumphs. Enugu&apos;s cultural
              heritage is also deeply intertwined with its indigenous people,
              primarily the Igbo.
            </p>
            <p>
              The Igbo culture is celebrated through colorful festivals, dances,
              and traditional ceremonies. One such event is the New Yam Festival,
              known as &quot;Iri Ji Ohuru&quot; in Igbo, which is a time-honored
              tradition where the people of Enugu come together to thank the gods
              for a bountiful harvest. The festival is characterized by music,
              dance, masquerades, and feasting, showcasing the cultural richness of
              the Igbo people. Music and dance play a significant role in
              Enugu&apos;s cultural heritage. The city is known for its traditional
              music, which often features drums, flutes, and other indigenous
              instruments. The high-energy dances like &quot;Ogene&quot; and
              &quot;Ekwe&quot; are performed at various cultural events and
              ceremonies, bringing people together and preserving the cultural
              identity of the region. Enugu also boasts a culinary heritage that
              reflects its cultural diversity. The city&apos;s cuisine is a fusion
              of traditional Igbo dishes and influences from neighboring ethnic
              groups. Visitors can savor delicious meals such as &quot;Nsala&quot;
              (white soup), &quot;Oha&quot; soup, and &quot;Ugba&quot; (oil bean
              seed) garnished with palm oil and spices, providing a delightful
              gastronomic experience.
            </p>
            <p>
              In conclusion, Enugu&apos;s cultural heritage is a tapestry of history,
              tradition, music, dance, and culinary delights. The city&apos;s
              resilience, rich Igbo culture, and diverse influences make it a
              fascinating destination for those seeking to explore Nigeria&apos;s
              cultural diversity. Enugu invites you to experience its heritage,
              welcoming you with open arms and a vibrant cultural embrace.
            </p>
          </ArticleBody>
        </Content>
      </Page>
    </>
  );
}

const Page = styled.main`
  padding: 40px 20px;
  padding-top: 150px;
  display: flex;
  justify-content: center;
  background: ${(props) => props.theme.body};
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

const TopBar = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: rgb(250, 193, 0);
  text-decoration: none;
  font-weight: 600;

  &:hover {
    color: white;
    transition: color 0.2s ease-in-out;
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.85);
    outline-offset: 3px;
    border-radius: 8px;
  }
`;

const BackIcon = styled.svg`
  width: 16px;
  height: 16px;
`;

const ArticleTitle = styled.h1`
  margin: 0;
  font-size: clamp(28px, 4vw, 40px);
  line-height: 1.15;
`;

const Lead = styled.p`
  margin: 0;
  margin-top: 10px;
  font-size: clamp(16px, 2.2vw, 20px);
  color: rgba(255, 255, 255, 0.88);
`;

const Hero = styled.div`
  width: 100%;
`;

const ArticleBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;

  p {
    margin: 0;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.86);
  }
`;
