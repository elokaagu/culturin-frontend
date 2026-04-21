"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

type SaveButtonProps = {
  contentId: string;
};

export default function SaveButton({ contentId }: SaveButtonProps) {
  const { data: session } = useSession();
  const [pending, setPending] = useState(false);

  const handleSave = async () => {
    if (!session) {
      toast.error("Sign in to save articles.");
      return;
    }

    setPending(true);
    try {
      const response = await fetch("/api/save-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Could not save the article");
      }
      toast.success("Article saved.");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Could not save the article";
      toast.error(message);
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSave}
      disabled={pending}
      className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Saving…" : "Save article"}
    </button>
  );
}
