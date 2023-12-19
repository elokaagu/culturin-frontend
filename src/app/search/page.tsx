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

const AppBody = styled.div`
  padding: 20px;
  display: flex;
  background: black;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  ${
    "" /* margin-left: 40px;
  margin-right: 40px; */
  }
  line-height: 2;
`;
