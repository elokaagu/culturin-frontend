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
    throw new Error("Something went wrong");
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
          <p>
            {data.posts.map((post) => (
              <>{post.content}</>
            ))}
          </p>
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
