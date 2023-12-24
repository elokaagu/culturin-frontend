"use client";
import styled from "styled-components";
import React from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";

export default function Create() {
  return (
    <div>
      <Header />
      <AppBody>
        <h1>Create</h1>
        <CreateResults>
          <p>Upload a post</p>
        </CreateResults>
      </AppBody>
    </div>
  );
}

const AppBody = styled.div`
  padding: 20px;
  display: flex;
  flex: 1;
  align-items: center;
  background: black;
  flex-direction: column;
  height: 100vh;
  line-height: 2;
  color: white;
`;

const CreateResults = styled.div`
  margin: 20px auto;
  flex-direction: row;
  align-items: left;
  border-radius: 20px;
  padding: 20px;
  border: 2px solid #262627;
  background-color: transparent;
  font-weight: 300;
  cursor: pointer;
  display: flex;
  color: white;
`;
