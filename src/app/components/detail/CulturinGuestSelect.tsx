"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type CulturinGuestSelectProps = {
  /** Stable id for label association */
  id: string;
  label: string;
  value: number;
  options: readonly number[];
  onChange: (n: number) => void;
};

function guestLabel(n: number) {
  return `${n} ${n === 1 ? "guest" : "guests"}`;
}

export function CulturinGuestSelect({ id, label, value, options, onChange }: CulturinGuestSelectProps) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc, true);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("mousedown", onDoc, true);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <label
        htmlFor={id}
        className="m-0 block text-[0.64rem] font-semibold uppercase tracking-wide text-amber-200/70"
      >
        {label}
      </label>
      <button
        id={id}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-haspopup="listbox"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "mt-1.5 flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-white/20 bg-black/50 px-3 text-left text-sm font-medium text-white shadow-inner shadow-black/20 transition",
          "hover:border-amber-400/40 hover:bg-white/[0.06]",
          "focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-400/55 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
          open && "border-amber-400/50 bg-white/[0.07] ring-1 ring-amber-400/25",
        )}
      >
        <span>{guestLabel(value)}</span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-white/50 transition-transform duration-200", open && "rotate-180")}
          aria-hidden
        />
      </button>
      {open ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-[120] mt-1 max-h-60 w-full overflow-auto rounded-xl border border-white/15 bg-neutral-950/98 py-1 shadow-[0_20px_50px_rgba(0,0,0,0.65)] backdrop-blur-md supports-[backdrop-filter]:bg-neutral-950/92"
        >
          {options.map((n) => (
            <li key={n} role="presentation" className="px-1">
              <button
                type="button"
                role="option"
                aria-selected={n === value}
                onClick={() => {
                  onChange(n);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition",
                  n === value
                    ? "bg-amber-400/20 text-amber-50"
                    : "text-white/90 hover:bg-white/[0.08] hover:text-white",
                )}
              >
                <span className="flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden>
                  <Check className={cn("h-3.5 w-3.5 text-amber-400", n !== value && "opacity-0")} strokeWidth={2.5} />
                </span>
                {guestLabel(n)}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
