import { describe, expect, it } from "vitest";

import { describeUserAgent } from "./userAgent";

describe("describeUserAgent", () => {
  it("names mail provider proxies instead of guessing a device", () => {
    expect(describeUserAgent("Mozilla/5.0 (Windows NT 5.1; rv:11.0) Gecko Firefox/11.0 (via ggpht.com GoogleImageProxy)")).toBe("Gmail (image proxy)");
    expect(describeUserAgent("Mozilla/5.0")).toBe("Apple Mail (privacy protection)");
  });

  it("reads real browsers from clicks", () => {
    expect(
      describeUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"),
    ).toBe("iPhone · Safari");
    expect(
      describeUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"),
    ).toBe("Mac · Chrome");
    expect(describeUserAgent("Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/129.0 Mobile Safari/537.36")).toBe("Android · Chrome");
    expect(describeUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148")).toBe(
      "iPhone · Apple Mail",
    );
  });

  it("handles missing values", () => {
    expect(describeUserAgent(null)).toBe("Unknown");
    expect(describeUserAgent("curl/8.0")).toBe("Other");
  });
});
