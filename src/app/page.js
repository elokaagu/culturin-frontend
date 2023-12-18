"use client";
import styled from "styled-components";
import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import { device } from "./styles/breakpoints";

export default function Home() {
  // Initializing useState() hook

  return (
    <div>
      <Header />
      <Body>
        <Row>
          <Hero />
          <Hero />
          <Hero />
        </Row>
        <Row>
          <Hero />
          <Hero />
          <Hero />
        </Row>
      </Body>
    </div>
  );
}

export const Title = styled.h1`
  color: white;
`;

export const Body = styled.div`
  ${"" /* margin-top: 60px; */}
  ${
    "" /* margin-left: 20px;
  margin-right: 40px; */
  }
  background: black;
  width: 100%;
  height: 100%;
`;

export const Row = styled.div`
display: flex;
flex direction: columnn;
flex: 1;

`;
