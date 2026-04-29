/**
 * Converts between TipTap HTML output and Sanity-style Portable Text blocks
 * used by {@link ArticleClient} (`cms_blogs.body` jsonb).
 */

function randomKey(): string {
  return `k_${Math.random().toString(36).slice(2, 11)}`;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

type PtMarkDef = { _key: string; _type: string; href?: string };
type PtSpan = { _type: "span"; _key: string; text: string; marks: string[] };
type PtBlock = {
  _type: "block";
  _key: string;
  style: string;
  markDefs: PtMarkDef[];
  children: PtSpan[];
  listItem?: string;
  level?: number;
};

function isPtBlock(v: unknown): v is PtBlock {
  return Boolean(v && typeof v === "object" && (v as PtBlock)._type === "block");
}

/** Serialize PT blocks (with optional list grouping) to HTML for TipTap. */
export function portableTextBlocksToHtml(body: unknown): string {
  if (!Array.isArray(body) || body.length === 0) return "<p></p>";

  const blocks = body.filter(isPtBlock);
  if (blocks.length === 0) return "<p></p>";

  const htmlParts: string[] = [];
  let i = 0;
  while (i < blocks.length) {
    const b = blocks[i]!;
    const listItem = (b as PtBlock & { listItem?: string }).listItem;
    if (listItem === "bullet" || listItem === "number") {
      const tag = listItem === "bullet" ? "ul" : "ol";
      const items: string[] = [];
      while (i < blocks.length) {
        const cur = blocks[i] as PtBlock & { listItem?: string };
        if (cur.listItem !== listItem) break;
        items.push(`<li>${inlineFromBlock(cur)}</li>`);
        i++;
      }
      htmlParts.push(`<${tag}>${items.join("")}</${tag}>`);
      continue;
    }
    htmlParts.push(blockToHtml(b));
    i++;
  }
  return htmlParts.join("") || "<p></p>";
}

function inlineFromBlock(block: PtBlock): string {
  return block.children.map((c) => spanToHtml(c, block.markDefs)).join("");
}

function spanToHtml(span: PtSpan, markDefs: PtMarkDef[]): string {
  let html = escapeHtml(span.text);
  const styleMarks = span.marks.filter((m) =>
    ["strong", "em", "code", "underline", "strike-through"].includes(m),
  );
  const linkKeys = span.marks.filter(
    (m) => !["strong", "em", "code", "underline", "strike-through"].includes(m),
  );
  for (const m of styleMarks) {
    if (m === "strong") html = `<strong>${html}</strong>`;
    else if (m === "em") html = `<em>${html}</em>`;
    else if (m === "code") html = `<code>${html}</code>`;
    else if (m === "underline") html = `<u>${html}</u>`;
    else if (m === "strike-through") html = `<s>${html}</s>`;
  }
  for (const key of linkKeys) {
    const def = markDefs.find((d) => d._key === key && d._type === "link");
    const href = def?.href ? escapeHtml(def.href) : "#";
    html = `<a href="${href}">${html}</a>`;
  }
  return html;
}

function blockToHtml(block: PtBlock): string {
  const inner = inlineFromBlock(block);
  switch (block.style) {
    case "h2":
      return `<h2>${inner}</h2>`;
    case "h3":
      return `<h3>${inner}</h3>`;
    case "h4":
      return `<h4>${inner}</h4>`;
    case "blockquote":
      return `<blockquote>${inner}</blockquote>`;
    case "normal":
    default:
      return `<p>${inner}</p>`;
  }
}

/** Parse TipTap HTML back to Portable Text blocks. Browser-only (uses DOMParser). */
export function htmlToPortableTextBlocks(html: string): unknown[] {
  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return [];
  }
  const wrapped = `<div>${html}</div>`;
  const doc = new DOMParser().parseFromString(wrapped, "text/html");
  const root = doc.body.firstElementChild;
  if (!root) return [];

  const blocks: PtBlock[] = [];
  for (const child of Array.from(root.children)) {
    appendBlocksFromElement(child as HTMLElement, blocks);
  }
  return blocks.length ? blocks : emptyParagraphBlock();
}

function emptyParagraphBlock(): PtBlock[] {
  return [
    {
      _type: "block",
      _key: randomKey(),
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", _key: randomKey(), text: "", marks: [] }],
    },
  ];
}

/** Default empty story body for new articles (Portable Text blocks). */
export function emptyPortableTextBlocks(): unknown[] {
  return emptyParagraphBlock();
}

