"use client";
import React, { useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Link from "next/link";
import { device } from "../styles/breakpoints";
import Feed from "../components/Feed";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, GlobalStyles } from "../styles/theme";

export default function Spotlight() {
  const [theme, setTheme] = useState("dark");

  const isDarkTheme = theme === "dark";
  return (
    <>
      <Header />
      <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
        <GlobalStyles />
        <AppBody>
          <SpotlightTitle>
            <h1> News</h1>
          </SpotlightTitle>
          <FeedContainer>
            <Feed />
            <Feed />
            <Feed />
          </FeedContainer>
        </AppBody>
      </ThemeProvider>
    </>
  );
}

const AppBody = styled.div`
  height: 100%;
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
  margin-left: 320px;

  @media ${device.mobile} {
    align-items: left;
    margin-left: 10px;
  }
`;

const FeedContainer = styled.div`
  @media ${device.mobile} {
    align-items: left;
    margin-left: 20px;
  }
`;
