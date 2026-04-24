"use client";

import { Link } from "next-view-transitions";

import Header from "../components/Header";

const actions = [
  {
    href: "/assistant",
    title: "Write an article",
    description: "Use Culturin AI to brainstorm angles, outline, and refine travel stories.",
  },
  {
    href: "/create/upload",
    title: "Upload a video",
    description: "Open the upload flow to add media from your trips to your library.",
  },
  {
    href: "/join-us/advisors",
    title: "Become a partner",
    description: "See how to work with Culturin as an advisor or travel partner.",
  },
] as const;

export default function CreatePage() {
  return (
    <>
      <Header />
      <main className="mx-auto flex min-h-screen max-w-lg flex-col gap-10 bg-neutral-50 px-4 pb-16 pt-[var(--header-offset)] text-neutral-900 sm:max-w-2xl sm:px-6 dark:bg-black dark:text-white">
        <header className="max-w-xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Create</h1>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400 sm:text-base">
            Share your story and inspiration from one of your favourite destinations.
          </p>
        </header>

        <nav aria-label="Create options">
          <ul className="flex flex-col gap-4 sm:gap-5">
            {actions.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-5 no-underline outline-none transition-[border-color,background-color] hover:border-amber-400/35 hover:bg-white/[0.07] focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:p-6"
                >
                  <span className="text-lg font-semibold text-white group-hover:text-amber-200">
                    {item.title}
                  </span>
                  <span className="mt-2 text-sm leading-snug text-neutral-400">{item.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>
    </>
  );
}
