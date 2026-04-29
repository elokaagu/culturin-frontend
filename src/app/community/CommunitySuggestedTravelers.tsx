"use client";

import { Link } from "next-view-transitions";

import FollowTravelerButton from "@/app/components/FollowTravelerButton";
import type { SuggestedTraveler } from "@/lib/social/types";

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
  if (parts[0]?.length) return parts[0].slice(0, 2).toUpperCase();
  return "TR";
}

type Props = {
  travelers: SuggestedTraveler[];
  currentUserId: string | null;
};

export default function CommunitySuggestedTravelers({ travelers, currentUserId }: Props) {
  if (travelers.length === 0) return null;

  return (
    <section className="w-full min-w-0" aria-labelledby="community-suggested-heading">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <h2
          id="community-suggested-heading"
          className="m-0 text-lg font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-xl"
        >
          People you can follow
        </h2>
        <p className="m-0 text-xs text-neutral-500 dark:text-white/50">
          Travelers with public lists and profiles on Culturin.
        </p>
      </div>
      <div className="-mx-1 flex gap-3 overflow-x-auto pb-2 pt-0.5 [-webkit-overflow-scrolling:touch] [scrollbar-width:thin] sm:gap-4">
        {travelers.map((t) => {
          const isSelf = currentUserId === t.id;
          return (
            <article
              key={t.id}
              className="w-[min(15rem,72vw)] shrink-0 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.03]"
            >
              <div className="flex flex-col gap-3">
                <Link href={`/profile/${t.id}`} className="flex items-center gap-3 no-underline">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 text-sm font-semibold text-neutral-800 dark:border-white/12 dark:bg-white/10 dark:text-white">
                    {initialsFromName(t.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="m-0 truncate text-sm font-semibold text-neutral-900 dark:text-white">{t.name}</p>
                    <p className="m-0 truncate text-xs text-neutral-500 dark:text-white/55">{t.handle}</p>
                  </div>
                </Link>
                {!isSelf ? (
                  <FollowTravelerButton
                    targetUserId={t.id}
                    initialFollowing={t.isFollowing}
                    disabled={!currentUserId}
                  />
                ) : (
                  <span className="rounded-full border border-neutral-200 px-3 py-1.5 text-center text-xs font-semibold text-neutral-600 dark:border-white/15 dark:text-white/60">
                    You
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>
      {!currentUserId ? (
        <p className="m-0 mt-2 text-xs text-neutral-500 dark:text-white/50">
          <Link href="/login?next=/community" className="font-medium text-amber-700 underline-offset-2 hover:underline dark:text-amber-300/90">
            Sign in
          </Link>{" "}
          to follow travelers.
        </p>
      ) : null}
    </section>
  );
}
