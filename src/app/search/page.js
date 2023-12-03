"use client";
import styled from "styled-components";
import React from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";

export default function Search() {
  return (
    <div>
      <Header />
      <AppBody>
        <SearchBar />
      </AppBody>
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

const AppBody = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  width: 100%;
  ${
    "" /* margin-left: 40px;
  margin-right: 40px; */
  }
  line-height: 2;
`;
