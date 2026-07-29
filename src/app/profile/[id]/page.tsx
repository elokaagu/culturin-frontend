import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";

import IslandNav from "../../components/IslandNav";
import HomeFooter from "../../components/HomeFooter";
import { editorialScopeClass, EDITORIAL_BG, EDITORIAL_INK } from "@/lib/theme/culturinTokens";
import FollowTravelerButton from "../../components/FollowTravelerButton";
import { ensureAppUser } from "@/lib/api/ensureAppUser";
import { getTravelerProfile, listSuggestedTravelers } from "@/lib/repositories/followRepository";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type PageProps = {
  params: { id: string };
};

const displayFont = { fontFamily: "var(--font-display), 'Times New Roman', serif" };
const cardStyle = { borderColor: "var(--c-rule)" };

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
    <div className={editorialScopeClass} style={{ background: EDITORIAL_BG, color: EDITORIAL_INK }}>
      <IslandNav />
      <main className="min-h-dvh pb-20" style={{ paddingTop: "8rem" }}>
        <div className="mx-auto w-full max-w-6xl px-5 pt-8 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              <div className="rounded-2xl border p-6" style={cardStyle}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full text-lg font-semibold" style={{ background: "rgba(28,26,23,0.06)", color: "var(--c-ink)" }}>
                      {initialsFromName(profile.name)}
                    </div>
                    <div>
                      <h1 className="m-0 text-2xl font-medium tracking-tight" style={{ ...displayFont, color: "var(--c-ink)" }}>{profile.name}</h1>
                      <p className="m-0 mt-1 text-sm" style={{ color: "var(--c-muted)" }}>{profile.handle}</p>
                      <p className="m-0 mt-1 text-xs" style={{ color: "var(--c-muted)" }}>
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
                        className="rounded-full border px-4 py-2 text-sm font-medium no-underline transition hover:opacity-80"
                        style={{ borderColor: "var(--c-rule)", color: "var(--c-ink)" }}
                      >
                        Edit my profile
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              <section className="mt-6">
                <h2 className="m-0 text-xl font-medium tracking-tight" style={{ ...displayFont, color: "var(--c-ink)" }}>
                  Saved itineraries &amp; recommendations
                </h2>
                <p className="m-0 mt-1 text-sm" style={{ color: "var(--c-muted)" }}>
                  Browse lists this traveler has saved for places they have explored.
                </p>
                {profile.lists.length === 0 ? (
                  <p className="m-0 mt-6 rounded-xl border px-4 py-4 text-sm" style={{ borderColor: "var(--c-rule)", color: "var(--c-muted)" }}>
                    No saved lists yet.
                  </p>
                ) : (
                  <ul className="m-0 mt-5 space-y-4 p-0">
                    {profile.lists.map((list) => (
                      <li key={list.id} className="list-none rounded-xl border p-4" style={cardStyle}>
                        <p className="m-0 text-sm font-semibold" style={{ color: "var(--c-ink)" }}>{list.title}</p>
                        <p className="m-0 mt-1 text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--c-muted)" }}>
                          {list.list_type}
                        </p>
                        {list.place_label ? (
                          <p className="m-0 mt-1 text-xs" style={{ color: "var(--c-muted)" }}>{list.place_label}</p>
                        ) : null}
                        {list.description ? (
                          <p className="m-0 mt-1 text-xs" style={{ color: "var(--c-muted)" }}>{list.description}</p>
                        ) : null}
                        {list.items.length > 0 ? (
                          <ul className="m-0 mt-3 space-y-2 p-0">
                            {list.items.map((item) => (
                              <li key={item.id} className="list-none rounded-lg px-3 py-2 text-sm" style={{ background: "rgba(28,26,23,0.04)", color: "var(--c-ink)" }}>
                                <span className="font-medium">{item.title}</span>
                                {item.notes ? <span style={{ color: "var(--c-muted)" }}> — {item.notes}</span> : null}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="m-0 mt-2 text-sm" style={{ color: "var(--c-muted)" }}>No spots added yet.</p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="mt-6">
                <h2 className="m-0 text-xl font-medium tracking-tight" style={{ ...displayFont, color: "var(--c-ink)" }}>Playlists</h2>
                <p className="m-0 mt-1 text-sm" style={{ color: "var(--c-muted)" }}>
                  Public playlists imported from Spotify.
                </p>
                {profile.spotifyPlaylists.length === 0 ? (
                  <p className="m-0 mt-4 rounded-xl border px-4 py-4 text-sm" style={{ borderColor: "var(--c-rule)", color: "var(--c-muted)" }}>
                    No public playlists yet.
                  </p>
                ) : (
                  <ul className="m-0 mt-5 space-y-3 p-0">
                    {profile.spotifyPlaylists.map((playlist) => (
                      <li key={playlist.id} className="list-none rounded-xl border p-4" style={cardStyle}>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex min-w-0 items-center gap-3">
                            {playlist.image_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={playlist.image_url} alt={playlist.name} className="h-14 w-14 rounded-md object-cover" />
                            ) : (
                              <div className="h-14 w-14 rounded-md" style={{ background: "rgba(28,26,23,0.06)" }} />
                            )}
                            <div className="min-w-0">
                              <p className="m-0 truncate text-sm font-semibold" style={{ color: "var(--c-ink)" }}>{playlist.name}</p>
                              <p className="m-0 mt-1 text-xs" style={{ color: "var(--c-muted)" }}>{playlist.tracks_total} tracks</p>
                            </div>
                          </div>
                          <a
                            href={playlist.spotify_url}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full border px-3 py-1.5 text-xs font-medium no-underline transition hover:opacity-80"
                            style={{ borderColor: "var(--c-rule)", color: "var(--c-ink)" }}
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
                <section className="mt-6 rounded-2xl border p-5" style={cardStyle}>
                  <h2 className="m-0 text-xl font-medium tracking-tight" style={{ ...displayFont, color: "var(--c-ink)" }}>Language learning</h2>
                  <p className="m-0 mt-1 text-sm" style={{ color: "var(--c-muted)" }}>
                    Studying {profile.languageSummary.targetLanguage} ({profile.languageSummary.proficiencyLevel}).
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <p className="m-0 rounded-xl px-3 py-2 text-sm" style={{ background: "rgba(28,26,23,0.04)", color: "var(--c-ink)" }}>
                      Words saved: <span className="font-semibold">{profile.languageSummary.totalWords}</span>
                    </p>
                    <p className="m-0 rounded-xl px-3 py-2 text-sm" style={{ background: "rgba(28,26,23,0.04)", color: "var(--c-ink)" }}>
                      Current streak: <span className="font-semibold">{profile.languageSummary.currentStreak}</span>
                    </p>
                  </div>
                </section>
              ) : null}
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <section className="rounded-3xl border p-5" style={cardStyle}>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="m-0 text-3xl font-medium tracking-tight" style={{ ...displayFont, color: "var(--c-ink)" }}>Suggested</h2>
                  <Link href="/profile" className="text-xl font-medium no-underline transition hover:opacity-80" style={{ ...displayFont, color: "var(--c-ink)" }}>
                    See all
                  </Link>
                </div>
                {suggested.length === 0 ? (
                  <p className="m-0 text-sm" style={{ color: "var(--c-muted)" }}>No suggestions yet.</p>
                ) : (
                  <ul className="m-0 space-y-4 p-0">
                    {suggested.map((traveler) => (
                      <li key={traveler.id} className="list-none">
                        <div className="flex items-center justify-between gap-3">
                          <Link href={`/profile/${traveler.id}`} className="min-w-0 flex items-center gap-3 no-underline">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold" style={{ background: "rgba(28,26,23,0.06)", color: "var(--c-ink)" }}>
                              {initialsFromName(traveler.name)}
                            </div>
                            <div className="min-w-0">
                              <p className="m-0 truncate text-lg font-medium" style={{ ...displayFont, color: "var(--c-ink)" }}>
                                {traveler.name}
                              </p>
                              <p className="m-0 text-sm" style={{ color: "var(--c-muted)" }}>Selected by Culturin</p>
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
      <HomeFooter />
    </div>
  );
}
