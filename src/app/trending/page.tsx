/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Link from "next/link";
import { device } from "../styles/breakpoints";
import Image from "next/image";
import { simpleBlogCard } from "../../libs/interface";

import { getCmsBrowserClient } from "../../lib/cms/browser";
import { listBlogs } from "../../lib/cms/queries";

export default function Trending() {
  const [data, setData] = useState<simpleBlogCard[]>([]);

  useEffect(() => {
    async function fetchData() {
      const db = getCmsBrowserClient();
      if (!db) return;
      setData(await listBlogs(db));
    }
    void fetchData();
  }, []);

  return (
    <>
      <Header />
      <AppBody>
            <Title>
              <h1>Trending</h1>
            </Title>
            <Subtitle>
              <p>Trending on Culturin </p>
            </Subtitle>

            <ArticlesContainer>
              {data
                .filter((c) => Boolean(c.titleImageUrl))
                .map((cardData) => (
                <Card key={cardData.currentSlug}>
                  <Link href={`/articles/${cardData.currentSlug}`}>
                    <CardBody>
                      <Image
                        src={cardData.titleImageUrl as string}
                        alt={cardData.title}
                        placeholder="blur"
                        fill
                        draggable={false}
                        style={{ objectFit: "cover" }}
                        blurDataURL={cardData.titleImageUrl as string}
                        priority={true}
                      />
                    </CardBody>
                  </Link>
                  <CardText>
                    <h1>{cardData.title}</h1>
                    <CardAuthor>
                      {/* <AvatarContainer>
            <Image
              src="/eloka.jpeg"
              alt="elokaagu"
              priority={true}
              width={25}
              height={25}
              style={imageStyle}
            />
          </AvatarContainer> */}
                      <p>{cardData.summary}</p>
                    </CardAuthor>
                  </CardText>
                </Card>
              ))}
            </ArticlesContainer>
      </AppBody>
    </>
  );
}

const AppBody = styled.div`
  padding: 40px;
  display: flex;
  padding-top: var(--header-offset);
  align-items: center;
  background: black;
  flex-direction: column;
  height: 100%;
  line-height: 2;
  color: white;

  @media ${device.mobile} {
    padding-left: 0px;
    align-items: flex-start;
  }
`;

const Title = styled.div`
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  cursor: pointer;

  @media ${device.mobile} {
    align-items: flex-start;
    margin-left: 0;
    margin-top: 20px;
    width: 100%;

    h1 {
      font-size: 25px;
      align-items: flex-start;
      margin-left: 30px;
      width: 100%;
    }
  }
`;

const Subtitle = styled.div`
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  cursor: pointer;

  h3 {
    font-size: 20px;
    margin-bottom: 20px;
    color: grey;
  }

  @media ${device.mobile} {
    margin-left: 60px;
    width: 100%;
  }
`;

const ArticlesContainer = styled.div`
  margin: auto;
  width: 80%;
  padding: 20px 30px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  justify-items: center;
  align-items: start;

  h1 {
    font-size: 25px;
    color: white;
    width: 100%;
  }

  p {
    font-size: 18px;
    color: white;
    width: 100%;
  }

  @media ${device.mobile} {
    width: 100%;
    padding: 20px;
    grid-template-columns: 1fr;

    h1 {
      font-size: 25px;
      color: white;
      width: 70%;
    }
    p {
      font-size: 18px;
      color: white;
      width: 70%;
    }
  }
`;

const BackLink = styled.a`
  color: rgb(250, 193, 0);
  padding-bottom: 20px;
  text-decoration: none;
  position: fixed;
  left: 50px;
  top: 200px;

  :hover {
    color: white;
    cursor: pointer;
    transition: all 0.5s ease-in-out;
  }

  @media ${device.mobile} {
    // position: fixed;
    // left: 20px;
    // top: 105px;
    display: none;
  }
`;

const Card = styled.div`
  padding-bottom: 20px;
  padding-right: 20px;
`;

const CardBody = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: left;
  height: 300px;
  width: 300px;
  padding: 20px;
  border-radius: 8px;
  drop-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
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
    background-color: #4444;
    opacity: 0.4;
    transform: scale(0.98);
    transition: 0.3s ease-in-out;
  }

  @media ${device.laptop} {
    height: 200px;
    width: 200px;
  }

  @media ${device.mobile} {
    height: 200px;
    width: 200px;
  }
`;

const CardText = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 20px;

  color: ${(props) => props.theme.body};

  h1 {
    cursor: pointer;
    font-size: 16px;
    padding-bottom: 10px;

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
    -webkit-line-clamp: 2;

    color: ${(props) => props.theme.subtitle};

    @media ${device.laptop} {
      font-size: 12px;
      color: grey;
    }

    @media ${device.mobile} {
      font-size: 12px;
    }
  }

  span {
    cursor: pointer;
    font-size: 14px;

    @media ${device.laptop} {
      font-size: 12px;
    }
  }
`;

const CardAuthor = styled.div`
  display: flex;
  pointer: cursor;
  flex-direction: row;
  align-items: center;
`;

const AvatarContainer = styled.div`
  display: flex;
  margin-right: 6px;
`;
