import { describe, expect, it } from "vitest";

import {
  deckSharePath,
  deckShareUrl,
  formatBytes,
  formatDuration,
  isValidSlug,
  partnerShareUrl,
  slugify,
} from "./deckLinks";

describe("slugify", () => {
  it("normalizes and truncates", () => {
    expect(slugify("  Peace Party Trial! ")).toBe("peace-party-trial");
    expect(slugify("A".repeat(80)).length).toBe(64);
  });
});

describe("isValidSlug", () => {
  it("accepts kebab slugs within length bounds", () => {
    expect(isValidSlug("peace-party")).toBe(true);
    expect(isValidSlug("a")).toBe(false);
    expect(isValidSlug("-bad")).toBe(false);
    expect(isValidSlug("Bad_Case")).toBe(false);
  });
});

describe("share paths", () => {
  it("prefers custom slug over token", () => {
    expect(deckSharePath({ share_token: "tok", custom_slug: "peace" })).toBe("/d/peace");
    expect(deckSharePath({ share_token: "tok", custom_slug: null })).toBe("/d/tok");
  });

  it("returns path-only URLs on the server", () => {
    expect(deckShareUrl({ share_token: "tok" })).toBe("/d/tok");
    expect(partnerShareUrl("acme")).toBe("/d/acme");
  });
});

describe("format helpers", () => {
  it("formats duration and bytes", () => {
    expect(formatDuration(0)).toBe("0s");
    expect(formatDuration(45)).toBe("45s");
    expect(formatDuration(125)).toBe("2m 5s");
    expect(formatBytes(null)).toBe("—");
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(2048)).toBe("2.0 KB");
    expect(formatBytes(2 * 1024 * 1024)).toBe("2.0 MB");
  });
});
