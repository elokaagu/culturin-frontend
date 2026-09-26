"use client";

import { Plus, X } from "lucide-react";
import { Link } from "next-view-transitions";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";

import { Notice } from "@/app/admin/_components/AdminListParts";
import { StudioImageUploadButton } from "@/app/admin/_components/StudioImageUploadButton";
import { studioCancelButtonClass, studioCreateButtonClass } from "@/app/admin/_components/StudioCulturinListKit";
import { studioCheckboxClass, studioFieldInputClass, studioMutedClass, studioPanelClass } from "@/app/admin/_lib/studioTheme";
import type { CulturinEvent } from "@/lib/eventsData";
import { cn } from "@/lib/utils";

type FormSection = { id: string; label: string; headline: string; body: string; photos: { src: string; alt: string; position: string }[] };

type FormState = {
  name: string;
  slug: string;
  startsOn: string;
  navLabel: string;
  tagline: string;
  subtagline: string;
  shortDescription: string;
  date: string;
  location: string;
  category: string;
  heroImage: string;
  heroImageAlt: string;
  isPast: boolean;
  galleryEventKey: string;
  signalHeadline: string;
  signalBody: string;
  rsvpHeadline: string;
  rsvpSubtext: string;
  stats: { value: string; label: string }[];
  sections: FormSection[];
};

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function initialState(event: CulturinEvent | null, startsOn: string | null): FormState {
  return {
    name: event?.name ?? "",
    slug: event?.slug ?? "",
    startsOn: startsOn ?? "",
    navLabel: event?.navLabel ?? "",
    tagline: event?.tagline ?? "",
    subtagline: event?.subtagline ?? "",
    shortDescription: event?.shortDescription ?? "",
    date: event?.date ?? "",
    location: event?.location ?? "",
    category: event?.category ?? "",
    heroImage: event?.heroImage ?? "",
    heroImageAlt: event?.heroImageAlt ?? "",
    isPast: event?.isPast === true,
    galleryEventKey: event?.galleryEventKey ?? "",
    signalHeadline: event?.signalHeadline ?? "",
    signalBody: event?.signalBody ?? "",
    rsvpHeadline: event?.rsvpHeadline ?? "",
    rsvpSubtext: event?.rsvpSubtext ?? "",
    stats: event?.stats.map((s) => ({ ...s })) ?? [],
    sections: event?.sections.map((s) => ({ ...s, photos: s.photos.map((p) => ({ ...p })) })) ?? [],
  };
}

const inputClass = cn(studioFieldInputClass, "w-full");

function Label({ text, hint, children }: { text: string; hint?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className={cn("font-medium", studioMutedClass)}>{text}</span>
      {children}
      {hint ? <span className={cn("text-xs", studioMutedClass)}>{hint}</span> : null}
    </label>
  );
}

function Group({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <fieldset className={cn(studioPanelClass, "m-0 flex flex-col gap-5")}>
      <legend className="sr-only">{title}</legend>
      <div>
        <h2 className="m-0 font-display text-lg font-semibold tracking-tight text-[color:var(--c-ink)]">{title}</h2>
        {description ? <p className={cn("m-0 mt-1 text-sm", studioMutedClass)}>{description}</p> : null}
      </div>
      {children}
    </fieldset>
  );
}

const smallButton =
  "inline-flex h-8 items-center gap-1.5 rounded-full border border-[color:var(--c-rule)] px-3 text-xs font-medium text-[color:var(--c-ink)] transition hover:border-[color:var(--c-accent)]";

