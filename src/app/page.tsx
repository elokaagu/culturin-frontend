"use client";

import styled from "styled-components";
import React, { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import { device } from "./styles/breakpoints";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, GlobalStyles } from "./styles/theme";
import { Toggle } from "styled-icons/ionicons-outline";
import Sidebar from "./components/Sidebar";

// import prisma from "../app/api/auth/[...nextauth]/prisma";

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
  const [isNavOpen, setIsNavOpen] = useState(false); // Define isNavOpen state

  const isDarkTheme = theme === "dark";

  // Toggle Theme

  const toggleTheme = () => {
    setTheme(isDarkTheme ? "light" : "dark");
  };

  // Sign up or Sign in

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
                <h3>Explore</h3>

                <p>Discover a new world of travel, inspiration and culture</p>
              </Title>

              <Switch>
                <SwitchItem>
                  <Toggle size={20} onClick={toggleTheme} />
                </SwitchItem>
              </Switch>
            </Row>
            <Row>
              <Hero />
            </Row>
            <Row>
              <Hero />
            </Row>
            <Row>
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
  padding-top: 150px;
  transition: all 0.25s ease;

  @media ${device.mobile} {
    padding-top: 100px;
  }
`;

const Row = styled.div`
display: flex;
padding: 20px;
flex direction: column;
flex: 1;
overflow: scroll;
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
  position: fixed;
  right: 40px;
  bottom: 20px;
`;

const Title = styled.div`
  margin: auto 10px;
  padding-left: 30px;
  padding-top: 20px;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: left;
  width: 100%;
  cursor: pointer;

  h3 {
    font-size: 20px;
    margin-bottom: 10px;
  }

  @media ${device.mobile} {
    padding-left: 0px;
  }
`;

const SidebarMobile = styled.div`
  display: none;
  @media ${device.mobile} {
    display: block;
  }
`;
