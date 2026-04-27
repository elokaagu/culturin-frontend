"use client";

import { useState } from "react";

type Props = {
  targetUserId: string;
  initialFollowing: boolean;
  disabled?: boolean;
  onChange?: (next: boolean) => void;
};

export default function FollowTravelerButton({ targetUserId, initialFollowing, disabled = false, onChange }: Props) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = async () => {
    if (disabled || saving) return;
    setSaving(true);
    setError(null);
    const next = !isFollowing;
    const res = await fetch("/api/me/follows", {
      method: next ? "POST" : "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUserId }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      setError(data.message ?? "Could not update follow status.");
      return;
    }
    setIsFollowing(next);
    onChange?.(next);
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={() => void toggle()}
        disabled={disabled || saving}
        className={
          isFollowing
            ? "rounded-full border border-amber-300/70 bg-amber-100/80 px-3 py-1.5 text-xs font-semibold text-amber-900 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-amber-200/60 dark:bg-amber-300/20 dark:text-amber-100"
            : "rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/20 dark:bg-white/10 dark:text-white"
        }
      >
        {saving ? "Saving…" : isFollowing ? "Following" : "Follow"}
      </button>
      {error ? <p className="m-0 text-[11px] text-amber-700 dark:text-amber-300">{error}</p> : null}
    </div>
  );
}
