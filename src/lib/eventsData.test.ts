import { describe, expect, it } from "vitest";

import { galleryHrefForEvent, getEventBySlug } from "./eventsData";

describe("getEventBySlug", () => {
  it("resolves known events and rejects unknown slugs", () => {
    expect(getEventBySlug("cannes-lions-2026")?.name).toMatch(/Cannes/i);
    expect(getEventBySlug("missing-event")).toBeUndefined();
  });
});

describe("galleryHrefForEvent", () => {
  it("links to a filtered gallery when an event key exists", () => {
    expect(galleryHrefForEvent({ galleryEventKey: "cannes-2026" })).toBe(
      "/gallery?event=cannes-2026",
    );
    expect(galleryHrefForEvent({})).toBe("/gallery");
  });
});
