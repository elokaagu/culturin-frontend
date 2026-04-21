"use client";

import { GoogleSignInButton } from "../components/AuthButtons";
import { CredentialsForm } from "../components/CredentialsForm";
import Header from "../components/Header";

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="mx-auto flex min-h-screen max-w-md flex-col gap-6 bg-black px-5 pb-16 pt-[var(--header-offset)] text-white">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <GoogleSignInButton />
        <CredentialsForm />
      </main>
    </>
  );
}
