"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type SupabaseAuthContextValue = {
  supabase: SupabaseClient | null;
  user: User | null;
  loading: boolean;
};

const SupabaseAuthContext = createContext<SupabaseAuthContextValue | null>(null);

function createBrowserClientSafe(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return null;
  }
  return createBrowserClient(url, key);
}

export default function SupabaseAuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: User | null;
}) {
  const [supabase] = useState(createBrowserClientSafe);
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setUser(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      setUser(session?.user ?? initialUser);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [supabase, initialUser]);

  const value = useMemo(
    () => ({
      supabase,
      user,
      loading,
    }),
    [supabase, user, loading],
  );

  return <SupabaseAuthContext.Provider value={value}>{children}</SupabaseAuthContext.Provider>;
}

export function useSupabaseAuth(): SupabaseAuthContextValue {
  const ctx = useContext(SupabaseAuthContext);
  if (!ctx) {
    throw new Error("useSupabaseAuth must be used within SupabaseAuthProvider");
  }
  return ctx;
}

/** Drop-in replacement for next-auth `useSession()` shape used across Culturin. */
export function useAppAuth() {
  const { user, loading } = useSupabaseAuth();

  if (loading) {
    return { data: null, status: "loading" as const };
  }

  if (!user) {
    return { data: null, status: "unauthenticated" as const };
  }

  const name =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    user.email?.split("@")[0] ||
    "User";

  return {
    data: {
      user: {
        id: user.id,
        email: user.email ?? "",
        name,
        username: (user.user_metadata?.username as string | undefined) ?? null,
      },
    },
    status: "authenticated" as const,
  };
}
