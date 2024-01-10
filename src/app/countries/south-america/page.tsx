"use client";
import React from "react";
import styled from "styled-components";
import Header from "../../components/Header";
import MapGl from "../../components/Map";

export default function SouthAmerica() {
  return (
    <>
      <Header />
      <AppBody>
        <CountryContainer>
          <CountriesDetails>
            <CountriesTitle>
              <h1>South America</h1>
              <p>Browse Countries</p>
            </CountriesTitle>
            <CountriesList>
              <p>Brazil</p>
              <p>Argentina</p>
              <p>Chile</p>
              <p>Ecuador</p>
              <p>Peru</p>
              <p>Bolivia</p>
            </CountriesList>
          </CountriesDetails>
        </CountryContainer>
        <MapBody>
          <MapGl continent="southAmerica" />
        </MapBody>
      </AppBody>
    </>
  );
}

const AppBody = styled.div`
  padding: 40px;
  display: flex;
  margin: 0 auto;
  flex: 1;
  align-items: left;
  background: black;
  flex-direction: row;
  height: 100%;
  line-height: 2;
  padding-top: 150px;
  color: white;
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
  position: relative;
  margin: 20px;
  border-radius: 15px;
`;
