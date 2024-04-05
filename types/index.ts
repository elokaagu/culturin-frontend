import { User } from "@prisma/client";

export type SafeUser = Omit<
  User,
  "createdAt" | "password" | "emailVerified" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};
