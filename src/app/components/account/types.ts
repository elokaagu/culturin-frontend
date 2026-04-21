/** Editable account fields shown in settings (draft until persisted). */
export type AccountProfileDraft = {
  email: string;
  username: string;
};

/** Minimal user fields needed to seed the account profile draft. */
export type AccountProfileUser = {
  id: string;
  email: string;
  username?: string | null;
};
