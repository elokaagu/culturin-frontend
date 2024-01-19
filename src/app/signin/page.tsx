"use client";
import React from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Link from "next/link";
import { device } from "../styles/breakpoints";
import Image from "next/image";

export default function Signin() {
  return (
    <>
      <AppBody>
        <AppLeft>
          <Link href="/">
            <Image
              src="/culturin_logo.svg"
              width={250}
              height={250}
              draggable={false}
              alt="culturin logo"
            />
          </Link>
        </AppLeft>
        <AppRight>
          <p>Sign up</p>
        </AppRight>
      </AppBody>
    </>
  );
}

const AppBody = styled.div`
  padding-left: 200px;
  padding-right: 200px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: black;
  flex-direction: row;
  height: 100vh;
  line-height: 2;
  color: white;
  overflow: none;

  @media ${device.mobile} {
    padding-left: 0px;
    padding-top: 80px;
    align-items: left;
  }
`;

const AppLeft = styled.div``;

const AppRight = styled.div``;
