"use client";
import styled from "styled-components";
import Header from "../../components/Header";
import MapGl from "../../components/Map";
import { device } from "../../styles/breakpoints";
import React, { useState } from "react";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, GlobalStyles } from "../../styles/theme";

export default function Africa() {
  const [theme, setTheme] = useState("dark");

  const isDarkTheme = theme === "dark";

  return (
    <>
      <Header />
      <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
        <GlobalStyles />

        <AppBody>
          <CountryContainer>
            <CountriesDetails>
              <CountriesTitle>
                <h1>Africa</h1>
                <p>Browse Countries</p>
              </CountriesTitle>
              <CountriesList>
                <p>Nigeria</p>
                <p>Niger</p>
                <p>Kenya</p>
                <p>Ethiopia</p>
                <p>Uganda</p>
                <p>Rwanda</p>
                <p>Zambia</p>
                <p>Zimbabwe</p>
              </CountriesList>
            </CountriesDetails>
          </CountryContainer>
          <MapBody>
            <MapGl continent="africa" />
          </MapBody>
        </AppBody>
      </ThemeProvider>
    </>
  );
}

const AppBody = styled.div`
  padding: 40px;
  display: flex;
  flex-direction: row;
  jusitfy-content: space-between;
  flex: 1;
  padding-top: 150px;
  align-items: left;
  background: black;
  height: 100%;
  line-height: 2;
  color: white;
  overflow: hidden;

  @media ${device.mobile} {
    flex-direction: column;
    align-items: center;
  }
`;

const CountryContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
`;

const CountriesDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  border: 2px solid #222;
  border-radius: 15px;
  width: 320px;
  &:hover {
    opacity: 0.8;
    background: #111;
    transition: 0.3s ease-in-out;
  }
`;

const CountriesList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  cursor: pointer;
`;

const CountriesTitle = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const MapBody = styled.div`
  margin: 20px;
  border-radius: 15px;
`;
