"use client";

import * as Popover from "@radix-ui/react-popover";
import { format } from "date-fns";
import { CalendarDays, ChevronDown } from "lucide-react";
import { useMemo, useState, type CSSProperties } from "react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";

import "react-day-picker/style.css";

/** Parse "YYYY-MM-DD" as a local date (avoids the off-by-one-day you get from `new Date(iso)`). */
function parseYmd(value: string): Date | undefined {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!m) return undefined;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? undefined : d;
}

const triggerClass = cn(
  "flex w-full items-center justify-between gap-2 rounded-xl border border-[color:var(--c-rule)] bg-[color:color-mix(in_srgb,var(--c-bg)_40%,white)] px-3 py-2.5 text-left text-sm text-[color:var(--c-ink)] outline-none transition dark:bg-black/35",
  "hover:border-[color:var(--c-accent)] focus-visible:border-[color:var(--c-accent)] focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_srgb,var(--c-accent)_35%,transparent)]",
);

const popoverClass =
  "culturin-editorial z-[1300] w-[min(calc(100vw-2rem),20rem)] rounded-2xl border border-[color:var(--c-rule)] bg-[color:color-mix(in_srgb,var(--c-bg)_55%,white)] p-3 shadow-xl outline-none dark:bg-[#1c1a17]";

/** Date-only picker in Culturin styling. Value is "YYYY-MM-DD" (or empty). */
export function StudioDateField({
  value,
  onChange,
  placeholder = "Choose a date",
  ariaLabel,
  minDate,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  /** Earliest selectable day, "YYYY-MM-DD" (used so an end date can't precede the start). */
  minDate?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = useMemo(() => parseYmd(value), [value]);
  const min = useMemo(() => (minDate ? parseYmd(minDate) : undefined), [minDate]);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button type="button" className={triggerClass} aria-expanded={open} aria-label={ariaLabel}>
          <span className="flex min-w-0 flex-1 items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0 text-[color:var(--c-accent)]" aria-hidden />
            <span className={cn("truncate", !selected && "text-[color:var(--c-muted)]")}>
              {selected ? format(selected, "MMM d, yyyy") : placeholder}
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
          className={popoverClass}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div
            className="text-[color:var(--c-ink)]"
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
              defaultMonth={selected ?? min}
              disabled={min ? { before: min } : undefined}
              weekStartsOn={1}
              onSelect={(d) => {
                onChange(d ? format(d, "yyyy-MM-dd") : "");
                if (d) setOpen(false);
              }}
              className={cn(
                "rounded-lg",
                "[&_.rdp-caption_label]:text-[color:var(--c-ink)]",
                "[&_.rdp-weekday]:text-[color:var(--c-muted)]",
                "[&_.rdp-day_button]:text-[color:var(--c-ink)]",
                "[&_.rdp-outside]:opacity-40",
                "[&_.rdp-nav_button]:!text-[color:var(--c-accent)] [&_.rdp-chevron]:!fill-[color:var(--c-accent)]",
                "[&_.rdp-day_button:hover]:!bg-[color:color-mix(in_srgb,var(--c-accent)_14%,transparent)]",
                  "[&_.rdp-selected_.rdp-day_button]:!border-[color:var(--c-accent)] [&_.rdp-selected_.rdp-day_button]:!bg-[color:var(--c-accent)] [&_.rdp-selected_.rdp-day_button]:!text-[#1c1a17]",
                  "[&_.rdp-day_button:focus-visible]:!outline-[color:var(--c-accent)]",
              )}
            />
          </div>
          <div className="mt-3 flex justify-end gap-2 border-t border-[color:var(--c-rule)] pt-3">
            <button
              type="button"
              className="rounded-full px-3 py-1.5 text-xs font-medium text-[color:var(--c-muted)] transition hover:bg-[color:color-mix(in_srgb,var(--c-accent)_10%,transparent)]"
              onClick={() => {
                onChange("");
                setOpen(false);
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
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
