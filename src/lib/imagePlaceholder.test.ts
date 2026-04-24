import { describe, expect, it } from "vitest";

import { resolveContentImageSrc } from "./imagePlaceholder";

describe("resolveContentImageSrc", () => {
  it("returns a local placeholder for empty input", () => {
    expect(resolveContentImageSrc(null)).toMatch(/\/placeholders\//);
  });

  it("keeps valid https URLs", () => {
    const u = "https://images.unsplash.com/photo-1?w=100";
    expect(resolveContentImageSrc(u)).toBe(u);
  });
});
