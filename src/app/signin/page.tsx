"use client";

import Image from "next/image";
import Link from "next/link";

import { GoogleSignInButton } from "../components/AuthButtons";

export default function SigninPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white md:flex-row md:items-center md:justify-between">
      <div className="flex w-full flex-col items-center px-6 py-10 md:w-1/2 md:items-start md:py-16">
        <Link href="/" className="inline-block">
          <Image
            src="/culturin_logo.svg"
            width={200}
            height={200}
            draggable={false}
            alt="Culturin logo"
            priority
          />
        </Link>
      </div>
      <div className="flex w-full flex-col justify-center gap-6 px-6 py-10 md:w-1/2 md:max-w-lg md:pr-12">
        <div>
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
            Explore the art of Culturin
          </h1>
          <p className="mt-2 text-white/70">Join today.</p>
        </div>
        <div className="flex flex-col gap-4">
          <Link
            href="/register"
            className="inline-flex w-full items-center justify-center rounded-lg border border-white/20 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Sign up
          </Link>
          <GoogleSignInButton />
        </div>
      </div>
    </div>
  );
}
