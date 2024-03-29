"use client";
import React, { useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Link from "next/link";
import { ThemeProvider } from "styled-components";
import { device } from "../styles/breakpoints";
import ChatComponent from "../components/ChatComponent";
import { lightTheme, darkTheme, GlobalStyles } from "../styles/theme";

export default function Assistant() {
  const [theme, setTheme] = useState("dark");

  const isDarkTheme = theme === "dark";
  return (
    <>
      <Header />
      <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
        <GlobalStyles />
        <AppBody>
          <AssistantTitle>
            <h1>Atlas</h1>
          </AssistantTitle>
          <ChatAssistant>
            <ChatComponent />
          </ChatAssistant>
        </AppBody>
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
`;

const AssistantTitle = styled.div`
  cursor: pointer;
  padding-bottom: 20px;

  @media ${device.mobile} {
    align-items: left;
    margin-left: 40px;
    width: 100%;
  }
`;

const ChatAssistant = styled.div`
  width: 50%;
  @media ${device.mobile} {
    align-items: left;
    margin-left: 40px;
    width: 100%;
  }
`;
