export type SpotListRow = {
  id: string;
  user_id: string;
  title: string;
  place_label: string | null;
  created_at: string;
  updated_at: string;
};

export type SpotListItemRow = {
  id: string;
  list_id: string;
  title: string;
  notes: string | null;
  url: string | null;
  sort_order: number;
  created_at: string;
};

export type SpotListWithItems = SpotListRow & { items: SpotListItemRow[] };
