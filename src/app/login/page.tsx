"use client";

import { Link } from "next-view-transitions";
import { useSearchParams } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";
import { Suspense, useState, type FormEvent } from "react";

import { useSupabaseAuth } from "../components/SupabaseAuthProvider";
import { getPublicSiteUrl } from "@/lib/siteUrl";
import { editorialScopeClass } from "@/lib/theme/culturinTokens";

type Mode = "signin" | "signup" | "forgot" | "update";

const COPY: Record<Mode, { title: string; sub: string; submit: string }> = {
  signin: { title: "Sign in", sub: "Welcome back to Culturin.", submit: "Sign in" },
  signup: { title: "Create account", sub: "We'll email you a link to confirm your address.", submit: "Create account" },
  forgot: { title: "Reset password", sub: "Enter your email and we'll send you a reset link.", submit: "Send reset link" },
  update: { title: "Choose a new password", sub: "At least 8 characters.", submit: "Save password" },
};

const inputClass =
  "w-full rounded-xl border border-[color:var(--c-rule)] bg-transparent px-4 py-3 text-base text-[color:var(--c-ink)] outline-none transition placeholder:text-[color:var(--c-muted)] placeholder:opacity-70 focus:border-[color:var(--c-accent)] disabled:opacity-60 " +
  // Stop browser autofill painting the field blue.
  "[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_var(--c-bg)] [&:-webkit-autofill]:[-webkit-text-fill-color:var(--c-ink)]";

function Field({ id, label, ...props }: { id: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--c-muted)]">
        {label}
      </label>
      <input id={id} name={id} className={inputClass} {...props} />
    </div>
  );
}

/** Only allow same-site paths as the post-login destination. */
function safeNext(raw: string | null): string {
  return raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/";
}

function LoginForm() {
  const { supabase } = useSupabaseAuth();
  const router = useTransitionRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const initial = params.get("mode");
  const [mode, setMode] = useState<Mode>(initial === "signup" || initial === "update" ? initial : "signin");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "ok"; text: string } | null>(
    params.get("error") === "auth" ? { tone: "error", text: "That link has expired or was already used. Try again." } : null,
  );

  function go(m: Mode) {
    setMode(m);
    setMessage(null);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supabase) {
      setMessage({ tone: "error", text: "Sign-in isn't available right now. Please try again later." });
      return;
    }
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim().toLowerCase();
    const password = String(fd.get("password") ?? "");
    const site = getPublicSiteUrl();

    setMessage(null);
    setPending(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setMessage({ tone: "error", text: error.message === "Invalid login credentials" ? "That email and password don't match." : error.message });
          return;
        }
        router.replace(next);
        router.refresh();
        return;
      }

      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name, name },
            emailRedirectTo: site ? `${site}/auth/callback?next=${encodeURIComponent(next)}` : undefined,
          },
        });
        if (error) {
          setMessage({ tone: "error", text: error.message });
          return;
        }
        setMode("signin");
        setMessage({ tone: "ok", text: "Account created. Check your email to confirm it, then sign in." });
        return;
      }

      if (mode === "forgot") {
        const back = `/login?mode=update&next=${encodeURIComponent(next)}`;
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: site ? `${site}/auth/callback?next=${encodeURIComponent(back)}` : undefined,
        });
        if (error) {
          setMessage({ tone: "error", text: error.message });
          return;
        }
        setMessage({ tone: "ok", text: "If there's an account for that email, a reset link is on its way." });
        return;
      }

      // mode === "update": the reset link has already signed them in.
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setMessage({ tone: "error", text: error.message });
        return;
      }
      router.replace(next);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  const copy = COPY[mode];

  return (
    <div className="w-full max-w-sm">
      <Link href="/" className="font-display text-2xl font-semibold tracking-tight text-[color:var(--c-ink)] no-underline">
        Culturin
      </Link>

      <h1 className="m-0 mt-10 font-display text-4xl font-medium tracking-tight text-[color:var(--c-ink)]">{copy.title}</h1>
      <p className="m-0 mt-2 text-sm text-[color:var(--c-muted)]">{copy.sub}</p>

      <form key={mode} onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
        {mode === "signup" ? <Field id="name" label="Name" type="text" autoComplete="name" required disabled={pending} /> : null}
        {mode !== "update" ? (
          <Field id="email" label="Email" type="email" autoComplete="email" required disabled={pending} />
        ) : null}
        {mode !== "forgot" ? (
          <Field
            id="password"
            label={mode === "update" ? "New password" : "Password"}
            type="password"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            minLength={8}
            required
            disabled={pending}
          />
        ) : null}

        {message ? (
          <p role={message.tone === "error" ? "alert" : "status"} className={`m-0 text-sm ${message.tone === "error" ? "text-rose-500" : "text-emerald-500"}`}>
            {message.text}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="mt-1 rounded-full bg-[color:var(--c-accent)] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#1c1a17] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "One moment…" : copy.submit}
        </button>
      </form>

      <div className="mt-6 flex flex-col gap-2 text-sm text-[color:var(--c-muted)]">
        {mode === "signin" ? (
          <>
            <button type="button" onClick={() => go("forgot")} className="w-fit hover:text-[color:var(--c-ink)]">
              Forgot password?
            </button>
            <p className="m-0">
              New to Culturin?{" "}
              <button type="button" onClick={() => go("signup")} className="font-semibold text-[color:var(--c-accent)] hover:underline">
                Create an account
              </button>
            </p>
          </>
        ) : mode !== "update" ? (
          <p className="m-0">
            {mode === "signup" ? "Already have an account? " : "Remembered it? "}
            <button type="button" onClick={() => go("signin")} className="font-semibold text-[color:var(--c-accent)] hover:underline">
              Sign in
            </button>
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className={`${editorialScopeClass} flex min-h-dvh items-center justify-center bg-[color:var(--c-bg)] px-4 py-16 text-[color:var(--c-ink)]`}>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
