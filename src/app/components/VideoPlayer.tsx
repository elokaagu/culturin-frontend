"use client";
import React from "react";
import styled from "styled-components";
import ReactPlayer from "react-player";

const VideoPlayer = () => {
  let videosrc = "https://www.youtube.com/watch?v=IX8reBGLQFk";

  return (
    <AppBody>
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
    </AppBody>
  );
};

export default VideoPlayer;

const AppBody = styled.div``;
