"use client";
import React, { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { device } from "../styles/breakpoints";
import Image from "next/image";
import { GoogleSignInButton } from "../components/AuthButtons";
import dynamic from "next/dynamic";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, GlobalStyles } from "../styles/theme";
import { GetStaticProps, GetStaticPaths } from "next";

export default function Signin() {
  const [theme, setTheme] = useState("dark");

  const isDarkTheme = theme === "dark";
  return (
    <>
      <AppBody>
        <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
          <GlobalStyles />

          <AppLeft>
            <Link href="/">
              <Image
                src="/culturin_logo.svg"
                width={200}
                height={200}
                draggable={false}
                alt="culturin logo"
                priority={true}
              />
            </Link>
          </AppLeft>
          <AppRight>
            <Title>
              <h1>Explore the art of Culturin</h1>
              <p>Join today.</p>
            </Title>
            <SignInSection>
              <SigninButton>
                <p>Sign up</p>
              </SigninButton>
              <GoogleSignInButton
                showDropdown={true}
                toggleDropdownButton={() => {}}
              />
            </SignInSection>
          </AppRight>
        </ThemeProvider>
      </AppBody>
    </>
  );
}

const AppBody = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: black;
  flex-direction: row;
  height: 100vh;
  color: white;
  overflow: none;

  @media ${device.mobile} {
    align-items: left;
    display: flex;
    flex-direction: column;
    height: 100vw;

    img {
      margin-top: 100px;
      align-items: left;
      margin-left: 0px;
    }
  }
`;

const AppLeft = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  img {
    margin-left: 200px;
  }

  @media ${device.mobile} {
    align-items: left;
    width: 100%;

    img {
      margin-top: 100px;
      align-items: left;
      margin-left: 40px;
    }
  }
`;

const AppRight = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  align-items: center;

  @media ${device.mobile} {
    align-items: left;
  }
`;

const SignInSection = styled.div`
  width: 40%;
  align-items: center;

  @media ${device.mobile} {
    align-items: left;
    width: 100%;
    margin-left: 65px;
  }
`;

const SigninButton = styled.div`
  border-radius: 999px;
  width: 100%;
  ${"" /* border: 1px solid white; */}
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: 10px;
  margin-bottom: 10px;
  padding-right: 10px;
  background-color: #1d9bf0;
  color: white;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: grey;
    transition: 0.3s ease-in-out;
  }

  @media ${device.mobile} {
    width: 100px;
  }
`;

const Title = styled.div`
  display: flex;
  padding-bottom: 20px;
  flex-direction: column;
  align-items: left;
  width: 40%;
  cursor: pointer;

  h2 {
    margin-bottom: 10px;
  }

  @media ${device.mobile} {
    align-items: left;
    width: 80%;
  }
`;
