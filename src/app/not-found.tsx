"use client";

import styled from "styled-components";
import React, { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import { device } from "./styles/breakpoints";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, GlobalStyles } from "./styles/theme";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function NotFoundPage() {
  // States
  const { data: session } = useSession();

  const [theme, setTheme] = useState("dark");
  const [isNavOpen, setIsNavOpen] = useState(false); // Define isNavOpen state

  const isDarkTheme = theme === "dark";

  // Toggle Theme
  const toggleTheme = () => {
    setTheme(isDarkTheme ? "light" : "dark");
  };

  // Dymamic imports

  // Return
  return (
    <>
      <Header />
      <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
        <>
          <GlobalStyles />
          <Body>
            <HeroSection>
              <HeroContainer>
                <HeroTitle>
                  <h1>Uh Oh!</h1>
                  <p>You have hit the error page</p>
                  <Link href="/">
                    <HeroButton>Home</HeroButton>
                  </Link>
                </HeroTitle>
              </HeroContainer>
            </HeroSection>
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
    padding-top: 120px;
  }
`;

const HeroSection = styled.div`
  // height: 50vh;
  // display: flex;
  // padding: 20px;
  // background-color: black;
  // flex direction: column;
  // flex: 1;
  height: 50vh;
  display: flex;
  justify-content: center; // This will center the child horizontally
  align-items: center; // This will center the child vertically
  padding: 20px;
  background-color: black;
  flex-direction: column;
  position: relative; // Only necessary if you are absolutely positioning any children
`;

const HeroContainer = styled.div`
  height: 50vh;
  display: flex;
  padding: 20px;
  width: 95%;

  border-radius: 10px;
  flex-direction: column;
  position: relative; // To position elements within it absolutely
  justify-content: center; // Center the content vertically
  align-items: center; // Center the content horizontally
  background-color: black;
  // background-image: url("https://www.forbes.com/advisor/wp-content/uploads/2021/03/traveling-based-on-fare-deals.jpg");
  background-size: cover; // Cover the entire area of the div
  background-position: center; // Center the background image
  color: white; // Assuming you want a light text over a dark image
`;

const HeroTitle = styled.div`
  margin: auto 10px;
  padding-left: auto;
  padding-top: 20px;
  padding-right: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  cursor: pointer;
  z-index: 2;

  h1 {
    margin-bottom: 20px;
  }

  @media ${device.mobile} {
    padding-left: 0px;
  }
`;

const HeroButton = styled.div`
  margin-top: 20px;
  border-radius: 5px;
  width: 100px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  color: black;
  font-weight: 600;
  cursor: pointer;
  background: ${(props) => props.theme.title};
  color: ${(props) => props.theme.body};

  &:hover {
    background: grey;
    transition: 0.3s ease-in-out;
  }

  @media ${device.mobile} {
    width: 100px;
  }
`;
