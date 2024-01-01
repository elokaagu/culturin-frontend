"use client";
import React from "react";
import styled from "styled-components";
import Header from "../../components/Header";

export default function NorthAmerica() {
  return (
    <>
      <Header />
      <AppBody>
        <CountriesDetails>
          <CountriesTitle>
            <h1>North America</h1>
            <p>Browse Countries</p>
          </CountriesTitle>
          <CountriesList>
            <p>United States of America</p>
            <p>Mexico</p>
            <p>Canada</p>
          </CountriesList>
        </CountriesDetails>
      </AppBody>
    </>
  );
}

const AppBody = styled.div`
  padding: 40px;
  display: flex;
  flex: 1;
  align-items: left;
  background: black;
  flex-direction: column;
  height: 100%;
  line-height: 2;
  color: white;
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
