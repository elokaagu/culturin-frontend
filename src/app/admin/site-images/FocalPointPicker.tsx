"use client";

import { useState } from "react";

export type Focal = { x: number; y: number } | null;

/** The crops the site actually uses, so you can see every one before saving. */
const PREVIEWS = [
  { label: "Wide (hero)", ratio: "16 / 9", width: 168 },
  { label: "Card", ratio: "4 / 5", width: 76 },
  { label: "Square", ratio: "1 / 1", width: 92 },
  { label: "Phone hero", ratio: "9 / 16", width: 56 },
];

/**
 * Click (or drag) on the photo to set its focal point: the spot every crop on the site keeps in
 * frame. "Smart position" suggests one automatically; "Centre" goes back to the default.
 */
export function FocalPointPicker({ src, value, onChange }: { src: string; value: Focal; onChange: (v: Focal) => void }) {
  const [smart, setSmart] = useState<"idle" | "working" | "error">("idle");
  const [dragging, setDragging] = useState(false);
  const point = value ?? { x: 50, y: 50 };
  const position = `${point.x}% ${point.y}%`;

  const setFrom = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n * 10) / 10));
    onChange({ x: clamp(((e.clientX - r.left) / r.width) * 100), y: clamp(((e.clientY - r.top) / r.height) * 100) });
  };

  const runSmart = async () => {
    setSmart("working");
    const res = await fetch("/api/admin/site-images/focal", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ src }) });
    if (!res.ok) return setSmart("error");
    const p = (await res.json()) as { x: number; y: number };
    onChange(p);
    setSmart("idle");
  };

  return (
    <div className="space-y-3">
      <div
        role="slider"
        aria-label="Focal point"
        aria-valuetext={`${Math.round(point.x)}% across, ${Math.round(point.y)}% down`}
        aria-valuenow={Math.round(point.x)}
        tabIndex={0}
        onKeyDown={(e) => {
          const step = e.shiftKey ? 10 : 2;
          const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
          if (!d) return;
          e.preventDefault();
          onChange({ x: Math.max(0, Math.min(100, point.x + d[0])), y: Math.max(0, Math.min(100, point.y + d[1])) });
        }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setDragging(true);
          setFrom(e);
        }}
        onPointerMove={(e) => dragging && setFrom(e)}
        onPointerUp={() => setDragging(false)}
        className="relative cursor-crosshair touch-none select-none overflow-hidden rounded-xl border border-neutral-200 outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--c-accent)] dark:border-white/10"
      >
        {/* The whole photo, uncropped, so the point means the same thing everywhere. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" draggable={false} className="block h-auto w-full" />
        <span
          aria-hidden
          className="pointer-events-none absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_2px_rgba(0,0,0,0.45)]"
          style={{ left: `${point.x}%`, top: `${point.y}%` }}
        >
          <span className="absolute top-1/2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={runSmart}
          disabled={smart === "working" || !src}
          className="inline-flex h-8 items-center rounded-full border border-[color:var(--c-accent)] px-3.5 text-xs font-semibold text-[color:var(--c-ink)] transition hover:bg-[color:color-mix(in_srgb,var(--c-accent)_15%,transparent)] disabled:opacity-50"
        >
          {smart === "working" ? "Finding the subject…" : "✦ Smart position"}
        </button>
        <button
          type="button"
          onClick={() => onChange(null)}
          className="inline-flex h-8 items-center rounded-full border border-neutral-300 px-3.5 text-xs text-[color:var(--c-ink)] hover:border-neutral-500 dark:border-white/15"
        >
          Centre
        </button>
        <span className="text-xs text-[color:var(--c-muted)]">
          {value ? `${Math.round(point.x)}% across · ${Math.round(point.y)}% down` : "Centred"}
          {smart === "error" ? " · Couldn't analyse this photo; click to set it." : ""}
        </span>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        {PREVIEWS.map((p) => (
          <figure key={p.label} className="m-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="block rounded-md object-cover" style={{ width: p.width, aspectRatio: p.ratio, objectPosition: position }} />
            <figcaption className="mt-1 text-[10px] text-[color:var(--c-muted)]">{p.label}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