function appendBlocksFromElement(el: HTMLElement, blocks: PtBlock[]): void {
  const tag = el.tagName.toLowerCase();
  if (tag === "p") {
    blocks.push(paragraphBlockFromElement(el, "normal"));
    return;
  }
  if (tag === "h2") {
    blocks.push(paragraphBlockFromElement(el, "h2"));
    return;
  }
  if (tag === "h3") {
    blocks.push(paragraphBlockFromElement(el, "h3"));
    return;
  }
  if (tag === "h4") {
    blocks.push(paragraphBlockFromElement(el, "h4"));
    return;
  }
  if (tag === "blockquote") {
    blocks.push(paragraphBlockFromElement(el, "blockquote"));
    return;
  }
  if (tag === "ul") {
    for (const li of Array.from(el.querySelectorAll(":scope > li"))) {
      const p = li.querySelector("p") ?? li.firstElementChild;
      if (!p) continue;
      const { children, markDefs } = inlineSpansFromElement(p as HTMLElement);
      blocks.push({
        _type: "block",
        _key: randomKey(),
        style: "normal",
        listItem: "bullet",
        level: 1,
        markDefs,
        children,
      });
    }
    return;
  }
  if (tag === "ol") {
    for (const li of Array.from(el.querySelectorAll(":scope > li"))) {
      const p = li.querySelector("p") ?? li.firstElementChild;
      if (!p) continue;
      const { children, markDefs } = inlineSpansFromElement(p as HTMLElement);
      blocks.push({
        _type: "block",
        _key: randomKey(),
        style: "normal",
        listItem: "number",
        level: 1,
        markDefs,
        children,
      });
    }
    return;
  }
}

function paragraphBlockFromElement(el: HTMLElement, style: string): PtBlock {
  const { children, markDefs } = inlineSpansFromElement(el);
  return {
    _type: "block",
    _key: randomKey(),
    style,
    markDefs,
    children: children.length ? children : [{ _type: "span", _key: randomKey(), text: "", marks: [] }],
  };
}

function inlineSpansFromElement(el: HTMLElement): { children: PtSpan[]; markDefs: PtMarkDef[] } {
  const markDefs: PtMarkDef[] = [];
  const children: PtSpan[] = [];

  function flushText(text: string, marks: string[]) {
    const t = text.replace(/\u00a0/g, " ");
    if (!t && marks.length === 0) return;
    children.push({ _type: "span", _key: randomKey(), text: t, marks: [...marks] });
  }

  function walk(node: Node, marks: string[]): void {
    if (node.nodeType === Node.TEXT_NODE) {
      flushText(node.textContent ?? "", marks);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const e = node as HTMLElement;
    const name = e.tagName.toLowerCase();
    if (name === "br") {
      flushText("\n", marks);
      return;
    }
    if (name === "strong" || name === "b") {
      for (const c of Array.from(e.childNodes)) walk(c, [...marks, "strong"]);
      return;
    }
    if (name === "em" || name === "i") {
      for (const c of Array.from(e.childNodes)) walk(c, [...marks, "em"]);
      return;
    }
    if (name === "u") {
      for (const c of Array.from(e.childNodes)) walk(c, [...marks, "underline"]);
      return;
    }
    if (name === "code") {
      for (const c of Array.from(e.childNodes)) walk(c, [...marks, "code"]);
      return;
    }
    if (name === "s" || name === "strike" || name === "del") {
      for (const c of Array.from(e.childNodes)) walk(c, [...marks, "strike-through"]);
      return;
    }
    if (name === "a") {
      const href = e.getAttribute("href") || "#";
      const key = randomKey();
      markDefs.push({ _key: key, _type: "link", href });
      for (const c of Array.from(e.childNodes)) walk(c, [...marks, key]);
      return;
    }
    for (const c of Array.from(e.childNodes)) walk(c, marks);
  }

  walk(el, []);

  return { children: mergeAdjacentSpans(children), markDefs };
}

function mergeAdjacentSpans(spans: PtSpan[]): PtSpan[] {
  const out: PtSpan[] = [];
  for (const s of spans) {
    const prev = out[out.length - 1];
    if (
      prev &&
      prev.marks.join("\0") === s.marks.join("\0") &&
      prev._type === "span" &&
      s._type === "span"
    ) {
      prev.text += s.text;
    } else {
      out.push({ ...s });
    }
  }
  return out;
}
