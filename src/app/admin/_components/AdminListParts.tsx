"use client";

import type { ReactNode } from "react";
import { Trash2 } from "lucide-react";

import { studioFieldInputClass } from "@/app/admin/_lib/studioTheme";
import { cn } from "@/lib/utils";

export function formatAdminDate(iso: string): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function DeleteIconButton({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[color:var(--c-rule)] text-[color:var(--c-ink)] transition hover:border-rose-400/60 hover:bg-rose-500/10 hover:text-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400/70 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

export function SelectBox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      onClick={(e) => e.stopPropagation()}
      aria-label={label}
      className="h-4 w-4 shrink-0 cursor-pointer accent-[color:var(--c-accent)]"
    />
  );
}

export function Notice({ tone, children }: { tone: "error" | "info"; children: ReactNode }) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "mt-4 rounded-lg border px-3 py-2 text-sm",
        tone === "error"
          ? "border-rose-400/40 bg-rose-500/10 text-rose-500 dark:text-rose-200"
          : "border-[color:var(--c-rule)] bg-[color:color-mix(in_srgb,var(--c-accent)_8%,transparent)] text-[color:var(--c-ink)]",
      )}
    >
      {children}
    </p>
  );
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-[color:var(--c-rule)] px-4 py-4 text-sm text-[color:var(--c-muted)]">
      {children}
    </p>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <label className="flex flex-col gap-2 sm:max-w-sm">
      <span className="text-[0.7rem] font-medium uppercase tracking-[0.12em] text-[color:var(--c-muted)]">Search</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className={cn(studioFieldInputClass, "w-full")}
      />
    </label>
  );
}

/** Appears when rows are ticked: select-all for the visible rows plus a bulk delete. */
export function SelectionBar({
  visibleIds,
  selectedIds,
  onSetAll,
  onClear,
  onDelete,
  deleting,
  noun,
}: {
  visibleIds: string[];
  selectedIds: Set<string>;
  onSetAll: (ids: string[], on: boolean) => void;
  onClear: () => void;
  onDelete: () => void;
  deleting: boolean;
  noun: string;
}) {
  if (visibleIds.length === 0) return null;
  const selectedVisible = visibleIds.filter((id) => selectedIds.has(id)).length;
  const allSelected = selectedVisible === visibleIds.length;

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-[color:var(--c-muted)]">
      <label className="flex cursor-pointer items-center gap-2">
        <SelectBox
          checked={allSelected}
          onChange={() => onSetAll(visibleIds, !allSelected)}
          label={`Select all ${visibleIds.length} ${noun}`}
        />
        Select all
      </label>
      {selectedIds.size > 0 ? (
        <>
          <span className="font-semibold text-[color:var(--c-ink)]">{selectedIds.size} selected</span>
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="inline-flex h-8 items-center gap-1.5 rounded-full border border-rose-400/50 bg-rose-500/10 px-3 font-semibold text-rose-500 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:text-rose-200"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            {deleting ? "Deleting…" : "Delete selected"}
          </button>
          <button type="button" onClick={onClear} className="underline-offset-2 hover:underline">
            Clear
          </button>
        </>
      ) : null}
    </div>
  );
}
