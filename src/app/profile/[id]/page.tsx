import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";

import Header from "../../components/Header";
import FollowTravelerButton from "../../components/FollowTravelerButton";
import { ensureAppUser } from "@/lib/api/ensureAppUser";
import { getTravelerProfile, listSuggestedTravelers } from "@/lib/repositories/followRepository";
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
  const suggested = await listSuggestedTravelers({
    viewerUserId: appUser?.id ?? null,
    excludeUserIds: [profile.id],
    limit: 5,
  }).catch(() => []);

  return (
    <>
      <Header />
      <main className="min-h-dvh bg-neutral-50 pb-20 pt-[var(--header-offset)] text-neutral-900 dark:bg-black dark:text-white">
        <div className="mx-auto w-full max-w-6xl px-5 pt-8 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div>
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
                        <p className="m-0 mt-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-white/55">
                          {list.list_type}
                        </p>
                        {list.place_label ? (
                          <p className="m-0 mt-1 text-xs text-neutral-500 dark:text-white/55">{list.place_label}</p>
                        ) : null}
                        {list.description ? (
                          <p className="m-0 mt-1 text-xs text-neutral-500 dark:text-white/55">{list.description}</p>
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

              <section className="mt-6">
                <h2 className="m-0 text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">Playlists</h2>
                <p className="m-0 mt-1 text-sm text-neutral-600 dark:text-white/65">
                  Public playlists imported from Spotify.
                </p>
                {profile.spotifyPlaylists.length === 0 ? (
                  <p className="m-0 mt-4 rounded-xl border border-neutral-200 bg-white px-4 py-4 text-sm text-neutral-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/65">
                    No public playlists yet.
                  </p>
                ) : (
                  <ul className="m-0 mt-5 space-y-3 p-0">
                    {profile.spotifyPlaylists.map((playlist) => (
                      <li
                        key={playlist.id}
                        className="list-none rounded-xl border border-neutral-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex min-w-0 items-center gap-3">
                            {playlist.image_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={playlist.image_url} alt={playlist.name} className="h-14 w-14 rounded-md object-cover" />
                            ) : (
                              <div className="h-14 w-14 rounded-md bg-neutral-200 dark:bg-white/10" />
                            )}
                            <div className="min-w-0">
                              <p className="m-0 truncate text-sm font-semibold text-neutral-900 dark:text-white">{playlist.name}</p>
                              <p className="m-0 mt-1 text-xs text-neutral-500 dark:text-white/55">{playlist.tracks_total} tracks</p>
                            </div>
                          </div>
                          <a
                            href={playlist.spotify_url}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-800 no-underline transition hover:bg-neutral-50 dark:border-white/20 dark:text-white"
                          >
                            Open
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {profile.languageSummary ? (
                <section className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
                  <h2 className="m-0 text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">Language learning</h2>
                  <p className="m-0 mt-1 text-sm text-neutral-600 dark:text-white/65">
                    Studying {profile.languageSummary.targetLanguage} ({profile.languageSummary.proficiencyLevel}).
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <p className="m-0 rounded-xl bg-neutral-50 px-3 py-2 text-sm text-neutral-700 dark:bg-black/40 dark:text-white/80">
                      Words saved: <span className="font-semibold">{profile.languageSummary.totalWords}</span>
                    </p>
                    <p className="m-0 rounded-xl bg-neutral-50 px-3 py-2 text-sm text-neutral-700 dark:bg-black/40 dark:text-white/80">
                      Current streak: <span className="font-semibold">{profile.languageSummary.currentStreak}</span>
                    </p>
                  </div>
                </section>
              ) : null}
            </div>

            <aside className="lg:sticky lg:top-[calc(var(--header-offset)+1.25rem)] lg:self-start">
              <section className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="m-0 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">Suggested</h2>
                  <Link
                    href="/profile"
                    className="text-xl font-semibold text-neutral-900 no-underline transition hover:opacity-80 dark:text-white"
                  >
                    See all
                  </Link>
                </div>
                {suggested.length === 0 ? (
                  <p className="m-0 text-sm text-neutral-500 dark:text-white/55">No suggestions yet.</p>
                ) : (
                  <ul className="m-0 space-y-4 p-0">
                    {suggested.map((traveler) => (
                      <li key={traveler.id} className="list-none">
                        <div className="flex items-center justify-between gap-3">
                          <Link href={`/profile/${traveler.id}`} className="min-w-0 flex items-center gap-3 no-underline">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-sm font-semibold text-neutral-700 dark:bg-white/10 dark:text-white/85">
                              {initialsFromName(traveler.name)}
                            </div>
                            <div className="min-w-0">
                              <p className="m-0 truncate text-lg font-semibold text-neutral-900 dark:text-white">
                                {traveler.name}
                              </p>
                              <p className="m-0 text-sm text-neutral-500 dark:text-white/60">Selected by Culturin</p>
                            </div>
                          </Link>
                          <FollowTravelerButton
                            targetUserId={traveler.id}
                            initialFollowing={traveler.isFollowing}
                            disabled={!appUser?.id}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
