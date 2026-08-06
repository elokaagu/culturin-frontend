import { describe, expect, it } from "vitest";

import { textMatchesAllTokens, tokenizeSearchQuery } from "./searchTokenize";

describe("tokenizeSearchQuery", () => {
  it("lowercases, strips punctuation, and drops short tokens", () => {
    expect(tokenizeSearchQuery("  Lisbon Food! a  ")).toEqual(["lisbon", "food"]);
  });
});

describe("textMatchesAllTokens", () => {
  it("requires every token as a substring", () => {
    expect(textMatchesAllTokens("Lisbon seafood guide", ["lisbon", "food"])).toBe(true);
    expect(textMatchesAllTokens("Lisbon nightlife", ["lisbon", "food"])).toBe(false);
    expect(textMatchesAllTokens("anything", [])).toBe(true);
  });
});
