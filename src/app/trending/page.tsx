/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Link from "next/link";
import { ThemeProvider } from "styled-components";
import { device } from "../styles/breakpoints";
import { lightTheme, darkTheme, GlobalStyles } from "../styles/theme";
import { client } from "../lib/sanity";
import { urlFor } from "../lib/sanity";
import Image from "next/image";
import { simpleBlogCard } from "../../../lib/interface";

async function getData() {
  const query = `
  *[_type == "article"] | order(publishedAt desc) {
    title,
    slug,
    summary,
    publishedAt,
    "imageUrl": titleImage.asset->url,
    body
  }
`;
  try {
    const data = await client.fetch(query);
    return data;
  } catch (error) {
    console.error("Failed to fetch data from Sanity:", error);
    return []; // Return an empty array or appropriate error response
  }
}

export default function Trending() {
  const [theme, setTheme] = useState("dark");
  const [blurHash, setBlurHash] = useState(""); // State to hold the blur hash

  const isDarkTheme = theme === "dark";

  const [data, setData] = useState<simpleBlogCard[]>([]);

  useEffect(() => {
    async function fetchData() {
      const fetchedData = await getData();
      setData(fetchedData);
    }
    fetchData();
  }, []);

  console.log(data);

  return (
    <>
      <Header />
      <AppBody>
        <Link href="/" passHref>
          <BackLink>
            <svg
              width="16"
              height="16"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
            {"   "}
            back
          </BackLink>
        </Link>

        <Title>
          <h1>Trending</h1>
        </Title>
        <Subtitle>
          <p>Trending on Culturin </p>
        </Subtitle>

        <ArticlesContainer>
          {data.map((cardData, index) => (
            <Card key={index}>
              <Link href={`/articles/${cardData.currentSlug}`}>
                <CardBody>
                  <Image
                    src={urlFor(cardData.titleImage).url()}
                    alt={cardData.title}
                    placeholder="blur"
                    fill
                    draggable={false}
                    style={{ objectFit: "cover" }}
                    blurDataURL={urlFor(cardData.titleImage).url()}
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
  padding-top: 150px;
  align-items: center;
  background: black;
  flex-direction: column;
  height: 100%;
  line-height: 2;
  color: white;

  @media ${device.mobile} {
    padding-left: 0px;
    padding-top: 80px;
    align-items: left;
  }

  @media ${device.mobile} {
    padding-left: 0px;
    padding-top: 80px;
    align-items: left;
  }
`;

const Title = styled.div`
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: left;
  cursor: pointer;

  @media ${device.mobile} {
    align-items: left;
    margin-left: 0;
    width: 100%;

    h1 {
      font-size: 25px;
      align-items: left;
      margin-left: 40px;
      width: 100%;
    }
  }
`;

const Subtitle = styled.div`
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: left;
  cursor: pointer;

  h3 {
    font-size: 20px;
    margin-bottom: 20px;
    color: grey;
  }

  @media ${device.mobile} {
    padding-left: 10px;
    align-items: left;
  }
`;

const VideoWrapper = styled.div`
  margin: auto;
  width: 60%;
  padding-top: 30px;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: left;
  cursor: pointer;

  p {
    font-size: 18px;
    padding-bottom: 36px;
    color: white;
  }

  @media ${device.mobile} {
    padding-left: 20px;
    align-items: left;
    width: 100%;

    p {
      font-size: 18px;
      padding-bottom: 36px;
      color: white;
    }
  }

  @media ${device.mobile} {
    margin-left: -100px;
    border-radius: 10px;
    width: 300px;
    height: 50%;
    overflow: hidden;
  }
`;

const ArticlesContainer = styled.div`
  margin: auto;
  width: 50%;
  padding-left: 30px;
  padding-top: 20px;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;

  p {
    font-size: 18px;
    padding-bottom: 36px;
    color: white;
  }

  @media ${device.mobile} {
    padding-left: 20px;
    align-items: left;
    width: 100%;

    p {
      font-size: 18px;
      padding-bottom: 36px;
      color: white;
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

const VideoContainer = styled.div`
  padding-bottom: 20px;
  cursor: pointer;
  img {
    border-radius: 10px;
  }

  @media ${device.mobile} {
    margin: 0 auto;
    padding-left: 10px;
    border-radius: 20px;

    img {
      margin-left: 0;
      border-radius: 10px;
      width: 360px;
    }
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
  width: 200px;
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
