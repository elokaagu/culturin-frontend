"use client";
import styled from "styled-components";
import React, { use } from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { Post, User } from "@prisma/client";

const fetchPosts = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Ooops");
  }

  return response.json();
};

const Search = () => {
  const search = useSearchParams();
  const searchQuery = search ? search.get("q") : null;
  const encodedSearchQuery = encodeURI(searchQuery || "");
  const { data, isLoading } = useSWR<{ posts: Array<Post & { author: User }> }>(
    `/api/search?q=${encodedSearchQuery}`,
    fetchPosts
  );

  if (!data?.posts) {
    return null;
  }

  console.log("Here is Data", data);

  return (
    <div>
      <Header />
      <AppBody>
        <SearchBar />
        <>
          <SearchResults>
            {data.posts.map((post) => (
              <>{post.content}</>
            ))}
          </SearchResults>
        </>
      </AppBody>
    </div>
  );
};

export default Search;

const AppBody = styled.div`
  padding: 20px;
  display: flex;
  background: black;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  line-height: 2;
`;

const SearchResults = styled.div`
  margin: 20px auto;

  flex-direction: row;
  align-items: center;
  border-radius: 20px;
  padding: 20px;
  background-color: #262627;
  font-weight: 400;
  cursor: pointer;
  width: 60%;
  display: flex;
  justify-content: center;
  color: white;
`;
