"use client";

import { Link } from "next-view-transitions";
import { useSearchParams } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";
import { useMemo, useState } from "react";

import { GoogleSignInButton } from "../components/AuthButtons";
import Header from "../components/Header";
import { useSupabaseAuth } from "../components/SupabaseAuthProvider";

export default function LoginPage() {
  const { supabase } = useSupabaseAuth();
  const router = useTransitionRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"signin" | "signup">(searchParams.get("mode") === "signup" ? "signup" : "signin");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const next = searchParams.get("next") || "/";

  const heading = mode === "signin" ? "Sign in to Culturin" : "Create your Culturin account";
  const subtext = useMemo(
    () =>
      mode === "signin"
        ? "Sign in with your email and password."
        : "Use your email to create an account. We will ask you to confirm by email.",
    [mode],
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supabase) {
      setError("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      return;
    }

    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");

    if (!email || !password) {
      setError("Enter your email and password.");
      return;
    }
    if (mode === "signup" && !name) {
      setError("Enter your name to create an account.");
      return;
    }

    setError(null);
    setPending(true);

    if (mode === "signin") {
      const { error: signErr } = await supabase.auth.signInWithPassword({ email, password });
      setPending(false);
      if (signErr) {
        setError(signErr.message);
        return;
      }
      router.replace(next);
      router.refresh();
      return;
    }

    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const { error: signUpErr } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          name,
        },
        emailRedirectTo: origin ? `${origin}/auth/callback?next=${encodeURIComponent(next)}` : undefined,
      },
    });
    setPending(false);
    if (signUpErr) {
      setError(signUpErr.message);
      return;
    }
    setError("Account created. Check your email to confirm, then sign in.");
    setMode("signin");
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black px-4 pb-16 pt-[var(--header-offset)] text-white sm:px-6">
        <div className="mx-auto mt-8 w-full max-w-md rounded-2xl border border-white/10 bg-neutral-950/90 p-6 shadow-[0_24px_64px_-30px_rgba(0,0,0,0.8)] sm:mt-12 sm:p-7">
          <div className="mb-6 flex rounded-full bg-white/[0.06] p-1">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={[
                "flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                mode === "signin" ? "bg-white text-black" : "text-white/75 hover:text-white",
              ].join(" ")}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={[
                "flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                mode === "signup" ? "bg-white text-black" : "text-white/75 hover:text-white",
              ].join(" ")}
            >
              Create account
            </button>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">{heading}</h1>
          <p className="mt-2 text-sm text-white/65">{subtext}</p>

          <div className="mt-5">
            <GoogleSignInButton
              directOAuth
              className="!w-full !max-w-none rounded-lg border border-white/20 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-white hover:bg-white/[0.1]"
            />
          </div>

          <div className="relative my-5 flex items-center gap-3 py-1">
            <span className="h-px flex-1 bg-white/15" />
            <span className="text-xs font-medium uppercase tracking-wide text-white/45">or continue with email</span>
            <span className="h-px flex-1 bg-white/15" />
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            {error ? (
              <p
                className={[
                  "rounded-lg border px-3 py-2 text-sm",
                  error.startsWith("Account created")
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-100"
                    : "border-rose-500/40 bg-rose-500/10 text-rose-100",
                ].join(" ")}
              >
                {error}
              </p>
            ) : null}
            {mode === "signup" ? (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="auth-name" className="text-sm font-medium text-white/80">
                  Name
                </label>
                <input
                  id="auth-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  disabled={pending}
                  required={mode === "signup"}
                  className="rounded-lg border border-white/15 bg-black px-3 py-2.5 text-white outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-amber-400"
                />
              </div>
            ) : null}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="auth-email" className="text-sm font-medium text-white/80">
                Email
              </label>
              <input
                id="auth-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={pending}
                className="rounded-lg border border-white/15 bg-black px-3 py-2.5 text-white outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="auth-password" className="text-sm font-medium text-white/80">
                Password
              </label>
              <input
                id="auth-password"
                name="password"
                type="password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                required
                disabled={pending}
                minLength={8}
                className="rounded-lg border border-white/15 bg-black px-3 py-2.5 text-white outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </div>
            <button
              type="submit"
              disabled={pending}
              className="mt-1 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Please wait…" : mode === "signin" ? "Sign in with email" : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-sm text-white/55">
            {mode === "signin" ? "Need an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="font-semibold text-amber-400/90 underline-offset-2 hover:underline"
            >
              {mode === "signin" ? "Create one" : "Sign in"}
            </button>
          </p>

          <p className="mt-2 text-sm text-white/55">
            Continue browsing?{" "}
            <Link href="/" className="font-semibold text-amber-400/90 underline-offset-2 hover:underline">
              Back home
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
