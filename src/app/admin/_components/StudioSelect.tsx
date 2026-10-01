"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type SelectOption = { value: string; label: string };

/**
 * Culturin's dropdown for Studio, in the site's colour tokens (light and dark), in place of the
 * browser's native menu. Works inside plain forms (a hidden
 * input carries `name`/value), controlled or not, with full keyboard support: arrows, Home/End,
 * Enter/Space, Escape and type-to-jump.
 */
export function StudioSelect({
  name,
  options,
  defaultValue,
  value: controlled,
  onChange,
  id,
  className,
  "aria-label": ariaLabel,
  disabled,
}: {
  name?: string;
  options: SelectOption[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  id?: string;
  className?: string;
  "aria-label"?: string;
  disabled?: boolean;
}) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? options[0]?.value ?? "");
  const value = controlled ?? uncontrolled;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const typed = useRef({ text: "", at: 0 });
  const listId = useId();
  const current = options.find((o) => o.value === value) ?? options[0];

  const choose = (v: string) => {
    if (controlled === undefined) setUncontrolled(v);
    onChange?.(v);
    setOpen(false);
  };

  const openList = () => {
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  useEffect(() => {
    if (open) list.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    const last = options.length - 1;
    if (!open && ["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      return openList();
    }
    if (!open) return;
    if (e.key === "ArrowDown") setActive((a) => Math.min(last, a + 1));
    else if (e.key === "ArrowUp") setActive((a) => Math.max(0, a - 1));
    else if (e.key === "Home") setActive(0);
    else if (e.key === "End") setActive(last);
    else if (e.key === "Enter" || e.key === " ") choose(options[active].value);
    else if (e.key === "Escape" || e.key === "Tab") return setOpen(false);
    else if (e.key.length === 1) {
      // Type to jump: "ne" → New York.
      const now = Date.now();
      typed.current = { text: (now - typed.current.at < 700 ? typed.current.text : "") + e.key.toLowerCase(), at: now };
      const hit = options.findIndex((o) => o.label.toLowerCase().startsWith(typed.current.text));
      if (hit >= 0) setActive(hit);
      return;
    } else return;
    e.preventDefault();
  };

  return (
    <div ref={root} className={cn("relative", className)}>
      {name ? <input type="hidden" name={name} value={value} /> : null}
      <button
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-[color:var(--c-rule)] bg-[color:color-mix(in_srgb,var(--c-bg)_40%,white)] px-3.5 py-2.5 text-left text-sm text-[color:var(--c-ink)] shadow-inner outline-none transition hover:border-[color:var(--c-muted)] focus-visible:border-[color:var(--c-accent)] focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_srgb,var(--c-accent)_35%,transparent)] disabled:opacity-50 aria-expanded:border-[color:var(--c-accent)] dark:bg-black/35"
      >
        <span className="truncate">{current?.label}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-[color:var(--c-muted)] transition", open && "rotate-180")} aria-hidden />
      </button>
      {open ? (
        <ul
          ref={list}
          id={listId}
          role="listbox"
          className="absolute left-0 z-50 mt-1.5 max-h-72 w-full min-w-44 overflow-auto rounded-2xl border border-[color:var(--c-rule)] bg-[color:var(--c-bg)] p-1.5 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.45)]"
        >
          {options.map((o, i) => {
            const selected = o.value === value;
            return (
              <li
                key={o.value}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={selected}
                onPointerEnter={() => setActive(i)}
                onPointerDown={(e) => e.preventDefault()}
                onClick={() => choose(o.value)}
                className={cn("flex cursor-pointer items-center justify-between gap-4 rounded-xl px-3 py-2 text-sm text-[color:var(--c-ink)]", i === active && "bg-[color:color-mix(in_srgb,var(--c-accent)_14%,transparent)]", selected && "font-semibold")}
              >
                <span className="truncate">{o.label}</span>
                {selected ? <Check className="h-4 w-4 shrink-0 text-[color:var(--c-accent)]" aria-hidden /> : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
