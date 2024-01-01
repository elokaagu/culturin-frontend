"use client";
import styled from "styled-components";
import React from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import { ChevronDown } from "styled-icons/boxicons-regular";
import { Plus } from "styled-icons/boxicons-regular";
import { Share } from "styled-icons/boxicons-regular";

export default function Create() {
  return (
    <div>
      <Header />
      <AppBody>
        <h1>Create</h1>
        <p>Upload a pin from your favourite locations</p>
        <CreateResults>
          <p>Create a pin</p> <Plus size="20" />
        </CreateResults>
        <CreateResults>
          <p>View your profile</p> <ChevronDown size="20" />
        </CreateResults>
        <CreateResults>
          <p>Share your plans</p> <Share size="20" />
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
  height: 100%;
  line-height: 2;
  color: white;
`;

const CreateResults = styled.div`
  flex-direction: row;
  align-items: center;
  border-radius: 15px;
  justify-content: space-between;
  padding: 20px;
  border: 2px solid #262627;
  background-color: transparent;
  font-weight: 300;
  cursor: pointer;
  display: flex;
  color: white;
  width: 30%;
  margin: 20px;
  &:hover {
    background: #222222;
    transition: 0.3s ease-in-out;
  }
`;

const CreateTitle = styled.div``;
