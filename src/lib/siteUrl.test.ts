import { afterEach, describe, expect, it } from "vitest";

import { getPublicSiteUrl } from "./siteUrl";

describe("getPublicSiteUrl", () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  it("trims and strips a trailing slash from env", () => {
    process.env.NEXT_PUBLIC_SITE_URL = " https://culturin.com/ ";
    expect(getPublicSiteUrl()).toBe("https://culturin.com");
  });

  it("returns empty string on the server when unset", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    expect(getPublicSiteUrl()).toBe("");
  });
});
