"use client";

import type { AccountProfileUser } from "./types";

type AccountProfileFormProps = {
  user: AccountProfileUser;
};

/**
 * Read-only account identity from the signed-in session.
 * Profile edit/save APIs are not wired yet — avoid fake editable drafts.
 */
export function AccountProfileForm({ user }: AccountProfileFormProps) {
  const fieldClassName =
    "w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 dark:border-white/15 dark:bg-black/40 dark:text-white";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="account-email" className="text-sm font-medium text-neutral-700 dark:text-white/80">
          Email address
        </label>
        <input
          id="account-email"
          type="email"
          value={user.email ?? ""}
          readOnly
          autoComplete="email"
          className={fieldClassName}
        />
      </div>

      {user.username ? (
        <div className="flex flex-col gap-2">
          <label htmlFor="account-username" className="text-sm font-medium text-neutral-700 dark:text-white/80">
            Username
          </label>
          <input
            id="account-username"
            type="text"
            value={user.username}
            readOnly
            autoComplete="username"
            className={fieldClassName}
          />
        </div>
      ) : null}
    </div>
  );
}
