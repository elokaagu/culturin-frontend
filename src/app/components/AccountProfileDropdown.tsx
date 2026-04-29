"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  LogOut,
  MapPin,
  Moon,
  Play,
  Settings,
  Sparkles,
  Sun,
  UserRound,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useTransitionRouter } from "next-view-transitions";

import { useTheme } from "../styles/ThemeContext";

function profileHref(userId: string | undefined) {
  return userId ? `/profile/${userId}` : "/profile";
}

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
  if (parts.length === 1 && parts[0]!.length >= 2) return parts[0]!.slice(0, 2).toUpperCase();
  return name.slice(0, 2).toUpperCase() || "?";
}

const contentClass =
  "z-[1260] min-w-[min(calc(100vw-1.5rem),17.5rem)] overflow-hidden rounded-2xl border border-neutral-200/95 bg-white py-1.5 text-neutral-900 shadow-xl shadow-neutral-900/12 dark:border-white/[0.08] dark:bg-[#161616] dark:text-white dark:shadow-black/50";

const rowClass =
  "flex w-full cursor-pointer select-none items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium outline-none transition-colors data-[highlighted]:bg-neutral-100 data-[highlighted]:text-neutral-950 dark:data-[highlighted]:bg-white/[0.06] dark:data-[highlighted]:text-white";

const rowIconClass = "shrink-0 text-neutral-400 dark:text-white/45";

const sepClass = "my-1 h-px bg-neutral-200/90 dark:bg-white/[0.08]";

const segmentWrapClass = "flex w-full rounded-full bg-neutral-100/95 p-0.5 dark:bg-black/50";

const segmentBtnClass =
  "inline-flex h-8 flex-1 items-center justify-center rounded-full text-neutral-500 transition dark:text-white/50";

const segmentBtnActiveClass =
  "bg-white text-neutral-900 shadow-sm ring-1 ring-neutral-200/80 dark:bg-white/15 dark:text-white dark:ring-0";

type SessionUser = {
  id: string;
  email: string;
  name: string;
};

type AccountProfileDropdownProps = {
  sessionUser: SessionUser;
  avatarUrl?: string | null;
  appearance: "header" | "default";
  supabase: SupabaseClient | null;
  className?: string;
};

