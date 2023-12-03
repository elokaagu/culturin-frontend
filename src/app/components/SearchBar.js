import React from "react";
import styled from "styled-components";
import { Search } from "styled-icons/boxicons-regular";

export default function SearchBar() {
  return (
    <Body>
      <SearchBox>
        <Search size="20" />
        <p>Search</p>
      </SearchBox>
    </Body>
  );
}

const Body = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const SearchBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 20px;
  width: 50%;
  ${"" /* border: 1px solid white; */}
  padding: 12px;
  padding-left: 20px;
  padding-right: 20px;
  background-color: #262627;
  color: white;
  font-weight: 600;
  cursor: pointer;

  p {
    margin-left: 10px;
  }

  &:hover {
    opacity: 0.8;
    transition: 0.3s ease-in-out;
  }
`;
