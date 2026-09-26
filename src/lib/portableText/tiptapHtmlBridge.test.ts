import { describe, expect, it } from "vitest";

import { portableTextBlocksToHtml } from "./tiptapHtmlBridge";

const paragraph = (text: string) => ({
  _type: "block",
  _key: `k_${text}`,
  style: "normal",
  markDefs: [],
  children: [{ _type: "span", _key: `s_${text}`, text, marks: [] }],
});

describe("portableTextBlocksToHtml", () => {
  it("keeps image blocks in order between paragraphs", () => {
    const html = portableTextBlocksToHtml([
      paragraph("Before"),
      { _type: "image", _key: "i1", url: "https://example.com/a.jpg", alt: 'A "quoted" photo' },
      paragraph("After"),
    ]);
    expect(html).toBe(
      '<p>Before</p><img src="https://example.com/a.jpg" alt="A &quot;quoted&quot; photo"><p>After</p>',
    );
  });

  it("ignores image blocks without a url", () => {
    expect(portableTextBlocksToHtml([{ _type: "image", _key: "i1", url: "" }, paragraph("Only")])).toBe("<p>Only</p>");
  });
});
