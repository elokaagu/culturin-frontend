"use client";

import type { ReactNode } from "react";
import type { Session } from "next-auth";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

type AppSessionProviderProps = {
  children: ReactNode;
  session?: Session | null;
};

/** App Router client bridge: passes server session into next-auth/react. */
export default function SessionProvider({ children, session }: AppSessionProviderProps) {
  return (
    <NextAuthSessionProvider session={session ?? undefined}>
      {children}
    </NextAuthSessionProvider>
  );
}
