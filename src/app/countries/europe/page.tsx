"use client";
import React from "react";
import styled from "styled-components";
import Header from "../../components/Header";

export default function Europe() {
  return (
    <>
      <Header />
      <AppBody>
        <CountriesDetails>
          <CountriesTitle>
            <h1>Europe</h1>
            <p>Browse Countries</p>
          </CountriesTitle>
          <CountriesList>
            <p>UK</p>
            <p>France</p>
            <p>Spain</p>
            <p>The Netherlands</p>
            <p>Portugal</p>
            <p>Austria</p>
            <p>Germany</p>
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
  padding-top: 150px;
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
