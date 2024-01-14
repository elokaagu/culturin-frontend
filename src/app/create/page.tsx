"use client";
import styled from "styled-components";
import React from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import { ChevronDown } from "styled-icons/boxicons-regular";
import { Plus } from "styled-icons/boxicons-regular";
import { Share } from "styled-icons/boxicons-regular";
import Link from "next/link";

export default function Create() {
  return (
    <div>
      <Header />
      <AppBody>
        <h1>Create</h1>
        <p>Upload a pin from your favourite locations</p>

        <Link
          href="/create/upload"
          style={{
            textDecoration: "none",
          }}
        >
          <CreateResults>
            <p>Create a pin</p> <Plus size="20" />
          </CreateResults>
        </Link>
        <Link
          href="/profile"
          style={{
            textDecoration: "none",
          }}
        >
          <CreateResults>
            <p>View your profile</p> <ChevronDown size="20" />
          </CreateResults>
        </Link>
        <CreateResults>
          <p>Make your itinerary</p> <Share size="20" />
        </CreateResults>
      </AppBody>
    </div>
  );
}

const AppBody = styled.div`
  padding: 20px;
  padding-top: 150px;
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
  width: 350px;
  margin: 20px;
  &:hover {
    background: #222222;
    transition: 0.3s ease-in-out;
  }

  a {
    text-decoration: none;
    color: black;
  }
`;

const CreateTitle = styled.div``;
