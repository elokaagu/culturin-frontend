"use client";
import React from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Link from "next/link";
import { device } from "../styles/breakpoints";

export default function Assistant() {
  return (
    <>
      <Header />
      <AppBody>
        <AssistantTitle>
          <h1>AI</h1>
        </AssistantTitle>
        <AssistantDetails>
          <p>How can I help ?</p>
        </AssistantDetails>
      </AppBody>
    </>
  );
}

const AppBody = styled.div`
  padding: 40px;
  display: flex;
  padding-top: 150px;
  align-items: left;
  background: black;
  flex-direction: column;
  height: 100%;
  line-height: 2;
  color: white;

  @media ${device.mobile} {
    padding-left: 0px;
    padding-top: 80px;
    align-items: left;
  }
`;

const AssistantTitle = styled.div`
  cursor: pointer;
  padding: 20px;
`;

const AssistantDetails = styled.div`
  cursor: pointer;
  padding: 20px;

  background: #1e1e1e;
  border-radius: 10px;
  width: 50%;
`;