export function StudioEventForm({
  mode,
  event,
  startsOn,
}: {
  mode: "create" | "edit";
  event: CulturinEvent | null;
  startsOn: string | null;
}) {
  const router = useRouter();
  const [f, setF] = useState<FormState>(() => initialState(event, startsOn));
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setF((prev) => ({ ...prev, [key]: value }));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!f.name.trim()) {
      setError("Give the event a name.");
      return;
    }
    setPending(true);
    try {
      const { startsOn: start, ...eventFields } = f;
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: eventFields,
          startsOn: start,
          originalSlug: mode === "edit" ? event?.slug : undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) {
        setError(data.message ?? "Could not save the event.");
        return;
      }
      router.push("/admin/events");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex max-w-4xl flex-col gap-6">
      <Group title="The basics" description="What people see on the events list and at the top of the event page.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Label text="Event name">
            <input
              className={inputClass}
              value={f.name}
              onChange={(e) => {
                set("name", e.target.value);
                if (!slugTouched) set("slug", slugify(e.target.value));
              }}
              placeholder="Culturin at Art Basel"
              required
            />
          </Label>
          <Label text="Web address" hint={mode === "edit" ? "Can't be changed once the event exists." : `culturin.com/events/${f.slug || "your-event"}`}>
            <input
              className={inputClass}
              value={f.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", slugify(e.target.value));
              }}
              disabled={mode === "edit"}
              placeholder="art-basel-2026"
            />
          </Label>
          <Label text="Display date" hint='Shown as written, e.g. "December 4 to 7, 2026".'>
            <input className={inputClass} value={f.date} onChange={(e) => set("date", e.target.value)} />
          </Label>
          <Label text="Start date" hint="Used to order events, earliest first.">
            <input type="date" className={inputClass} value={f.startsOn} onChange={(e) => set("startsOn", e.target.value)} />
          </Label>
          <Label text="Location">
            <input className={inputClass} value={f.location} onChange={(e) => set("location", e.target.value)} placeholder="Miami, Florida" />
          </Label>
          <Label text="Category tag" hint="The small label on the card, e.g. Sport & Culture.">
            <input className={inputClass} value={f.category} onChange={(e) => set("category", e.target.value)} />
          </Label>
        </div>
        <Label text="Short description" hint="One or two lines shown on the events list.">
          <textarea className={inputClass} rows={2} value={f.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} />
        </Label>
        <label className="flex cursor-pointer items-center gap-3 text-sm text-[color:var(--c-ink)]">
          <input type="checkbox" className={studioCheckboxClass} checked={f.isPast} onChange={(e) => set("isPast", e.target.checked)} />
          This event has already happened
          <span className={cn("text-xs", studioMutedClass)}>(swaps the RSVP form for a recap)</span>
        </label>
      </Group>

      <Group title="Hero" description="The big opening image and headline.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Label text="Headline" hint="Use a new line to break the headline.">
            <textarea className={inputClass} rows={2} value={f.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder={"La Croisette.\nOurs."} />
          </Label>
          <Label text="Subheadline">
            <textarea className={inputClass} rows={2} value={f.subtagline} onChange={(e) => set("subtagline", e.target.value)} placeholder="Culturin × Art Basel · December 2026" />
          </Label>
          <Label text="Navigation label" hint="Short uppercase label. Defaults to the event name.">
            <input className={inputClass} value={f.navLabel} onChange={(e) => set("navLabel", e.target.value)} />
          </Label>
          <Label text="Gallery key" hint="Links the recap to /gallery?event=… when photos are tagged with this key.">
            <input className={inputClass} value={f.galleryEventKey} onChange={(e) => set("galleryEventKey", e.target.value)} />
          </Label>
        </div>
        <div className="flex flex-col gap-3">
          <Label text="Hero image">
            <input className={inputClass} value={f.heroImage} onChange={(e) => set("heroImage", e.target.value)} placeholder="Paste a URL, or upload below" />
          </Label>
          <StudioImageUploadButton buttonLabel="Upload hero image" onUploaded={(url) => set("heroImage", url)} />
          <Label text="Hero image description (alt text)">
            <input className={inputClass} value={f.heroImageAlt} onChange={(e) => set("heroImageAlt", e.target.value)} />
          </Label>
        </div>
      </Group>

      <Group title="Story sections" description="The scrolling narrative on the event page. Each section has copy and up to six photos.">
        {f.sections.map((section, si) => (
          <div key={si} className="flex flex-col gap-4 rounded-xl border border-[color:var(--c-rule)] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="m-0 text-sm font-semibold text-[color:var(--c-ink)]">Section {si + 1}</p>
              <button
                type="button"
                className={smallButton}
                onClick={() => set("sections", f.sections.filter((_, i) => i !== si))}
                aria-label={`Remove section ${si + 1}`}
              >
                <X className="h-3.5 w-3.5" aria-hidden /> Remove
              </button>
            </div>
            <Label text="Small label" hint="e.g. PERSPECTIVE">
              <input
                className={inputClass}
                value={section.label}
                onChange={(e) => set("sections", f.sections.map((s, i) => (i === si ? { ...s, label: e.target.value } : s)))}
              />
            </Label>
            <Label text="Headline">
              <textarea
                className={inputClass}
                rows={2}
                value={section.headline}
                onChange={(e) => set("sections", f.sections.map((s, i) => (i === si ? { ...s, headline: e.target.value } : s)))}
              />
            </Label>
            <Label text="Body">
              <textarea
                className={inputClass}
                rows={4}
                value={section.body}
                onChange={(e) => set("sections", f.sections.map((s, i) => (i === si ? { ...s, body: e.target.value } : s)))}
              />
            </Label>
            <div className="flex flex-col gap-3">
              <p className={cn("m-0 text-sm font-medium", studioMutedClass)}>Photos</p>
              {section.photos.map((photo, pi) => (
                <div key={pi} className="flex flex-col gap-2 rounded-lg border border-[color:var(--c-rule)] p-3">
                  <input
                    className={inputClass}
                    placeholder="Image URL"
                    value={photo.src}
                    onChange={(e) =>
                      set(
                        "sections",
                        f.sections.map((s, i) =>
                          i === si ? { ...s, photos: s.photos.map((p, j) => (j === pi ? { ...p, src: e.target.value } : p)) } : s,
                        ),
                      )
                    }
                  />
                  <input
                    className={inputClass}
                    placeholder="Describe the photo (alt text)"
                    value={photo.alt}
                    onChange={(e) =>
                      set(
                        "sections",
                        f.sections.map((s, i) =>
                          i === si ? { ...s, photos: s.photos.map((p, j) => (j === pi ? { ...p, alt: e.target.value } : p)) } : s,
                        ),
                      )
                    }
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <StudioImageUploadButton
                      buttonLabel="Upload"
                      onUploaded={(url) =>
                        set(
                          "sections",
                          f.sections.map((s, i) =>
                            i === si ? { ...s, photos: s.photos.map((p, j) => (j === pi ? { ...p, src: url } : p)) } : s,
                          ),
                        )
                      }
                    />
                    <button
                      type="button"
                      className={smallButton}
                      onClick={() =>
                        set("sections", f.sections.map((s, i) => (i === si ? { ...s, photos: s.photos.filter((_, j) => j !== pi) } : s)))
                      }
                    >
                      Remove photo
                    </button>
                  </div>
                </div>
              ))}
              {section.photos.length < 6 ? (
                <button
                  type="button"
                  className={cn(smallButton, "w-fit")}
                  onClick={() =>
                    set("sections", f.sections.map((s, i) => (i === si ? { ...s, photos: [...s.photos, { src: "", alt: "", position: "" }] } : s)))
                  }
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden /> Add photo
                </button>
              ) : null}
            </div>
          </div>
        ))}
        {f.sections.length < 8 ? (
          <button
            type="button"
            className={cn(smallButton, "w-fit")}
            onClick={() => set("sections", [...f.sections, { id: "", label: "", headline: "", body: "", photos: [] }])}
          >
            <Plus className="h-3.5 w-3.5" aria-hidden /> Add a section
          </button>
        ) : null}
      </Group>

      <Group title="Numbers and recap" description="The stats strip and the closing story.">
        {f.stats.map((stat, i) => (
          <div key={i} className="grid grid-cols-[6rem_1fr_auto] items-end gap-3">
            <Label text={i === 0 ? "Value" : ""}>
              <input
                className={inputClass}
                value={stat.value}
                placeholder="500+"
                onChange={(e) => set("stats", f.stats.map((s, j) => (j === i ? { ...s, value: e.target.value } : s)))}
              />
            </Label>
            <Label text={i === 0 ? "Label" : ""}>
              <input
                className={inputClass}
                value={stat.label}
                placeholder="Guests in the room"
                onChange={(e) => set("stats", f.stats.map((s, j) => (j === i ? { ...s, label: e.target.value } : s)))}
              />
            </Label>
            <button type="button" className={smallButton} onClick={() => set("stats", f.stats.filter((_, j) => j !== i))} aria-label={`Remove stat ${i + 1}`}>
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
        ))}
        {f.stats.length < 8 ? (
          <button type="button" className={cn(smallButton, "w-fit")} onClick={() => set("stats", [...f.stats, { value: "", label: "" }])}>
            <Plus className="h-3.5 w-3.5" aria-hidden /> Add a stat
          </button>
        ) : null}
        <div className="grid gap-5 sm:grid-cols-2">
          <Label text="Recap headline">
            <input className={inputClass} value={f.signalHeadline} onChange={(e) => set("signalHeadline", e.target.value)} placeholder="What happened" />
          </Label>
          <div className="sm:col-span-2">
            <Label text="Recap text">
              <textarea className={inputClass} rows={4} value={f.signalBody} onChange={(e) => set("signalBody", e.target.value)} />
            </Label>
          </div>
        </div>
      </Group>

      <Group title="RSVP box" description="The message above the RSVP form (or the wrap-up message once the event is over).">
        <Label text="Heading">
          <input className={inputClass} value={f.rsvpHeadline} onChange={(e) => set("rsvpHeadline", e.target.value)} />
        </Label>
        <Label text="Supporting text">
          <textarea className={inputClass} rows={3} value={f.rsvpSubtext} onChange={(e) => set("rsvpSubtext", e.target.value)} />
        </Label>
      </Group>

      {error ? <Notice tone="error">{error}</Notice> : null}

      <div className="flex flex-wrap items-center gap-3 pb-10">
        <button type="submit" disabled={pending} className={cn(studioCreateButtonClass, "disabled:opacity-60")}>
          {pending ? "Saving…" : mode === "create" ? "Create event" : "Save changes"}
        </button>
        <Link href="/admin/events" className={cn(studioCancelButtonClass, "h-11 px-5 text-sm")}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
