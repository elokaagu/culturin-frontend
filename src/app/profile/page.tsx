"use client";

import { useSession } from "next-auth/react";

import Header from "../components/Header";

export default function ProfilePage() {
  const { data: session } = useSession();
  const first = session?.user?.name?.trim()?.split(/\s+/)[0];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black px-5 pb-16 pt-[var(--header-offset)] text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="cursor-default text-2xl font-semibold sm:text-3xl">
            {first ? `${first}'s profile` : "Your profile"}
          </h1>
          <p className="mt-4 text-sm text-white/65">
            Public profile and saved content will appear here as we connect your data
            sources.
          </p>
        </div>
      </main>
    </>
  );
}
