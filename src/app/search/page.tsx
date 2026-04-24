"use client";

import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { simpleBlogCard } from "../../libs/interface";
import { getCmsBrowserClient } from "../../lib/cms/browser";
import { searchBlogs } from "../../lib/cms/queries";
import { ArticleCardFromBlog } from "@/components/cms/ArticleCard";

export default function SearchResultsPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || "";
  const [data, setData] = useState<simpleBlogCard[]>([]);

  useEffect(() => {
    async function fetchData() {
      const db = getCmsBrowserClient();
      if (!db) return;
      setData(await searchBlogs(db, query));
    }
    void fetchData();
  }, [query]);

  return (
    <>
      <Header />
      <div className="flex min-h-full flex-col items-center bg-background px-10 py-10 pt-[var(--header-offset)] text-foreground max-[428px]:items-start max-[428px]:pl-0">
        <div className="flex w-full cursor-pointer flex-col items-start pr-5 max-[428px]:ml-0 max-[428px]:mt-5 max-[428px]:w-full">
          <h1 className="text-2xl max-[428px]:ml-7">Search Results</h1>
        </div>
        <div className="mb-5 flex w-full flex-col items-start pr-5 max-[428px]:ml-[3.75rem] max-[428px]:w-full">
          <h3 className="mb-5 text-xl text-muted-foreground">Articles</h3>
        </div>
        <div
          className="mx-auto grid w-[80%] grid-cols-1 place-items-center gap-5 py-5 max-[428px]:w-full max-[428px]:p-5 min-[800px]:grid-cols-3"
          style={{ lineHeight: 2 }}
        >
          {data.map((card) => (
            <ArticleCardFromBlog key={card.currentSlug} card={card} layout="grid" />
          ))}
        </div>
      </div>
    </>
  );
}
