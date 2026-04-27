import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";

import Header from "../../components/Header";
import FollowTravelerButton from "../../components/FollowTravelerButton";
import { ensureAppUser } from "@/lib/api/ensureAppUser";
import { getTravelerProfile } from "@/lib/repositories/followRepository";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type PageProps = {
  params: { id: string };
};

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
  if (parts[0]?.length) return parts[0].slice(0, 2).toUpperCase();
  return "TR";
}

export default async function ProfileByIdPage({ params }: PageProps) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user: sessionUser },
  } = await supabase.auth.getUser();
  const appUser = sessionUser?.email ? await ensureAppUser(sessionUser) : null;
  const profile = await getTravelerProfile({ travelerUserId: params.id, viewerUserId: appUser?.id ?? null });
  if (!profile) notFound();

  const isSelf = appUser?.id === profile.id;

  return (
    <>
      <Header />
      <main className="min-h-dvh bg-neutral-50 pb-20 pt-[var(--header-offset)] text-neutral-900 dark:bg-black dark:text-white">
        <div className="mx-auto w-full max-w-5xl px-5 pt-8 sm:px-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-200 text-lg font-semibold text-neutral-700 dark:bg-white/10 dark:text-white/90">
                  {initialsFromName(profile.name)}
                </div>
                <div>
                  <h1 className="m-0 text-2xl font-semibold tracking-tight">{profile.name}</h1>
                  <p className="m-0 mt-1 text-sm text-neutral-500 dark:text-white/55">{profile.handle}</p>
                  <p className="m-0 mt-1 text-xs text-neutral-500 dark:text-white/55">
                    {profile.followersCount} follower(s) · {profile.followingCount} following
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {!isSelf ? (
                  <FollowTravelerButton
                    targetUserId={profile.id}
                    initialFollowing={profile.isFollowing}
                    disabled={!appUser?.id}
                  />
                ) : (
                  <Link
                    href="/profile"
                    className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 no-underline transition hover:bg-neutral-50 dark:border-white/20 dark:bg-white/10 dark:text-white"
                  >
                    Edit my profile
                  </Link>
                )}
              </div>
            </div>
          </div>

          <section className="mt-6">
            <h2 className="m-0 text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              Saved itineraries & recommendations
            </h2>
            <p className="m-0 mt-1 text-sm text-neutral-600 dark:text-white/65">
              Browse lists this traveler has saved for places they have explored.
            </p>
            {profile.lists.length === 0 ? (
              <p className="m-0 mt-6 rounded-xl border border-neutral-200 bg-white px-4 py-4 text-sm text-neutral-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/65">
                No saved lists yet.
              </p>
            ) : (
              <ul className="m-0 mt-5 space-y-4 p-0">
                {profile.lists.map((list) => (
                  <li
                    key={list.id}
                    className="list-none rounded-xl border border-neutral-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]"
                  >
                    <p className="m-0 text-sm font-semibold text-neutral-900 dark:text-white">{list.title}</p>
                    {list.place_label ? (
                      <p className="m-0 mt-1 text-xs text-neutral-500 dark:text-white/55">{list.place_label}</p>
                    ) : null}
                    {list.items.length > 0 ? (
                      <ul className="m-0 mt-3 space-y-2 p-0">
                        {list.items.map((item) => (
                          <li
                            key={item.id}
                            className="list-none rounded-lg bg-neutral-50 px-3 py-2 text-sm text-neutral-700 dark:bg-black/40 dark:text-white/80"
                          >
                            <span className="font-medium">{item.title}</span>
                            {item.notes ? <span className="text-neutral-500 dark:text-white/60"> — {item.notes}</span> : null}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="m-0 mt-2 text-sm text-neutral-500 dark:text-white/55">No spots added yet.</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
