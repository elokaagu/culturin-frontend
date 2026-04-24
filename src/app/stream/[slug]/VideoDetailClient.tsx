"use client";

import React from "react";
import styled from "styled-components";
import MuxPlayer from "@mux/mux-player-react";

import Header from "../../components/Header";
import { device } from "../../styles/breakpoints";
import type { fullVideo } from "../../../libs/interface";

export default function VideoDetailClient({ data }: { data: fullVideo }) {
  return (
    <>
      <Header />
      <AppBody>
        <VideoWrapper>
          <VideoContainer>
            <MuxPlayer
              playbackId={data.playbackId || undefined}
              style={{ borderRadius: "20px" }}
              accent-color="black"
              metadata={{
                video_id: data._id ?? "",
                video_title: data.title ?? "",
                viewer_user_id: "user-id-dynamic",
              }}
            />
          </VideoContainer>
          <Title>
            <h1>{data.title}</h1>
            <span>{data.uploader}</span>
          </Title>
          <Subtitle>
            <p>{data.description}</p>
          </Subtitle>
        </VideoWrapper>
      </AppBody>
    </>
  );
}

const AppBody = styled.div`
  padding: 40px;
  display: flex;
  padding-top: var(--header-offset);
  align-items: center;
  background: ${({ theme }) => theme.body};
  flex-direction: column;
  height: 100%;
  line-height: 2;
  color: ${({ theme }) => theme.title};

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
  color: ${({ theme }) => theme.title};

  h1 {
    color: inherit;
  }

  @media ${device.mobile} {
    align-items: flex-start;
    margin-left: 0;
    width: 100%;

    h1 {
      font-size: 25px;
      align-items: flex-start;
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
  align-items: flex-start;
  cursor: pointer;

  h3 {
    font-size: 20px;
    margin-bottom: 20px;
    color: grey;
  }

  @media ${device.mobile} {
    padding-left: 10px;
    align-items: flex-start;
  }
`;

const VideoWrapper = styled.div`
  margin: auto;
  width: 60%;
  padding-top: 30px;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  cursor: pointer;

  span {
    font-size: 18px;
    color: grey;
  }

  p {
    font-size: 18px;
    color: ${({ theme }) => theme.title};
  }

  @media ${device.mobile} {
    padding-left: 20px;
    align-items: flex-start;
    width: 100%;

    p {
      font-size: 16px;
      color: ${({ theme }) => theme.title};
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
