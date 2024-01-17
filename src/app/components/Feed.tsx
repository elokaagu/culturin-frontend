"use client";
import React from "react";
import styled from "styled-components";

export default function Feed() {
  return (
    <AppBody>
      <FeedContainer>
        <h1>Hello</h1>
        <p>This is the feed</p>
      </FeedContainer>
    </AppBody>
  );
}

const AppBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 50px;
`;

const FeedContainer = styled.div`
  padding: 20px;
  border-radius: 10px;
  background-color: black;
  border: 1px solid #222222;
  cursor: pointer;
  width: 50%;
  &:hover {
    background: #222222;
    transition: 0.3s ease-in-out;
  }
`;
