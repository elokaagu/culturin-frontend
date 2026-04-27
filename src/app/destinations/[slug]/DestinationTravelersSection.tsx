"use client";

import { Link } from "next-view-transitions";

import FollowTravelerButton from "@/app/components/FollowTravelerButton";
import type { TravelerCard } from "@/lib/social/types";

type Props = {
  travelers: TravelerCard[];
  currentUserId: string | null;
};

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
  if (parts[0]?.length) return parts[0].slice(0, 2).toUpperCase();
  return "TR";
}

export default function DestinationTravelersSection({ travelers, currentUserId }: Props) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="m-0 text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">Travelers to follow</h2>
      </div>
      <ul className="m-0 list-none space-y-3 p-0">
        {travelers.map((traveler) => {
          const isSelf = currentUserId === traveler.id;
          return (
            <li
              key={traveler.id}
              className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-3 dark:border-white/10 dark:bg-black/40"
            >
              <div className="flex items-start justify-between gap-3">
                <Link href={`/profile/${traveler.id}`} className="flex min-w-0 gap-3 no-underline">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-neutral-200 text-xs font-semibold text-neutral-700 dark:border-white/15 dark:bg-white/10 dark:text-white/85">
                    {initialsFromName(traveler.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="m-0 truncate text-sm font-semibold text-neutral-900 dark:text-white">{traveler.name}</p>
                    <p className="m-0 mt-0.5 text-xs text-neutral-500 dark:text-white/55">{traveler.handle}</p>
                  </div>
                </Link>
                {!isSelf ? (
                  <FollowTravelerButton
                    targetUserId={traveler.id}
                    initialFollowing={traveler.isFollowing}
                    disabled={!currentUserId}
                  />
                ) : (
                  <span className="rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-600 dark:border-white/20 dark:text-white/60">
                    You
                  </span>
                )}
              </div>
              <p className="m-0 mt-2 text-sm text-neutral-700 dark:text-white/80">
                <span className="font-semibold">Itinerary:</span> {traveler.itinerary}
              </p>
              <p className="m-0 mt-1 text-sm text-neutral-600 dark:text-white/70">
                <span className="font-semibold">Recommendation:</span> {traveler.recommendation}
              </p>
              <p className="m-0 mt-1 text-xs text-neutral-500 dark:text-white/55">{traveler.listsCount} saved list(s)</p>
            </li>
          );
        })}
      </ul>
      {!currentUserId ? (
        <p className="m-0 mt-3 text-xs text-neutral-500 dark:text-white/55">Sign in to follow travelers.</p>
      ) : null}
    </section>
  );
}
