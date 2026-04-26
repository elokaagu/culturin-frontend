"use client";

import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"] as const;

function parseIsoToLocalDate(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

function toIso(d: Date): string {
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${mo}-${day}`;
}

function atStartOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function isIsoBeforeMin(iso: string, minIso: string): boolean {
  const a = parseIsoToLocalDate(iso);
  const b = parseIsoToLocalDate(minIso);
  if (!a || !b) return false;
  return atStartOfDay(a) < atStartOfDay(b);
}

function displayLabel(iso: string): string {
  if (!iso) return "Add date";
  const d = parseIsoToLocalDate(iso);
  if (!d) return "Add date";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

type CulturinBookingDateFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (iso: string) => void;
  minIso: string;
  helpText?: string;
  className?: string;
  /** Pin the popover to the end of the field (e.g. right column in a grid). */
  alignEnd?: boolean;
};

export function CulturinBookingDateField({
  id: idProp,
  label,
  value,
  onChange,
  minIso,
  helpText,
  className,
  alignEnd = false,
}: CulturinBookingDateFieldProps) {
  const uid = useId();
  const listboxId = `${uid}-listbox`;
  const labelId = `${uid}-label`;
  const buttonId = idProp;
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => {
    const s = (value ? parseIsoToLocalDate(value) : null) ?? parseIsoToLocalDate(minIso) ?? new Date();
    return new Date(s.getFullYear(), s.getMonth(), 1);
  });
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (rootRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const y = view.getFullYear();
  const m = view.getMonth();
  const first = new Date(y, m, 1);
  const firstDow = (first.getDay() + 6) % 7; // Mon = 0
  const lastDay = new Date(y, m + 1, 0).getDate();
  const minD = parseIsoToLocalDate(minIso);
  const minT = minD ? atStartOfDay(minD) : 0;
  const todayStr = toIso(new Date());
  const selected = value ? parseIsoToLocalDate(value) : null;

  const days: (null | { day: number; iso: string; disabled: boolean; isSelected: boolean })[] = [];
  for (let i = 0; i < firstDow; i++) days.push(null);
  for (let d = 1; d <= lastDay; d++) {
    const cell = new Date(y, m, d);
    const iso = toIso(cell);
    const t = atStartOfDay(cell);
    const disabled = t < minT;
    const isSelected = Boolean(selected && atStartOfDay(selected) === t);
    days.push({ day: d, iso, disabled, isSelected });
  }
  const pad = (7 - (days.length % 7)) % 7;
  for (let i = 0; i < pad; i++) days.push(null);

  const monthLabel = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(
    new Date(y, m, 1),
  );

  const panelNode = open ? (
    <div
      ref={panelRef}
      id={listboxId}
      role="listbox"
      className={cn(
        "absolute top-full z-[200] mt-1.5 max-h-[min(28rem,80vh)] w-[min(17.5rem,calc(100vw-2rem))] max-w-[calc(100vw-1.5rem)] overflow-auto rounded-2xl border border-white/15 bg-zinc-950 p-3 text-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.85)] ring-1 ring-white/5",
        alignEnd ? "right-0 left-auto" : "left-0",
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-1 px-0.5">
        <button
          type="button"
          onClick={() => setView((v) => new Date(v.getFullYear(), v.getMonth() - 1, 1))}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 text-white/80 transition hover:border-white/25 hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-400/60"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="m-0 flex-1 text-center text-sm font-semibold tracking-tight text-white" aria-live="polite">
          {monthLabel}
        </p>
        <button
          type="button"
          onClick={() => setView((v) => new Date(v.getFullYear(), v.getMonth() + 1, 1))}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 text-white/80 transition hover:border-white/25 hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-400/60"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="mb-1 grid grid-cols-7 gap-0.5 text-center text-[0.65rem] font-medium uppercase tracking-wide text-white/45">
        {WEEKDAYS.map((d, idx) => (
          <span key={`${idx}-${d}`} className="py-1.5">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center text-sm">
        {days.map((cell, i) => {
          if (cell === null) {
            return <span key={`e-${i}`} className="aspect-square min-h-[2.25rem]" aria-hidden />;
          }
          return (
            <button
              key={cell.iso}
              type="button"
              role="option"
              aria-selected={cell.isSelected}
              disabled={cell.disabled}
              onClick={() => {
                if (cell.disabled) return;
                onChange(cell.iso);
                setOpen(false);
              }}
              className={cn(
                "flex aspect-square min-h-[2.25rem] items-center justify-center rounded-lg font-medium transition focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-400/70",
                cell.disabled
                  ? "cursor-not-allowed text-white/20"
                  : "text-white/90 hover:bg-white/10",
                cell.isSelected && "bg-amber-400 text-neutral-950 shadow-sm hover:bg-amber-300",
              )}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2">
        <button
          type="button"
          onClick={() => {
            onChange("");
            setOpen(false);
          }}
          className="text-xs font-medium text-white/55 underline-offset-2 transition hover:text-white"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={() => {
            if (isIsoBeforeMin(todayStr, minIso)) {
              onChange(minIso);
            } else {
              onChange(todayStr);
            }
            setOpen(false);
          }}
          className="text-xs font-semibold text-amber-400/95 transition hover:text-amber-300"
        >
          Today
        </button>
      </div>
    </div>
  ) : null;

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <span id={labelId} className="m-0 block text-[0.64rem] font-semibold uppercase tracking-wide text-white/55">
        {label}
      </span>
      <div className="mt-1.5 flex min-h-[2rem] items-stretch">
        <button
          id={buttonId}
          type="button"
          ref={triggerRef}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          onClick={() => {
            if (!open) {
              if (value) {
                const d = parseIsoToLocalDate(value);
                if (d) setView(new Date(d.getFullYear(), d.getMonth(), 1));
              }
              setOpen(true);
            } else {
              setOpen(false);
            }
          }}
          aria-labelledby={labelId}
          className="flex w-full min-w-0 items-center justify-between gap-2 rounded-md border border-white/15 bg-white/[0.06] px-2.5 py-2 text-left text-sm text-white transition hover:border-white/25 hover:bg-white/[0.09] focus:outline-none focus:ring-2 focus:ring-amber-400/50"
        >
          <span className={cn("truncate", !value && "text-white/50")}>
            {displayLabel(value || "")}
          </span>
          <Calendar className="h-4 w-4 shrink-0 text-white/55" aria-hidden />
        </button>
      </div>
      {panelNode}
      {helpText ? <p className="m-0 mt-0.5 text-xs text-white/40">{helpText}</p> : null}
    </div>
  );
}

export { isIsoBeforeMin, toIso, parseIsoToLocalDate };
