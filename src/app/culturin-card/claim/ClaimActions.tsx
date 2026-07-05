"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link } from "next-view-transitions";

import { useSupabaseAuth } from "@/app/components/SupabaseAuthProvider";

export function ClaimButton({ token }: { token: string }) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleClaim() {
    setState("loading");
    setMessage("");

    const response = await fetch("/api/card-applications/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = (await response.json().catch(() => ({}))) as { message?: string };

    if (!response.ok) {
      setState("error");
      setMessage(data.message ?? "Could not claim this invite.");
      return;
    }

    setState("success");
  }

  if (state === "success") {
    return (
      <div className="mt-6 rounded-xl border border-emerald-300/50 bg-emerald-50 px-4 py-4 text-sm text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-300">
        <p className="m-0 font-semibold">You&apos;re in. Welcome to the Culturin Card.</p>
        <p className="m-0 mt-1">
          <Link href="/" className="font-medium underline underline-offset-2">
            Head back to Culturin
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={handleClaim}
        disabled={state === "loading"}
        className="inline-flex h-11 items-center rounded-full bg-neutral-900 px-6 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
      >
        {state === "loading" ? "Claiming…" : "Claim your Culturin Card"}
      </button>
      {state === "error" ? <p className="mt-3 text-sm text-rose-600 dark:text-rose-400">{message}</p> : null}
    </div>
  );
}

export function ClaimSwitchAccount({ next }: { next: string }) {
  const router = useRouter();
  const { supabase } = useSupabaseAuth();
  const [signingOut, setSigningOut] = useState(false);

  return (
    <button
      type="button"
      disabled={signingOut || !supabase}
      onClick={async () => {
        if (!supabase) return;
        setSigningOut(true);
        try {
          await supabase.auth.signOut();
          router.push(`/login?next=${encodeURIComponent(next)}`);
        } finally {
          setSigningOut(false);
        }
      }}
      className="mt-4 inline-flex h-10 items-center rounded-full border border-neutral-300 px-5 text-sm font-medium text-neutral-800 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/25 dark:text-white dark:hover:bg-white/10"
    >
      {signingOut ? "Signing out…" : "Sign out and switch accounts"}
    </button>
  );
}
