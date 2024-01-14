"use client";
import React from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Link from "next/link";
import { device } from "../styles/breakpoints";

export default function Profile() {
  return (
    <>
      <Header />
      <AppBody>
        <h1>Profile</h1>
      </AppBody>
    </>
  );
}

const AppBody = styled.div`
  padding: 40px;
  display: flex;
  padding-top: 150px;
  align-items: center;
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
