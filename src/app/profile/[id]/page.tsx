"use client";

import React, { useEffect, useState } from "react";
import { useAppAuth } from "../../components/SupabaseAuthProvider";
import Header from "../../components/Header";
import type { simpleBlogCard } from "@/lib/interface";
import { getCmsBrowserClient } from "../../../lib/cms/browser";
import { listBlogs } from "../../../lib/cms/queries";
import { ArticleCardFromBlog } from "@/components/cms/ArticleCard";

export default function ProfileByIdPage() {
  const { data: session } = useAppAuth();
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [articleData, setArticleData] = useState<simpleBlogCard[]>([]);

  useEffect(() => {
    if (!session?.user?.id) return;
    fetch(`/api/users/${session.user.id}`)
      .then((res) => res.json())
      .then((data: { name?: string; email?: string }) => {
        setUserData({
          name: data.name ?? "",
          email: data.email ?? "",
        });
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }, [session?.user?.id]);

  useEffect(() => {
    void (async () => {
      const db = getCmsBrowserClient();
      if (!db) return;
      setArticleData(await listBlogs(db));
    })();
  }, []);

  const first = session?.user?.name?.trim()?.split(/\s+/)[0];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50 px-5 pb-16 pt-[var(--header-offset)] text-neutral-900 dark:bg-black dark:text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">
              {first ? `${first}'s profile` : "Your profile"}
            </h1>
            {userData.email ? (
              <p className="mt-2 text-sm text-neutral-600 dark:text-white/60">{userData.email}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold">Articles</h2>
            <p className="text-sm text-neutral-600 dark:text-white/65">Latest stories (saved list coming soon).</p>
          </div>
          <div className="flex flex-row flex-wrap gap-4 overflow-x-auto py-2">
            {articleData.map((card) => (
              <ArticleCardFromBlog key={card.currentSlug} card={card} layout="profile" />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
