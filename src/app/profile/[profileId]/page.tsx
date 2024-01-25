"use client";
import React, { useState } from "react";
import styled from "styled-components";
import Header from "../../components/Header";
import Link from "next/link";
import { device } from "../../styles/breakpoints";
import ProfileCard from "../../components/ProfileCard";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, GlobalStyles } from "../../styles/theme";

export default function Profile() {
  const [theme, setTheme] = useState("dark");

  const isDarkTheme = theme === "dark";
  return (
    <>
      <Header />
      <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
        <GlobalStyles />
        <AppBody>
          <ProfileTitle>
            <h1>My Profile</h1>
          </ProfileTitle>
          <Row>
            <ProfileCard />
          </Row>
        </AppBody>
      </ThemeProvider>
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

const ProfileTitle = styled.div`
  cursor: pointer;
  padding: 10px;
`;

const Row = styled.div`
  overflow: scroll;
`;
