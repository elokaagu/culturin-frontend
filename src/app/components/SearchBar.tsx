"use client";
import React, { useState } from "react";
import styled from "styled-components";
import { Search } from "styled-icons/boxicons-regular";
import { useSearchParams } from "next/navigation";
import algoliasearch from "algoliasearch/lite";
import { client } from "../lib/sanity";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const onSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  function handleReset() {
    setSearchQuery("");
  }

  return (
    <Body>
      <SearchContainer>
        <Search size="20" />
        <SearchField>
          <SearchForm onSubmit={onSearchSubmit}>
            <SearchInput
              type="text"
              name="search"
              placeholder="Search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleReset();
              }}
              autoComplete="off"
            />
          </SearchForm>
        </SearchField>
      </SearchContainer>
    </Body>
  );
}

const Body = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 10px;
  width: 80%;
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

const SearchInput = styled.input`
  background: transparent;
  margin-left: 10px;
  outline: none;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex: 2;
  border: none;
  height: 100%;
  color: white;
  font-weight: 600;
  font-size: 18px;
`;

const SearchForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex: 1;
`;

const SearchField = styled.div`
  background: transparent;
  margin-left: 10px;
  outline: none;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex: 2;
  border: none;
  height: 100%;
  color: white;
  font-weight: 600;
  font-size: 18px;
`;

const SearchResultsContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  color: white;
`;

const ResultItem = styled.div`
  margin-bottom: 10px;
`;

const NoResults = styled.div`
  color: red;
`;
