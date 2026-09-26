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
  "flex w-full items-center justify-between gap-2 rounded-xl border border-[color:var(--c-rule)] bg-[color:color-mix(in_srgb,var(--c-bg)_40%,white)] px-3 py-2.5 text-left text-sm text-[color:var(--c-ink)] outline-none transition dark:bg-black/35",
  "hover:border-[color:var(--c-accent)] focus-visible:border-[color:var(--c-accent)] focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_srgb,var(--c-accent)_35%,transparent)]",
);

const popoverSurfaceClass = cn(
  "culturin-editorial z-[1300] w-[min(calc(100vw-2rem),20rem)] rounded-2xl border border-[color:var(--c-rule)] bg-[color:color-mix(in_srgb,var(--c-bg)_55%,white)] p-3 shadow-xl outline-none dark:bg-[#1c1a17]",
);

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 15, 30, 45];

const pillBase =
  "flex h-8 items-center justify-center rounded-lg border text-xs font-medium tabular-nums transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--c-accent)] disabled:cursor-not-allowed";

function Pill({ selected, disabled, onClick, children }: { selected: boolean; disabled: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(pillBase, disabled && "opacity-50")}
      style={
        selected
          ? { background: "var(--c-accent)", borderColor: "var(--c-accent)", color: "#1c1a17" }
          : { borderColor: "var(--c-rule)", color: "var(--c-ink)" }
      }
    >
      {children}
    </button>
  );
}

/** Branded replacement for the browser's native time popup, which can't be themed. */
function TimePills({ time, onChange, disabled }: { time: string; onChange: (t: string) => void; disabled: boolean }) {
  const [hRaw, mRaw] = time.split(":");
  const hour = Number.parseInt(hRaw ?? "9", 10);
  const minute = Number.parseInt(mRaw ?? "0", 10);
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--c-muted)]">Time</span>
      <div className="grid grid-cols-6 gap-1.5" role="group" aria-label="Hour">
        {HOURS.map((h) => (
          <Pill key={h} selected={h === hour} disabled={disabled} onClick={() => onChange(`${pad2(h)}:${pad2(Number.isFinite(minute) ? minute : 0)}`)}>
            {pad2(h)}
          </Pill>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-1.5" role="group" aria-label="Minute">
        {MINUTES.map((m) => (
          <Pill key={m} selected={m === minute} disabled={disabled} onClick={() => onChange(`${pad2(Number.isFinite(hour) ? hour : 9)}:${pad2(m)}`)}>
            {`:${pad2(m)}`}
          </Pill>
        ))}
      </div>
    </div>
  );
}

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
              <CalendarDays className="h-4 w-4 shrink-0 text-culturin-700 dark:text-culturin-400/90" aria-hidden />
              <span className={cn("truncate", !summary && "text-neutral-500 dark:text-white/58")}>
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
                  ["--rdp-accent-color" as string]: "#cd6b3f",
                  ["--rdp-accent-background-color" as string]: "rgba(205, 107, 63, 0.18)",
                  ["--rdp-day_button-border-radius" as string]: "0.5rem",
                  ["--rdp-today-color" as string]: "#cd6b3f",
                  ["--rdp-selected-border" as string]: "2px solid #cd6b3f",
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
                  "[&_.rdp-nav_button]:!text-[color:var(--c-accent)] [&_.rdp-chevron]:!fill-[color:var(--c-accent)]",
                  "[&_.rdp-day_button:hover]:!bg-[color:color-mix(in_srgb,var(--c-accent)_14%,transparent)]",
                  "[&_.rdp-selected_.rdp-day_button]:!border-[color:var(--c-accent)] [&_.rdp-selected_.rdp-day_button]:!bg-[color:var(--c-accent)] [&_.rdp-selected_.rdp-day_button]:!text-[#1c1a17]",
                  "[&_.rdp-day_button:focus-visible]:!outline-[color:var(--c-accent)]",
                )}
              />
            </div>
            <div className="mt-3 flex flex-col gap-2 border-t border-[color:var(--c-rule)] pt-3">
              <TimePills time={time} onChange={setTime} disabled={!selected} />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded-full px-3 py-1.5 text-xs font-medium text-[color:var(--c-muted)] transition hover:bg-[color:color-mix(in_srgb,var(--c-accent)_10%,transparent)]"
                  onClick={() => {
                    setSelected(undefined);
                    setTime("09:00");
                  }}
                >
                  Clear
                </button>
                <button
                  type="button"
                  className="rounded-full bg-[color:var(--c-ink)] px-3 py-1.5 text-xs font-semibold text-[color:var(--c-bg)] transition hover:opacity-90"
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
