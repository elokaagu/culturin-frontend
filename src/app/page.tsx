"use client";

import styled from "styled-components";
import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import { device } from "./styles/breakpoints";

import prisma from "../app/api/auth/[...nextauth]/prisma";

type Session = {
  user: {
    name: string;
    email: string;
    // Add any other properties you expect 'user' to have
  };
  // Add any other properties you expect 'session' to have
};

export default function Home() {
  return (
    <>
      <Header />
      <Body>
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
  );
}

const Body = styled.div`
  ${"" /* margin-top: 60px; */}
  ${
    "" /* margin-left: 20px;
  margin-right: 40px; */
  }
  background: black;
  width: 100%;
  height: 100%;
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
