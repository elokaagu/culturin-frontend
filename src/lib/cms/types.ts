import type { SupabaseClient } from "@supabase/supabase-js";

export type CmsDb = SupabaseClient;

export type CmsBlogRow = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  title_image_url: string | null;
  title_image: unknown;
  body: unknown;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CmsVideoRow = {
  id: string;
  slug: string;
  title: string;
  uploader: string | null;
  description: string | null;
  thumbnail_url: string | null;
  thumbnail: unknown;
  playback_id: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CmsProviderRow = {
  id: string;
  slug: string;
  name: string | null;
  event_name: string | null;
  description: string | null;
  location: string | null;
  avatar_image_url: string | null;
  languages: string[] | null;
  specialties: string[] | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_website: string | null;
  banner_image_url: string | null;
  banner_image_alt: string | null;
  banner_image: unknown;
  images: unknown;
  prices: unknown;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};
