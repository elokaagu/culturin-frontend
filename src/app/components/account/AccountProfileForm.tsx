"use client";

import { useEffect, useState } from "react";

import type { AccountProfileDraft, AccountProfileUser } from "./types";

type AccountProfileFormProps = {
  user: AccountProfileUser;
};

function draftFromUser(user: AccountProfileUser): AccountProfileDraft {
  return {
    email: user.email ?? "",
    username: user.username ?? "",
  };
}

/**
 * Controlled draft profile fields; resets when `user` identity or server fields change.
 */
export function AccountProfileForm({ user }: AccountProfileFormProps) {
  const [draft, setDraft] = useState<AccountProfileDraft>(() => draftFromUser(user));

  useEffect(() => {
    setDraft(draftFromUser(user));
  }, [user]);

  const inputClassName =
    "w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-white/40 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="account-email" className="text-sm font-medium text-white/80">
          Email address
        </label>
        <input
          id="account-email"
          type="email"
          value={draft.email}
          onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
          autoComplete="email"
          className={inputClassName}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="account-username" className="text-sm font-medium text-white/80">
          Username
        </label>
        <input
          id="account-username"
          type="text"
          value={draft.username}
          onChange={(e) => setDraft((d) => ({ ...d, username: e.target.value }))}
          autoComplete="username"
          className={inputClassName}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled
          title="Profile save API is not connected yet."
          className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black opacity-50"
        >
          Save changes
        </button>
        <button
          type="button"
          onClick={() => setDraft(draftFromUser(user))}
          className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white/90 transition-colors hover:border-white/40 hover:bg-white/5"
        >
          Reset
        </button>
      </div>

      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <h3 className="text-base font-semibold">Profile information</h3>
        <p className="mt-2 text-sm text-white/65">
          Photo, display name, and bio will live here once wired to your profile API.
        </p>
      </div>

      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <h3 className="text-base font-semibold text-rose-200">Delete account</h3>
        <p className="mt-2 text-sm text-white/65">
          Destructive actions will require email confirmation before we enable them.
        </p>
      </div>
    </div>
  );
}
