import { describe, expect, it } from "vitest";

import { getCreateMenuLinks } from "./createMenuLinks";

describe("getCreateMenuLinks", () => {
  it("routes admins to Studio and non-admins to Creator", () => {
    const admin = getCreateMenuLinks(true);
    const creator = getCreateMenuLinks(false);

    expect(admin.find((l) => l.title === "Article")?.href).toBe("/studio/articles");
    expect(creator.find((l) => l.title === "Article")?.href).toBe("/creator/articles");
    expect(admin.some((l) => l.href === "/studio" && l.title === "Studio overview")).toBe(true);
    expect(creator.some((l) => l.href === "/creator" && l.title === "Creator home")).toBe(true);
  });

  it("keeps shared destinations for both roles", () => {
    for (const isAdmin of [true, false]) {
      const hrefs = getCreateMenuLinks(isAdmin).map((l) => l.href);
      expect(hrefs).toContain("/profile#spot-lists");
      expect(hrefs).toContain("/join-us/advisors");
      expect(hrefs).toContain("/create/upload");
    }
  });
});
