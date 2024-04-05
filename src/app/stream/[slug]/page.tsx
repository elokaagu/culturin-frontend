"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "../../components/Header";
import { ThemeProvider } from "styled-components";
import Link from "next/link";
import { device } from "../../styles/breakpoints";
import { client, urlFor } from "../../lib/sanity";
import { fullBlog, fullVideo } from "../../../../libs/interface";
import { lightTheme, darkTheme, GlobalStyles } from "../../styles/theme";
import Image from "next/image";
import { url } from "inspector";
import { PortableText } from "@portabletext/react";
import MuxPlayer from "@mux/mux-player-react";

async function getData(slug: string) {
  const query = `
    *[_type == "video" && slug.current == '${slug}'] {
      "currentSlug": slug.current,
        title,
        slug,
        uploader,
        videoThumbnail,
        description,
        "playbackId": video.asset->playbackId
    }[0]`;

  const data = await client.fetch(query);
  return data;
}

export default function Videos({ params }: { params: { slug: string } }) {
  const [data, setData] = useState<fullVideo | null>(null);

  const [theme, setTheme] = useState("dark");
  const [blurHash, setBlurHash] = useState(""); // State to hold the blur hash

  const isDarkTheme = theme === "dark";

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await getData(params.slug);
      setData(fetchedData);
    };

    fetchData();
  }, [params.slug]);

  return (
    <>
      <Header />
      <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
        <>
          <GlobalStyles />
          <AppBody>
            <VideoWrapper>
              <VideoContainer>
                <MuxPlayer
                  playbackId={data?.playbackId}
                  style={{ borderRadius: "20px" }}
                  accent-color="black"
                  metadata={{
                    video_id: data?._id,
                    video_title: data?.title,
                    viewer_user_id: "user-id-dynamic",
                  }}
                />
              </VideoContainer>
              <Title>
                <h1>{data?.title}</h1>
                <span>{data?.uploader}</span>
              </Title>
              <Subtitle>
                <p>{data?.description}</p>
              </Subtitle>
            </VideoWrapper>
          </AppBody>
        </>
      </ThemeProvider>
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
      margin-left: 10px;
      width: 100%;
    }

    span {
      font-size: 18px;
      color: grey;
      padding-left: 10px;
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

  span {
    font-size: 18px;
    color: grey;
  }

  p {
    font-size: 18px;
    color: white;
  }

  @media ${device.mobile} {
    padding-left: 20px;
    align-items: left;
    width: 100%;

    p {
      font-size: 16px;
      color: white;
      // display: -webkit-box;
      // -webkit-line-clamp: 2;
      // -webkit-box-orient: vertical;
      // overflow: hidden;
      // text-overflow: ellipsis;
    }
  }

  @media ${device.mobile} {
    margin-left: 0px;
    border-radius: 10px;
    width: 100%;
    height: 50%;
    overflow: hidden;
  }
`;

const VideoContainer = styled.div`
  padding-bottom: 20px;
  cursor: pointer;
  img {
    border-radius: 10px;
  }

  @media ${device.mobile} {
    width: 100%;
    img {
      margin-left: 0;
    }
  }
`;
