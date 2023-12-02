"use client";
import styled from "styled-components";
import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";

export default function Home() {
  return (
    <div>
      <Header />
      <Body>
        <Hero />
        <Hero />
        <Hero />
      </Body>
    </div>
  );
}

export const Title = styled.h1`
  color: white;
`;

export const Body = styled.div`
  margin-top: 60px;
  display: flex;
  flex-direction: row;
  margin-left: 20px;
  margin-right: 40px;
`;
