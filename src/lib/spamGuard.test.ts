import { describe, expect, it } from "vitest";

import { HONEYPOT_FIELD, STARTED_AT_FIELD, detectSpam, looksLikeGibberish } from "./spamGuard";

const human = { [STARTED_AT_FIELD]: Date.now() - 20_000 };

describe("looksLikeGibberish", () => {
  it("flags the bot names we've seen", () => {
    for (const w of ["krhRuFDzKGFvnAer", "ZwVuUOMYuJFNwaeIYcg", "Dvfxbrqre", "Urzgqpvr", "Kywtcsxhtz", "ryHveySZBskOlZWmO"]) {
      expect(looksLikeGibberish(w), w).toBe(true);
    }
  });

  it("leaves real names alone", () => {
    for (const w of ["Schmidt", "Oluwaseun", "McDonald", "DeShawn", "Nguyen", "Strnad", "Osikmashvili", "Albuquerque", "OMNICOM", "Chukwuemeka", "Krzysztof", "Armstrong", "Deutschmann", "Lautenschlaeger", "McCrary", "McClain"]) {
      expect(looksLikeGibberish(w), w).toBe(false);
    }
  });
});

describe("detectSpam", () => {
  it("passes a normal person", () => {
    expect(detectSpam(human, { email: "jane.doe@nike.com", names: ["Jane", "Doe", "Nike"] })).toBeNull();
  });

  it("catches the honeypot, missing timing and instant submits", () => {
    expect(detectSpam({ ...human, [HONEYPOT_FIELD]: "http://x" }, {})).toBe("honeypot");
    expect(detectSpam({}, {})).toBe("no-timing");
    expect(detectSpam({ [STARTED_AT_FIELD]: Date.now() - 500 }, {})).toBe("too-fast");
  });

  it("catches dotted gmail and gibberish names", () => {
    expect(detectSpam(human, { email: "o.he.mer.u.b86@gmail.com" })).toBe("dotted-gmail");
    expect(detectSpam(human, { email: "x@y.com", names: ["Wvpyk", "Dvfxbrqre"] })).toBe("gibberish");
  });
});
