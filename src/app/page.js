"use client";
import styled from "styled-components";
import React from "react";
import Header from "./components/Header";

export default function Home() {
  return (
    <div>
      <Header />
    </div>
  );
}

export const Title = styled.h1`
  color: white;
`;
