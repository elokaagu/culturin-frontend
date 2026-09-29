import { describe, expect, it } from "vitest";

import { classifyClicks, type ClickForClassify } from "./clickClassifier";

const WIN = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36";
const LINUX = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36";
const T0 = Date.parse("2026-09-29T10:00:00Z");
const click = (email: string, secs: number, link: string, ua = WIN): ClickForClassify => ({ email, link, userAgent: ua, at: T0 + secs * 1000 });

describe("classifyClicks", () => {
  it("flags a scanner hitting every link in the same second (the Omnicom / JP Morgan pattern)", () => {
    const clicks = [click("a@omc.com", 24, "/"), click("a@omc.com", 24, "/"), click("a@omc.com", 24, "/partner")];
    expect(classifyClicks(clicks, new Map([["a@omc.com", T0]]))).toEqual([true, true, true]);
  });

  it("flags clicks from a Linux sandbox spread over minutes (the Fox / Medialink pattern)", () => {
    const clicks = [click("b@fox.com", 32, "/", LINUX), click("b@fox.com", 168, "/partner", LINUX)];
    expect(classifyClicks(clicks, new Map([["b@fox.com", T0]]))).toEqual([true, true]);
  });

  it("flags a single click seconds after delivery", () => {
    expect(classifyClicks([click("c@amoveo.tv", 12, "/partner")], new Map([["c@amoveo.tv", T0]]))).toEqual([true]);
  });

  it("catches a scanner that switches browser identity mid-scan (the Fox pattern)", () => {
    const clicks = [
      click("g@fox.com", 32, "/", LINUX),
      click("g@fox.com", 109, "/unsubscribe", LINUX),
      click("g@fox.com", 168, "/partner"),
      click("g@fox.com", 176, "/"),
      click("g@fox.com", 182, "/unsubscribe"),
      click("g@fox.com", 1698, "/unsubscribe", "Amazon CloudFront"),
      click("g@fox.com", 1699, "/unsubscribe", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/151.0 Safari/537.36"),
    ];
    expect(classifyClicks(clicks, new Map([["g@fox.com", T0]])).every(Boolean)).toBe(true);
  });

  it("keeps a real reader: one click hours later", () => {
    expect(classifyClicks([click("d@gmail.com", 26185, "/partner")], new Map([["d@gmail.com", T0]]))).toEqual([false]);
  });

  it("keeps a person who clicks two links a minute apart", () => {
    const clicks = [click("e@x.com", 600, "/partner"), click("e@x.com", 660, "/")];
    expect(classifyClicks(clicks, new Map([["e@x.com", T0]]))).toEqual([false, false]);
  });

  it("keeps a double-click on the same link", () => {
    const clicks = [click("f@x.com", 900, "/partner"), click("f@x.com", 900.4, "/partner")];
    expect(classifyClicks(clicks, new Map([["f@x.com", T0]]))).toEqual([false, false]);
  });
});