export function AccountProfileDropdown({
  sessionUser,
  avatarUrl,
  appearance,
  supabase,
  className,
}: AccountProfileDropdownProps) {
  const router = useTransitionRouter();
  const { mode, setMode } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const label = sessionUser.name?.split(" ")[0] ?? "Account";
  const initials = initialsFromName(sessionUser.name || sessionUser.email);

  const go = useCallback(
    (href: string) => {
      setMenuOpen(false);
      router.push(href);
    },
    [router],
  );

  const headerTriggerClass =
    "inline-flex h-10 shrink-0 items-center gap-0 rounded-full border border-neutral-200/90 bg-white py-1 pl-1 pr-1 text-left shadow-sm outline-none transition hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-amber-500/50 dark:border-white/15 dark:bg-white/[0.06] dark:hover:bg-white/10 dark:focus-visible:ring-amber-400/45";

  const defaultTriggerClass =
    "flex w-full min-w-0 cursor-pointer items-center gap-3 rounded-xl border border-neutral-200/90 bg-white px-3 py-2.5 text-left shadow-sm outline-none transition hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-amber-500/50 dark:border-white/12 dark:bg-white/[0.05] dark:hover:bg-white/[0.08] dark:focus-visible:ring-amber-400/45 max-[428px]:w-full";

  return (
    <DropdownMenu.Root modal={false} open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className={[appearance === "header" ? headerTriggerClass : defaultTriggerClass, className]
            .filter(Boolean)
            .join(" ")}
          aria-label="Account menu"
        >
          <span className="relative flex shrink-0 items-center">
            {avatarUrl ? (
              <span className="relative h-8 w-8 overflow-hidden rounded-full ring-1 ring-black/5 dark:ring-white/10">
                <Image
                  src={avatarUrl}
                  alt={`${sessionUser.name} profile photo`}
                  width={32}
                  height={32}
                  className="h-8 w-8 object-cover"
                  unoptimized
                />
              </span>
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 text-xs font-semibold text-neutral-700 dark:bg-white/10 dark:text-white">
                {initials}
              </span>
            )}
            {appearance === "header" ? (
              <span
                className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-gradient-to-br from-sky-400 to-violet-500 ring-2 ring-white dark:ring-[#161616]"
                aria-hidden
              />
            ) : null}
          </span>
          {appearance === "default" ? (
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-neutral-900 dark:text-white">{label}</span>
              <span className="block truncate text-xs font-normal text-neutral-500 dark:text-white/50">Account</span>
            </span>
          ) : null}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={contentClass}
          sideOffset={10}
          align="end"
          collisionPadding={12}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DropdownMenu.Item className={rowClass} onSelect={() => go(profileHref(sessionUser.id))}>
            <span>View profile</span>
            <UserRound className={`${rowIconClass} h-4 w-4`} strokeWidth={2} aria-hidden />
          </DropdownMenu.Item>

          <DropdownMenu.Item className={rowClass} onSelect={() => go("/settings")}>
            <span>Settings</span>
            <Settings className={`${rowIconClass} h-4 w-4`} strokeWidth={2} aria-hidden />
          </DropdownMenu.Item>

          <DropdownMenu.Item className={rowClass} onSelect={() => go("/community")}>
            <span>Community</span>
            <Users className={`${rowIconClass} h-4 w-4`} strokeWidth={2} aria-hidden />
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className={rowClass}
            onSelect={() => {
              void (supabase?.auth.signOut() ?? Promise.resolve()).then(() => go("/"));
            }}
          >
            <span>Logout</span>
            <LogOut className={`${rowIconClass} h-4 w-4`} strokeWidth={2} aria-hidden />
          </DropdownMenu.Item>

          <DropdownMenu.Separator className={sepClass} />

          <DropdownMenu.Item className={rowClass} onSelect={() => go("/stream")}>
            <span>Watch the stream</span>
            <Play className={`${rowIconClass} h-4 w-4`} strokeWidth={2} aria-hidden />
          </DropdownMenu.Item>

          <DropdownMenu.Separator className={sepClass} />

          <div className="px-3 py-2">
            <p className="mb-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-neutral-500 dark:text-white/45">
              Theme
            </p>
            <div className={segmentWrapClass}>
              <button
                type="button"
                className={`${segmentBtnClass} ${mode === "light" ? segmentBtnActiveClass : ""}`}
                aria-pressed={mode === "light"}
                aria-label="Light theme"
                onClick={() => setMode("light")}
              >
                <Sun className="h-4 w-4" strokeWidth={2} />
              </button>
              <button
                type="button"
                className={`${segmentBtnClass} ${mode === "dark" ? segmentBtnActiveClass : ""}`}
                aria-pressed={mode === "dark"}
                aria-label="Dark theme"
                onClick={() => setMode("dark")}
              >
                <Moon className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="px-3 pb-1 pt-0.5">
            <p className="mb-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-neutral-500 dark:text-white/45">
              Discover
            </p>
            <div className={`${segmentWrapClass} gap-0.5`}>
              <button
                type="button"
                className={segmentBtnClass}
                aria-label="Destinations"
                onClick={() => go("/destinations")}
              >
                <MapPin className="h-4 w-4" strokeWidth={2} />
              </button>
              <button type="button" className={segmentBtnClass} aria-label="Stream" onClick={() => go("/stream")}>
                <Play className="h-4 w-4" strokeWidth={2} />
              </button>
              <button
                type="button"
                className={segmentBtnClass}
                aria-label="Curated experiences"
                onClick={() => go("/curated-experiences")}
              >
                <Sparkles className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="border-t border-neutral-200/90 px-2 py-1.5 dark:border-white/[0.08]">
            <DropdownMenu.Item
              className="cursor-pointer rounded-lg px-2 py-2 text-center text-xs font-semibold text-amber-800 outline-none data-[highlighted]:bg-amber-500/10 dark:text-amber-300/90 dark:data-[highlighted]:bg-amber-400/10"
              onSelect={() => go("/studio")}
            >
              Open Studio
            </DropdownMenu.Item>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
