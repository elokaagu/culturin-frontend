"use client";

import { useRef, useState } from "react";

import { useSupabaseAuth } from "@/app/components/SupabaseAuthProvider";
import {
  formatStorageUploadError,
  resolveProfileImageContentType,
} from "@/lib/supabase/profileAvatarUpload";
import { SUPABASE_PUBLIC_MEDIA_BUCKET } from "@/lib/storageConstants";

type StudioImageUploadButtonProps = {
  onUploaded: (publicUrl: string) => void;
  buttonLabel?: string;
};

function sanitizeFileName(name: string): string {
  return name.replace(/[^\w.+-]+/g, "-").replace(/^-+|-+$/g, "") || "upload.bin";
}

export function StudioImageUploadButton({ onUploaded, buttonLabel = "Upload image" }: StudioImageUploadButtonProps) {
  const { supabase, user } = useSupabaseAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !supabase || !user) return;

    const contentType = resolveProfileImageContentType(file);
    if (!contentType) {
      setMessage("Use JPEG, PNG, WebP, GIF, or HEIC/HEIF.");
      return;
    }

    setUploading(true);
    setMessage(null);
    const path = `${user.id}/studio/${Date.now()}-${sanitizeFileName(file.name)}`;
    const { data, error } = await supabase.storage
      .from(SUPABASE_PUBLIC_MEDIA_BUCKET)
      .upload(path, file, { cacheControl: "3600", upsert: false, contentType });

    setUploading(false);
    if (error) {
      setMessage(formatStorageUploadError(error));
      return;
    }

    const { data: pub } = supabase.storage.from(SUPABASE_PUBLIC_MEDIA_BUCKET).getPublicUrl(data.path);
    onUploaded(pub.publicUrl);
    setMessage("Uploaded.");
  };

  const disabled = uploading || !supabase || !user;

  return (
    <div className="flex flex-col items-start gap-1.5">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,.heic,.heif"
        className="sr-only"
        onChange={onFileChange}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="inline-flex h-8 items-center rounded-full border border-[color:var(--c-rule)] bg-[color:color-mix(in_srgb,var(--c-bg)_40%,white)] px-3 text-xs font-medium text-[color:var(--c-ink)] transition hover:border-[color:var(--c-accent)] hover:bg-[color:color-mix(in_srgb,var(--c-accent)_12%,transparent)] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white/[0.04]"
      >
        {uploading ? "Uploading..." : buttonLabel}
      </button>
      {message ? <p className="m-0 text-[11px] text-[color:var(--c-muted)]">{message}</p> : null}
      {!supabase ? (
        <p className="m-0 text-[11px] text-[color:var(--c-muted)]">Uploads aren’t available in this preview.</p>
      ) : null}
    </div>
  );
}
