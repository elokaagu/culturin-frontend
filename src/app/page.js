"use client";
import styled from "styled-components";
import React from "react";

export default function Home() {
  return (
    <div>
      <Title>Culturin</Title>
      <p>Where inspiration, meets exploration</p>
    </div>
  );
}

export const Title = styled.h1`
  color: white;
`;
