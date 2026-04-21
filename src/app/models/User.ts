export type UserModel = {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  hashed_password: string | null;
  auth_provider_id: string | null;
  created_at: string;
  updated_at: string;
};
