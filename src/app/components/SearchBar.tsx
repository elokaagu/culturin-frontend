"use client";
import React from "react";
import styled from "styled-components";
import { Search } from "styled-icons/boxicons-regular";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import algoliasearch from "algoliasearch/lite";
import { SearchBox } from "react-instantsearch";
import { InstantSearchNext } from "react-instantsearch-nextjs";

// Initialize Algolia search client
const searchClient = algoliasearch(
  "MJMYIDXYNZ",
  "f36a3d2fd0819dad18ec9ec9e814097b"
);

// Initialize Algolia search index

export default function SearchBar() {
  // const search = useSearchParams();
  // const [searchQuery, setSearchQuery] = useState(
  //   search ? search.get("q") : null
  // );
  // const router = useRouter();

  // const onSearch = async (event: any) => {
  //   event.preventDefault();
  //   try {
  //     const result = await searchIndex.search(searchQuery || ""); // Provide a default value of an empty string for searchQuery
  //     console.log(result); // You can process and use the search result as needed
  //     // For example, redirect to a search results page with the query or display results directly
  //     router.push(`/search?q=${searchQuery}`);
  //   } catch (error) {
  //     console.error("Algolia search error: ", error);
  //   }
  // };

  // function handleReset() {
  //   setSearchQuery("");
  // }

  return (
    <Body>
      <SearchContainer>
        <Search size="20" />
        <SearchField>
          <InstantSearchNext
            indexName="countries"
            searchClient={searchClient}
            routing
          >
            {/* <SearchBox searchAsYouType /> */}

            <SearchInput
              type="text"
              name="search"
              placeholder="Search"
              // value={searchQuery || ""}
              // onChange={(event) => setSearchQuery(event.target.value)}
              // onKeyDown={(e) => {
              //   if (e.key === "Enter") handleReset();
              // }}
              autoComplete="off"
            />
          </InstantSearchNext>
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
