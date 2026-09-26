import { describe, expect, it } from "vitest";

import { enrichSubscriber } from "./subscriberEnrich";

const base = { firstName: "", lastName: "", company: "" };

describe("enrichSubscriber", () => {
  it("splits first.last emails and never guesses a company", () => {
    expect(enrichSubscriber({ ...base, email: "fred.clark@target.com" })).toEqual({
      firstName: "Fred",
      lastName: "Clark",
      company: "",
      inferred: ["first_name", "last_name"],
    });
  });

  it("ignores handles that aren't names", () => {
    expect(enrichSubscriber({ ...base, email: "welcometothehills.nyc@gmail.com" })).toMatchObject({ firstName: "", lastName: "" });
  });

  it("skips honorifics", () => {
    expect(enrichSubscriber({ ...base, email: "ms.bpowers@gmail.com" })).toMatchObject({ firstName: "", lastName: "" });
  });

  it("skips middle initials", () => {
    const r = enrichSubscriber({ ...base, email: "paul.l.jobson@gmail.com" });
    expect([r.firstName, r.lastName, r.company]).toEqual(["Paul", "Jobson", ""]);
  });

  it("never guesses names from shared mailboxes", () => {
    const r = enrichSubscriber({ ...base, email: "info@magicjent.com" });
    expect([r.firstName, r.lastName]).toEqual(["", ""]);
    expect(enrichSubscriber({ ...base, email: "squintfoto@gmail.com" })).toMatchObject({ firstName: "", lastName: "", company: "" });
  });

  it("finds a last name when the email is firstnamelastname@", () => {
    expect(enrichSubscriber({ ...base, firstName: "Leila", email: "leilaessaoui@gmail.com" }).lastName).toBe("Essaoui");
  });

  it("uses a full-name column", () => {
    const r = enrichSubscriber({ ...base, email: "x1@gmail.com", fullName: "Tobi Demuren" });
    expect([r.firstName, r.lastName]).toEqual(["Tobi", "Demuren"]);
  });

  it("fixes all-caps and all-lowercase names but keeps deliberate casing", () => {
    expect(enrichSubscriber({ ...base, firstName: "DEXTER", lastName: "CUMMINGS", company: "X", email: "d@x.com" })).toMatchObject({ firstName: "Dexter", lastName: "Cummings" });
    expect(enrichSubscriber({ ...base, firstName: "jamie", lastName: "patricof", company: "X", email: "j@x.com" })).toMatchObject({ firstName: "Jamie", lastName: "Patricof" });
    expect(enrichSubscriber({ ...base, firstName: "DeShawn", lastName: "McKay", company: "X", email: "d@x.com" })).toMatchObject({ firstName: "DeShawn", lastName: "McKay" });
  });
});
