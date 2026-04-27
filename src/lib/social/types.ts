import type { SpotListWithItems } from "@/lib/spotLists/types";

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
