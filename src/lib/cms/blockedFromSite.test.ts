import { describe, expect, it } from "vitest";

import type { simpleBlogCard } from "@/lib/interface";
import {
  filterPublicBlogs,
  filterPublicVideos,
  isBlogHiddenFromSite,
  isVideoHiddenFromSite,
} from "./blockedFromSite";

function blog(title: string, currentSlug: string): simpleBlogCard {
  return {
    title,
    summary: "",
    currentSlug,
    titleImageUrl: null,
  };
}

describe("isBlogHiddenFromSite", () => {
  it("hides drums of tomorrow by title or slug", () => {
    expect(isBlogHiddenFromSite(blog("Drums of Tomorrow", "ok"))).toBe(true);
    expect(isBlogHiddenFromSite(blog("Field notes", "drums-of-tomorrow"))).toBe(true);
  });

  it("hides Cynthia Bailey content", () => {
    expect(isBlogHiddenFromSite(blog("Cynthia Bailey in Marrakech", "marrakech"))).toBe(true);
    expect(isBlogHiddenFromSite(blog("Culturin Convos with Cynthia", "convos"))).toBe(true);
  });

  it("keeps unrelated posts", () => {
    expect(isBlogHiddenFromSite(blog("Alexis Doyle", "alexis-doyle"))).toBe(false);
  });
});

describe("isVideoHiddenFromSite", () => {
  it("hides drums of tomorrow videos", () => {
    expect(isVideoHiddenFromSite({ title: "Drums of Tomorrow", currentSlug: "x" })).toBe(true);
  });

  it("hides Cynthia Bailey convos videos only when both match", () => {
    expect(
      isVideoHiddenFromSite({ title: "Culturin Convos Cynthia Bailey", currentSlug: "cynthia" }),
    ).toBe(true);
    expect(isVideoHiddenFromSite({ title: "Cynthia Bailey portrait", currentSlug: "cynthia" })).toBe(
      false,
    );
  });
});

describe("filters", () => {
  it("drops hidden blogs and videos", () => {
    const blogs = [
      blog("Keep me", "keep-me"),
      blog("Drums of Tomorrow", "drums"),
    ];
    expect(filterPublicBlogs(blogs).map((b) => b.currentSlug)).toEqual(["keep-me"]);

    const videos = [
      { title: "Keep", currentSlug: "keep" },
      { title: "Drums of Tomorrow live", currentSlug: "drums" },
    ];
    expect(filterPublicVideos(videos).map((v) => v.currentSlug)).toEqual(["keep"]);
  });
});
