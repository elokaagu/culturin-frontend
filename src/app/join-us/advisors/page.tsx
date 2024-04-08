"use client";
import styled from "styled-components";
import React, { useState } from "react";
import Header from "../../components/Header";
import SearchBar from "../../components/SearchBar";
import { ChevronDown } from "styled-icons/boxicons-regular";
import { Plus } from "styled-icons/boxicons-regular";
import { Share } from "styled-icons/boxicons-regular";
import Link from "next/link";
import { device } from "../../styles/breakpoints";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, GlobalStyles } from "../../styles/theme";

export default function Advisors() {
  const [theme, setTheme] = useState("dark");

  const isDarkTheme = theme === "dark";
  return (
    <div>
      <Header />
      <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
        <GlobalStyles />
        <AppBody>
          <AdvisorTitle>
            <h1>Get started</h1>
            <p>This will be where the partnerships start</p>
          </AdvisorTitle>
          <Link
            href="/assistant"
            style={{
              textDecoration: "none",
            }}
          >
            <AdvisorResults>
              <p>Make your itinerary</p> <Share size="20" />
            </AdvisorResults>
          </Link>
        </AppBody>
      </ThemeProvider>
    </div>
  );
}

const AppBody = styled.div`
  padding: 20px;
  padding-top: 150px;
  display: flex;
  flex: 1;
  align-items: center;
  background: black;
  flex-direction: column;
  height: 100%;
  line-height: 2;
  color: white;
`;

const AdvisorResults = styled.div`
  flex-direction: row;
  align-items: center;
  border-radius: 15px;
  justify-content: space-between;
  padding: 20px;
  border: 2px solid #262627;
  background-color: transparent;
  font-weight: 300;
  cursor: pointer;
  display: flex;
  color: white;
  width: 350px;
  margin: 20px;
  &:hover {
    background: #222222;
    transition: 0.3s ease-in-out;
  }

  a {
    text-decoration: none;
    color: black;
  }
`;

const AdvisorTitle = styled.div`
  align-items: center;

  @media ${device.mobile} {
    align-items: left;
    margin-left: 0;
    width: 100%;
  }
`;
