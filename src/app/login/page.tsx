"use client";

import Link from "next/link";

import { GoogleSignInButton } from "../components/AuthButtons";
import Header from "../components/Header";
import SignInForm from "../components/auth/SignInForm";

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="mx-auto flex min-h-screen max-w-md flex-col gap-8 bg-neutral-50 px-5 pb-16 pt-[var(--header-offset)] text-neutral-900 dark:bg-black dark:text-white">
        <div>
          <h1 className="text-2xl font-semibold">Sign in</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-white/65">
            Use your Culturin account. New here?{" "}
            <Link href="/register" className="font-medium text-amber-700 underline-offset-2 hover:underline dark:text-amber-400">
              Create an account
            </Link>
            .
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <GoogleSignInButton className="!w-full !max-w-none rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold shadow-sm hover:bg-neutral-50 dark:border-white/15 dark:bg-neutral-950 dark:hover:bg-neutral-900" />
          <div className="relative flex items-center gap-3 py-1">
            <span className="h-px flex-1 bg-neutral-200 dark:bg-white/10" />
            <span className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-white/45">or</span>
            <span className="h-px flex-1 bg-neutral-200 dark:bg-white/10" />
          </div>
          <SignInForm />
        </div>
      </main>
    </>
  );
}
