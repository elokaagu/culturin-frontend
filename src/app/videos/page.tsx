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
import { videoCard } from "../../../lib/interface";

async function getData() {
  const query = `
    *[_type== 'video'] | order(_createdAt desc) {
        title,
        uploader,
        videoThumbnail,
        description,
        "currentSlug":slug.current,
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

export default function Videos() {
  const [theme, setTheme] = useState("dark");
  const [blurHash, setBlurHash] = useState(""); // State to hold the blur hash

  const isDarkTheme = theme === "dark";

  const [data, setData] = useState<videoCard[]>([]);

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
        <Title>
          <h1>Top Videos</h1>
        </Title>
        <Subtitle>
          <p>Only on Culturin </p>
        </Subtitle>

        <VideoContainer>
          {data.map((videoData, index) => (
            <VideoCard key={index}>
              <Link href={`/stream/${videoData.currentSlug}`}>
                <VideoCardBody>
                  <Image
                    src={urlFor(videoData.videoThumbnail).url()}
                    alt={videoData.title}
                    placeholder="blur"
                    fill
                    style={{ objectFit: "cover" }}
                    blurDataURL={urlFor(videoData.videoThumbnail).url()}
                    priority={true}
                  />
                </VideoCardBody>
              </Link>
              <VideoCardText>
                <h1>{videoData.title}</h1>
                <VideoCardAuthor>
                  {" "}
                  <p>{videoData.uploader}</p>
                </VideoCardAuthor>
              </VideoCardText>
            </VideoCard>
          ))}
        </VideoContainer>
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
    margin-top: 20px;
    width: 100%;

    h1 {
      font-size: 25px;
      align-items: left;
      margin-left: 30px;
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
    margin-left: 60px;
    width: 100%;
  }
`;

const VideoContainer = styled.div`
  margin: auto;
  width: 100%;
  padding: 20px 0px;
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
    padding: 10px;
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

const VideoCard = styled.div`
  padding-bottom: 20px;
  padding-right: 20px;
`;

const VideoCardBody = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: left;
  height: 200px;
  width: 400px;
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
    width: 300px;
  }
`;

const VideoCardText = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 20px;

  color: ${(props) => props.theme.title};

  h1 {
    cursor: pointer;
    font-size: 16px;

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

const VideoCardAuthor = styled.div`
  display: flex;
  pointer: cursor;
  flex-direction: row;
  align-items: center;
`;

const AvatarContainer = styled.div`
  display: flex;
  margin-right: 6px;
`;
