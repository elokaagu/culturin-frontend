"use client";

import { useEffect, useState } from "react";

export type StudioRoleState = {
  loading: boolean;
  authenticated: boolean;
  isAdmin: boolean;
};

const defaultState: StudioRoleState = {
  loading: true,
  authenticated: false,
  isAdmin: false,
};

/** Loads `/api/me/studio-role` once for Create menu + sidebar branching. */
export function useStudioRole(): StudioRoleState {
  const [state, setState] = useState<StudioRoleState>(defaultState);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/me/studio-role")
      .then((r) => r.json())
      .then((data: { authenticated?: boolean; isAdmin?: boolean }) => {
        if (cancelled) return;
        setState({
          loading: false,
          authenticated: Boolean(data.authenticated),
          isAdmin: Boolean(data.isAdmin),
        });
      })
      .catch(() => {
        if (!cancelled) setState({ loading: false, authenticated: false, isAdmin: false });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
