import { afterEach, describe, expect, it } from "vitest";

import { eventMediaUrl, resolveEventMediaSrc, toLegacyEventPath } from "./eventMedia";

describe("eventMediaUrl", () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_URL;
  });

  it("builds a public media URL when Supabase URL is set", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    expect(eventMediaUrl("cannes-lions-2026/a.jpg")).toBe(
      "https://example.supabase.co/storage/v1/object/public/media/events/cannes-lions-2026/a.jpg",
    );
    expect(eventMediaUrl("/events/cannes-lions-2026/a.jpg")).toBe(
      "https://example.supabase.co/storage/v1/object/public/media/events/cannes-lions-2026/a.jpg",
    );
  });

  it("falls back to a local /events path when unset", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_URL;
    expect(eventMediaUrl("cannes-lions-2026/a.jpg")).toBe("/events/cannes-lions-2026/a.jpg");
  });
});

describe("resolveEventMediaSrc", () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  });

  it("rewrites legacy paths and leaves https alone", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    expect(resolveEventMediaSrc("https://cdn.example/x.jpg")).toBe("https://cdn.example/x.jpg");
    expect(resolveEventMediaSrc("/events/cannes-lions-2026/a.jpg")).toContain(
      "/storage/v1/object/public/media/events/cannes-lions-2026/a.jpg",
    );
  });
});

describe("toLegacyEventPath", () => {
  it("maps storage URLs back to /events paths", () => {
    expect(
      toLegacyEventPath(
        "https://example.supabase.co/storage/v1/object/public/media/events/cannes-lions-2026/a.jpg",
      ),
    ).toBe("/events/cannes-lions-2026/a.jpg");
  });
});
