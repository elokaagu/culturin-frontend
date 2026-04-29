"use client";

import * as Popover from "@radix-ui/react-popover";
import { format } from "date-fns";
import { CalendarDays, ChevronDown } from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";

import "react-day-picker/style.css";

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function parseIsoToDate(iso: string): Date | undefined {
  const t = iso.trim();
  if (!t) return undefined;
  const d = new Date(t);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function timeFromDate(d: Date | undefined): string {
  if (!d) return "09:00";
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function toIsoLocal(date: Date, timeHHmm: string): string {
  const [hRaw, mRaw] = timeHHmm.split(":");
  const h = Number.parseInt(hRaw ?? "0", 10);
  const m = Number.parseInt(mRaw ?? "0", 10);
  const out = new Date(date.getFullYear(), date.getMonth(), date.getDate(), Number.isFinite(h) ? h : 0, Number.isFinite(m) ? m : 0, 0, 0);
  return out.toISOString();
}

const triggerClass = cn(
  "flex w-full items-center justify-between gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-left text-sm text-neutral-900 outline-none ring-offset-2 transition",
  "hover:border-neutral-400 focus-visible:border-amber-500/60 focus-visible:ring-2 focus-visible:ring-amber-400/25",
  "dark:border-white/15 dark:bg-black dark:text-white dark:hover:border-white/25 dark:focus-visible:border-amber-400/45 dark:focus-visible:ring-amber-400/20",
);

const popoverSurfaceClass = cn(
  "z-[1300] w-[min(calc(100vw-2rem),20rem)] rounded-2xl border border-neutral-200 bg-white p-3 shadow-xl shadow-neutral-900/10 outline-none",
  "dark:border-white/12 dark:bg-neutral-950 dark:shadow-black/50",
);

type StudioPublishDateFieldProps = {
  name: string;
  label: string;
  /** ISO 8601 string from CMS, or empty */
  defaultValue?: string;
};

export function StudioPublishDateField({ name, label, defaultValue = "" }: StudioPublishDateFieldProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Date | undefined>(() => parseIsoToDate(defaultValue));
  const [time, setTime] = useState(() => timeFromDate(parseIsoToDate(defaultValue)));

  useEffect(() => {
    setSelected(parseIsoToDate(defaultValue));
    setTime(timeFromDate(parseIsoToDate(defaultValue)));
  }, [defaultValue]);

  const hiddenValue = useMemo(() => {
    if (!selected) return "";
    return toIsoLocal(selected, time);
  }, [selected, time]);

  const summary = useMemo(() => {
    if (!selected) return null;
    try {
      const datePart = format(selected, "MMM d, yyyy");
      return `${datePart} · ${time}`;
    } catch {
      return hiddenValue;
    }
  }, [selected, time, hiddenValue]);

  return (
    <div className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-neutral-700 dark:text-white/80">{label}</span>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button type="button" className={triggerClass} aria-expanded={open}>
            <span className="flex min-w-0 flex-1 items-center gap-2">
              <CalendarDays className="h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400/90" aria-hidden />
              <span className={cn("truncate", !summary && "text-neutral-500 dark:text-white/45")}>
                {summary ?? "Choose date & time (optional)"}
              </span>
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-60" aria-hidden />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={8}
            collisionPadding={16}
            className={popoverSurfaceClass}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <div
              className="studio-day-picker text-neutral-900 dark:text-white"
              style={
                {
                  ["--rdp-accent-color" as string]: "#f59e0b",
                  ["--rdp-accent-background-color" as string]: "rgba(245, 158, 11, 0.18)",
                  ["--rdp-day_button-border-radius" as string]: "0.5rem",
                  ["--rdp-today-color" as string]: "#f59e0b",
                } as CSSProperties
              }
            >
              <DayPicker
                mode="single"
                selected={selected}
                onSelect={(d) => setSelected(d)}
                className={cn(
                  "rounded-lg",
                  "[&_.rdp-caption_label]:text-neutral-900 dark:[&_.rdp-caption_label]:text-white",
                  "[&_.rdp-weekday]:text-neutral-500 dark:[&_.rdp-weekday]:text-white/45",
                  "[&_.rdp-day_button]:text-neutral-900 dark:[&_.rdp-day_button]:text-white/90",
                  "[&_.rdp-outside]:opacity-40 dark:[&_.rdp-outside]:opacity-30",
                  "[&_.rdp-disabled]:opacity-40",
                )}
              />
            </div>
            <div className="mt-3 flex flex-col gap-2 border-t border-neutral-200 pt-3 dark:border-white/10">
              <label className="flex items-center gap-2 text-xs font-medium text-neutral-600 dark:text-white/65">
                <span className="shrink-0">Time</span>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  disabled={!selected}
                  className={cn(
                    "min-w-0 flex-1 rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 dark:border-white/15 dark:bg-black dark:text-white",
                    !selected && "cursor-not-allowed opacity-50",
                  )}
                />
              </label>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-600 transition hover:bg-neutral-100 dark:text-white/55 dark:hover:bg-white/10"
                  onClick={() => {
                    setSelected(undefined);
                    setTime("09:00");
                  }}
                >
                  Clear
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600"
                  onClick={() => setOpen(false)}
                >
                  Done
                </button>
              </div>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      <input type="hidden" name={name} value={hiddenValue} />
    </div>
  );
}
