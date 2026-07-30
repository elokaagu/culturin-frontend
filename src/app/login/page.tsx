"use client";

import { Link } from "next-view-transitions";
import { useSearchParams } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";
import { Suspense, useMemo, useState } from "react";

import { GoogleSignInButton } from "../components/AuthButtons";
import IslandNav from "../components/IslandNav";
import HomeFooter from "../components/HomeFooter";
import { editorialScopeClass, EDITORIAL_BG, EDITORIAL_INK } from "@/lib/theme/culturinTokens";
import { useSupabaseAuth } from "../components/SupabaseAuthProvider";
import { getPublicSiteUrl } from "@/lib/siteUrl";

const displayFont = { fontFamily: "var(--font-display), 'Times New Roman', serif" };
const fieldClass = "rounded-lg border px-3 py-2.5 outline-none ring-offset-2 focus-visible:ring-2";
const fieldStyle = { borderColor: "var(--c-rule)", background: "var(--c-bg)", color: "var(--c-ink)" };

function AuthUnavailableBanner() {
  const { supabase } = useSupabaseAuth();
  if (supabase) return null;
  return (
    <p
      className="mb-4 rounded-lg border px-3 py-2.5 text-sm"
      style={{ borderColor: "#e08a5b", background: "rgba(224,138,91,0.1)", color: "var(--c-ink)" }}
      role="status"
    >
      Signing in isn&apos;t available in this build. Try again later, or contact support if you need help.
    </p>
  );
}

function LoginPageContent() {
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
      setError("Signing in isn’t available right now. Try again later or contact support.");
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

    const siteUrl = getPublicSiteUrl();
    const { error: signUpErr } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          name,
        },
        emailRedirectTo: siteUrl
          ? `${siteUrl}/auth/callback?next=${encodeURIComponent(next)}`
          : undefined,
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
    <div className={editorialScopeClass} style={{ background: EDITORIAL_BG, color: EDITORIAL_INK }}>
      <IslandNav />
      <main className="min-h-dvh px-4 pb-16 sm:px-6" style={{ paddingTop: "8rem" }}>
        <div className="mx-auto mt-8 w-full max-w-md rounded-2xl border p-6 sm:mt-12 sm:p-7" style={{ borderColor: "var(--c-rule)" }}>
          <div className="mb-6 flex rounded-full p-1" style={{ background: "rgba(28,26,23,0.06)" }}>
            <button
              type="button"
              onClick={() => setMode("signin")}
              className="flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors"
              style={mode === "signin" ? { background: "var(--c-bg)", color: "var(--c-ink)", boxShadow: "0 0 0 1px var(--c-rule)" } : { color: "var(--c-muted)" }}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className="flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors"
              style={mode === "signup" ? { background: "var(--c-bg)", color: "var(--c-ink)", boxShadow: "0 0 0 1px var(--c-rule)" } : { color: "var(--c-muted)" }}
            >
              Create account
            </button>
          </div>

          <h1 className="text-2xl font-medium tracking-tight" style={{ ...displayFont, color: "var(--c-ink)" }}>{heading}</h1>
          <p className="mt-2 text-sm" style={{ color: "var(--c-muted)" }}>{subtext}</p>

          <div className="mt-4">
            <AuthUnavailableBanner />
          </div>

          <div className="mt-5">
            <GoogleSignInButton
              directOAuth
              className="!w-full !max-w-none rounded-lg border px-4 py-3 text-sm font-semibold transition hover:opacity-90"
            />
          </div>

          <div className="relative my-5 flex items-center gap-3 py-1">
            <span className="h-px flex-1" style={{ background: "var(--c-rule)" }} />
            <span className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--c-muted)" }}>or continue with email</span>
            <span className="h-px flex-1" style={{ background: "var(--c-rule)" }} />
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            {error ? (
              <p
                className="rounded-lg border px-3 py-2 text-sm"
                style={
                  error.startsWith("Account created")
                    ? { borderColor: "rgba(16,185,129,0.4)", background: "rgba(16,185,129,0.08)", color: "var(--c-ink)" }
                    : { borderColor: "rgba(244,63,94,0.4)", background: "rgba(244,63,94,0.08)", color: "var(--c-ink)" }
                }
              >
                {error}
              </p>
            ) : null}
            {mode === "signup" ? (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="auth-name" className="text-sm font-medium" style={{ color: "var(--c-ink)" }}>
                  Name
                </label>
                <input
                  id="auth-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  disabled={pending}
                  required={mode === "signup"}
                  className={fieldClass}
                  style={fieldStyle}
                />
              </div>
            ) : null}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="auth-email" className="text-sm font-medium" style={{ color: "var(--c-ink)" }}>
                Email
              </label>
              <input
                id="auth-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={pending}
                className={fieldClass}
                style={fieldStyle}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="auth-password" className="text-sm font-medium" style={{ color: "var(--c-ink)" }}>
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
                className={fieldClass}
                style={fieldStyle}
              />
            </div>
            <button
              type="submit"
              disabled={pending}
              className="mt-1 rounded-full px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ background: "var(--c-accent)" }}
            >
              {pending ? "Please wait…" : mode === "signin" ? "Sign in with email" : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-sm" style={{ color: "var(--c-muted)" }}>
            {mode === "signin" ? "Need an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="font-semibold underline-offset-2 hover:underline"
              style={{ color: "var(--c-accent)" }}
            >
              {mode === "signin" ? "Create one" : "Sign in"}
            </button>
          </p>

          <p className="mt-2 text-sm" style={{ color: "var(--c-muted)" }}>
            Continue browsing?{" "}
            <Link href="/" className="font-semibold underline-offset-2 hover:underline" style={{ color: "var(--c-accent)" }}>
              Back home
            </Link>
          </p>
        </div>
      </main>
      <HomeFooter />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh" style={{ background: "#1c1a17", paddingTop: "8rem" }} />}>
      <LoginPageContent />
    </Suspense>
  );
}
