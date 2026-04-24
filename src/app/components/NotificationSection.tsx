"use client";

import { useState } from "react";
import { useAppAuth } from "./SupabaseAuthProvider";

export default function NotificationSection() {
  const { data: session } = useAppAuth();
  const [mobile, setMobile] = useState("");

  return (
    <section
      aria-label="Notification preferences"
      className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 text-white"
    >
      <header>
        <h2 className="text-2xl font-semibold">Notifications</h2>
        <p className="mt-2 text-sm text-white/70">
          Recommended reading and alerts. Full preference controls will connect here
          when the API is ready.
        </p>
      </header>

      <div className="flex flex-col gap-4 rounded-lg border border-white/10 bg-white/5 p-5">
        <h3 className="text-base font-semibold">Recommended reading</h3>
        <p className="text-sm text-white/75">
          Featured stories, videos, and packages we think you will enjoy based on your
          reading history.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="notif-mobile" className="text-sm font-medium text-white/80">
          Mobile number (optional)
        </label>
        <input
          id="notif-mobile"
          type="tel"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          autoComplete="tel"
          disabled={!session}
          placeholder={session ? "+1 …" : "Sign in to add"}
          className="max-w-md rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-white/40 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    </section>
  );
}
