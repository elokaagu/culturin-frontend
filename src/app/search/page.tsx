"use client";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useSearchParams } from "next/navigation";
import { client } from "../lib/sanity";
import { useRouter } from "next/router";
import { simpleBlogCard } from "../../../lib/interface";
import { Suspense } from "react";

const fetchArticlesByCategory = async (categoryName: string) => {
  const query = `
    *[_type == "article" && references(*[_type=="category" && title==$title]._id)] {
      title,
      slug,
      body,
      // Ensure you include all necessary fields here
    }
  `;
  return await client.fetch(query, { title: categoryName });
};
export default function SearchResultsPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  const [blogs, setBlogs] = useState<simpleBlogCard[]>([]);
  const [loading, setLoading] = useState(false);
  // const router = useRouter();

  // useEffect(() => {
  //   // Use a single useEffect for handling router readiness and fetching data
  //   if (router.isReady && router.query.q) {
  //     const query = router.query.q as string;
  //     setLoading(true);
  //     fetchArticlesByCategory(query)
  //       .then((fetchedArticles) => {
  //         setBlogs(fetchedArticles);
  //       })
  //       .catch((error) => console.error(error))
  //       .finally(() => setLoading(false));
  //   }
  // }, [router.isReady, router.query.q]);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Header />
      <AppBody>
        <SearchResults>
          <h1>Search Results</h1>
          {blogs.length > 0 ? (
            blogs.map((blog, index) => (
              <div key={index}>
                <h2>{blog.title}</h2>
                {/* Further rendering logic here */}
              </div>
            ))
          ) : (
            <p>No results found.</p>
          )}
        </SearchResults>
      </AppBody>
    </>
  );
}

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
  margin-top: 100px;
`;
