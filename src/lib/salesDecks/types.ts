export type SalesDeck = {
  id: string;
  title: string;
  description: string | null;
  file_path: string;
  file_url: string;
  file_name: string;
  file_size: number | null;
  page_count: number | null;
  page_image_urls: string[] | null;
  share_token: string;
  custom_slug: string | null;
  status: string;
  require_email: boolean;
  allow_download: boolean;
  password_hash: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type DeckPartnerLink = {
  id: string;
  deck_id: string;
  label: string;
  slug: string;
  created_at: string;
};

export type DeckViewSession = {
  id: string;
  deck_id: string;
  partner_link_id: string | null;
  viewer_email: string | null;
  viewer_name: string | null;
  visitor_id: string;
  started_at: string;
  last_active_at: string;
  duration_seconds: number;
  max_page_reached: number;
  pages_viewed: number;
  completed: boolean;
  user_agent: string | null;
  referrer: string | null;
};

export type DeckPageEvent = {
  id: string;
  session_id: string;
  deck_id: string;
  page_number: number;
  time_spent_ms: number;
  viewed_at: string;
};
