"use client";

import styled from "styled-components";
import React, { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import { device } from "./styles/breakpoints";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, GlobalStyles } from "./styles/theme";
import { Toggle } from "styled-icons/ionicons-outline";

import prisma from "../app/api/auth/[...nextauth]/prisma";

//Session Data

type Session = {
  user: {
    name: string;
    email: string;
    // Add any other properties you expect 'user' to have
  };
  // Add any other properties you expect 'session' to have
};

// Theme Provider

export default function Home() {
  // States

  const [theme, setTheme] = useState("dark");

  const isDarkTheme = theme === "dark";

  // Toggle Theme

  const toggleTheme = () => {
    setTheme(isDarkTheme ? "light" : "dark");
  };

  // Return
  return (
    <>
      <Header />
      <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
        <>
          <GlobalStyles />
          <Body>
            <Row>
              <Title>
                <h2>Explore</h2>
                <Switch>
                  <SwitchItem>
                    <p>Switch modes</p>
                  </SwitchItem>
                  <SwitchItem>
                    <Toggle size={20} onClick={toggleTheme} />
                  </SwitchItem>
                </Switch>
              </Title>
            </Row>

            <Row>
              <Hero />
              <Hero />
              <Hero />
              <Hero />
              <Hero />
            </Row>
            <Row>
              <Hero />
              <Hero />
              <Hero />
              <Hero />
              <Hero />
            </Row>
            <Row>
              <Hero />
              <Hero />
              <Hero />
              <Hero />
              <Hero />
            </Row>
            <Row>
              <Hero />
              <Hero />
              <Hero />
              <Hero />
              <Hero />
            </Row>
          </Body>
        </>
      </ThemeProvider>
    </>
  );
}

const Body = styled.div`
  background: ${(props) => props.theme.body};
  width: 100%;
  height: 100%;
  transition: all 0.25s ease;
`;

const Row = styled.div`
display: flex;
padding: 20px;
flex direction: columnn;
flex: 1;
@media ${device.mobile} {
  padding: 10px;
  overflow: scroll;
  }
`;

const Switch = styled.div`
  padding-top: 40px;
  display: flex;
  align-items: right;
  position: fixed;
  z-index: 200;
  cursor: pointer;
  flex: 1;
  justify-content: flex-end;
  margin-right: 30px;
`;

const SwitchItem = styled.div`
  padding-right: 8px;
`;

const Title = styled.div`
  padding-left: 20px;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
`;
