"use client";
import React from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Link from "next/link";
import { device } from "../styles/breakpoints";
import Feed from "../components/Feed";

export default function Spotlight() {
  return (
    <>
      <Header />
      <AppBody>
        <SpotlightTitle>
          <h1>My Spotlight</h1>
        </SpotlightTitle>
        <FeedContainer>
          <Feed />
        </FeedContainer>
      </AppBody>
    </>
  );
}

const AppBody = styled.div`
  padding: 40px;
  display: flex;
  padding-top: 150px;
  align-items: left;
  background: black;
  flex-direction: column;
  height: 100%;
  line-height: 2;
  color: white;
  overflow: none;

  @media ${device.mobile} {
    padding-left: 0px;
    padding-top: 80px;
    align-items: left;
  }
`;

const SpotlightTitle = styled.div`
  cursor: pointer;
  padding: 10px;
`;

const FeedContainer = styled.div``;
