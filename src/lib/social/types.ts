import type { SpotListWithItems } from "@/lib/spotLists/types";

export type PublicSpotifyPlaylist = {
  id: string;
  name: string;
  description: string | null;
  tracks_total: number;
  image_url: string | null;
  spotify_url: string;
};

export type TravelerCard = {
  id: string;
  name: string;
  handle: string;
  itinerary: string;
  recommendation: string;
  listsCount: number;
  isFollowing: boolean;
};

export type TravelerProfile = {
  id: string;
  name: string;
  handle: string;
  lists: SpotListWithItems[];
  spotifyPlaylists: PublicSpotifyPlaylist[];
  languageSummary: {
    targetLanguage: string;
    proficiencyLevel: string;
    totalWords: number;
    currentStreak: number;
  } | null;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
};

export type SuggestedTraveler = {
  id: string;
  name: string;
  handle: string;
  isFollowing: boolean;
};
