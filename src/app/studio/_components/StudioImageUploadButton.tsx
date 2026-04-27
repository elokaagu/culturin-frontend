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
        className="inline-flex h-8 items-center rounded-full border border-neutral-300 bg-white px-3 text-xs font-medium text-neutral-800 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/20 dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/10"
      >
        {uploading ? "Uploading..." : buttonLabel}
      </button>
      {message ? <p className="m-0 text-[11px] text-neutral-500 dark:text-white/55">{message}</p> : null}
      {!supabase ? (
        <p className="m-0 text-[11px] text-neutral-500 dark:text-white/55">Configure Supabase to upload files.</p>
      ) : null}
    </div>
  );
}
