"use client";
import React from "react";
import styled from "styled-components";
import ReactPlayer from "react-player";
import { device } from "../styles/breakpoints";

const VideoPlayer = () => {
  let videosrc = "https://www.youtube.com/watch?v=IX8reBGLQFk";

  return (
    <AppBody>
      <VideoWrapper>
        <ReactPlayer
          url={videosrc}
          width={700}
          height={500}
          controls={false}
          playing={true}
          muted={true}
          modestbranding={true}
          loop={true}
        />
        <source src={videosrc} type="video/mp4" />
      </VideoWrapper>
    </AppBody>
  );
};

export default VideoPlayer;

const AppBody = styled.div``;

const VideoWrapper = styled.div`
  @media ${device.mobile} {
    margin-left: -100px;
    border-radius: 10px;
    width: 300px;
    height: 50%;
    overflow: hidden;
  }
`;
