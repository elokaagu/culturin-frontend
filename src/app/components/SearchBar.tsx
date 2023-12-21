"use client";
import React from "react";
import styled from "styled-components";
import { Search } from "styled-icons/boxicons-regular";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const search = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    search ? search.get("q") : null
  );
  const router = useRouter();

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const encodedSearchQuery = encodeURI(searchQuery || "");
    router.push(`/search?q=${encodedSearchQuery}`);
  };

  return (
    <Body>
      <SearchBox>
        <Search size="20" />
        <SearchForm onSubmit={onSearch}>
          <SearchInput
            type="text"
            name="search"
            placeholder="Search"
            value={searchQuery || ""}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </SearchForm>
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
