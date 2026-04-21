// types/next-auth.d.ts
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      /** Optional app username when populated by the auth adapter / callbacks. */
      username?: string | null;
    } & User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
  }
}
