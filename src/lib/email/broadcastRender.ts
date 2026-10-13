/**
 * Renders a broadcast (Portable Text body from the admin editor) as a Culturin email.
 * Pure and dependency-free so the admin can preview exactly what will be sent.
 */
import { portableTextBlocksToHtml } from "@/lib/portableText/tiptapHtmlBridge";

import { EMAIL_CONTENT_WIDTH, EMAIL_STYLE, ctaButton, emailShell, escapeHtml, siteOrigin } from "./culturinEmail";

const { INK, MUTED, RULE, ACCENT, DISPLAY, SANS, linkStyle, linkStyleMuted } = EMAIL_STYLE;

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/culturinworld/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/culturin" },
];

const H2_STYLE = `margin:32px 0 14px;font:500 30px/1.15 ${DISPLAY};letter-spacing:-0.01em;color:${INK};`;
const P_STYLE = `margin:0 0 16px;font:400 16px/1.7 ${SANS};color:${INK};`;

const TAG_STYLES: Record<string, string> = {
  h2: H2_STYLE,
  h3: `margin:24px 0 10px;font:500 21px/1.25 ${DISPLAY};color:${INK};`,
  h4: `margin:0 0 14px;font:600 11px/1.4 ${SANS};letter-spacing:0.24em;text-transform:uppercase;color:${ACCENT};`,
  p: P_STYLE,
  blockquote: `margin:26px 0;padding:2px 0 2px 18px;border-left:2px solid ${ACCENT};font:italic 400 21px/1.45 ${DISPLAY};color:${INK};`,
  ul: `margin:0 0 16px;padding-left:22px;`,
  ol: `margin:0 0 16px;padding-left:22px;`,
  li: `margin:0 0 6px;font:400 16px/1.6 ${SANS};color:${INK};`,
  a: linkStyle,
  strong: "font-weight:600;",
};

// Classes that let the shell's dark-mode media query re-assert these colors (see emailShell).
const TAG_CLASS: Record<string, string> = {
  h2: "em-ink",
  h3: "em-ink",
  h4: "em-accent",
  p: "em-ink",
  blockquote: "em-ink",
  li: "em-ink",
  a: "em-ink",
};

function absoluteUrl(src: string): string {
  return src.startsWith("/") ? `${siteOrigin()}${src}` : src;
}

function styleHtml(html: string): string {
  return (
    html
      .replace(/<p><\/p>/g, "")
      .replace(
        /<(h2|h3|h4|p|blockquote|ul|ol|li|a|strong)(\s[^>]*)?>/g,
        (_m, tag: string, attrs = "") => `<${tag}${attrs}${TAG_CLASS[tag] ? ` class="${TAG_CLASS[tag]}"` : ""} style="${TAG_STYLES[tag]}">`,
      )
      .replace(/<img src="([^"]*)" alt="([^"]*)">/g, (_m, src: string, alt: string) => {
        return `<img src="${absoluteUrl(src)}" alt="${alt}" width="${EMAIL_CONTENT_WIDTH}" style="display:block;width:100%;max-width:${EMAIL_CONTENT_WIDTH}px;height:auto;border:0;border-radius:12px;margin:24px 0;">`;
      })
      // The opening headline sits tight under its label (or the top of the card), not a section's gap below it.
      .replace(new RegExp(`^(\\s*(?:<h4[^>]*>.*?</h4>)?\\s*<h2 class="em-ink" style=")margin:32px`), "$1margin:0")
      // The paragraph straight after the opening headline reads as a standfirst.
      .replace(
        new RegExp(`^(\\s*(?:<h4[^>]*>.*?</h4>)?\\s*<h2[^>]*>.*?</h2>\\s*<p class="em-ink" style=")margin:0 0 16px;font:400 16px/1.7`),
        "$1margin:0 0 18px;font:400 18px/1.6",
      )
  );
}

export type BroadcastContent = { subject: string; preheader: string; body: unknown };

/** The optional button at the end of a broadcast, stored as a trailing `{ _type: "cta" }` item in the body. */
export type BroadcastCta = { label: string; url: string };

export const DEFAULT_CTA: BroadcastCta = { label: "Get in touch", url: "https://www.culturin.com/partner" };

export function isSafeCtaUrl(url: string): boolean {
  return /^(https:\/\/|mailto:)\S+$/i.test(url.trim());
}

export function getCta(body: unknown): BroadcastCta | null {
  if (!Array.isArray(body)) return null;
  const item = body.find((b) => b && typeof b === "object" && (b as { _type?: string })._type === "cta") as
    | { label?: unknown; url?: unknown }
    | undefined;
  const label = typeof item?.label === "string" ? item.label.trim() : "";
  const url = typeof item?.url === "string" ? item.url.trim() : "";
  return label && isSafeCtaUrl(url) ? { label, url } : null;
}

/** Editor blocks plus the button (if any), as saved. */
export function withCta(blocks: unknown, cta: BroadcastCta | null): unknown[] {
  const rest = (Array.isArray(blocks) ? blocks : []).filter((b) => !(b && typeof b === "object" && (b as { _type?: string })._type === "cta"));
  return cta && cta.label.trim() && isSafeCtaUrl(cta.url) ? [...rest, { _type: "cta", _key: "cta", label: cta.label.trim(), url: cta.url.trim() }] : rest;
}

/** The optional closing at the end of a broadcast, stored as a trailing `{ _type: "signoff" }` item in the body. */
export type BroadcastSignoff = { closing: string; name: string };

export const DEFAULT_SIGNOFF: BroadcastSignoff = { closing: "Warm regards,", name: "The Culturin Team" };

export function getSignoff(body: unknown): BroadcastSignoff | null {
  if (!Array.isArray(body)) return null;
  const item = body.find((b) => b && typeof b === "object" && (b as { _type?: string })._type === "signoff") as
    | { closing?: unknown; name?: unknown }
    | undefined;
  const closing = typeof item?.closing === "string" ? item.closing.trim() : "";
  const name = typeof item?.name === "string" ? item.name.trim() : "";
  return name ? { closing, name } : null;
}

/** Editor blocks plus the sign-off (if any), as saved. */
export function withSignoff(blocks: unknown, signoff: BroadcastSignoff | null): unknown[] {
  const rest = (Array.isArray(blocks) ? blocks : []).filter((b) => !(b && typeof b === "object" && (b as { _type?: string })._type === "signoff"));
  return signoff && signoff.name.trim()
    ? [...rest, { _type: "signoff", _key: "signoff", closing: signoff.closing.trim(), name: signoff.name.trim() }]
    : rest;
}

function signoffHtml(s: BroadcastSignoff): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="em-rule" style="margin-top:32px;border-top:1px solid ${RULE};"><tr><td style="padding-top:22px;">
${s.closing ? `<p class="em-muted" style="margin:0 0 6px;font:400 15px/1.5 ${SANS};color:${MUTED};">${escapeHtml(s.closing)}</p>` : ""}
<p class="em-ink" style="margin:0;font:italic 400 22px/1.3 ${DISPLAY};color:${INK};">${escapeHtml(s.name)}</p>
</td></tr></table>`;
}

/** A picture at the very top of the email runs full width above the card, like a magazine cover. */
function splitHero(body: unknown): { hero: { src: string; alt: string } | undefined; rest: unknown[] } {
  const blocks = Array.isArray(body) ? body : [];
  const first = blocks[0] as { _type?: string; url?: unknown; alt?: unknown } | undefined;
  if (first?._type === "image" && typeof first.url === "string" && first.url) {
    return { hero: { src: absoluteUrl(first.url), alt: typeof first.alt === "string" ? first.alt : "" }, rest: blocks.slice(1) };
  }
  return { hero: undefined, rest: blocks };
}

/** `eventGuest`: sent to an event's guest list rather than the mailing list. */
export function renderBroadcastHtml(b: BroadcastContent, unsubscribeUrl: string, eventGuest = false): string {
  const cta = getCta(b.body);
  const signoff = getSignoff(b.body);
  const { hero, rest } = splitHero(b.body);
  const content =
    styleHtml(portableTextBlocksToHtml(rest)) + (cta ? ctaButton({ label: cta.label, href: cta.url }) : "") + (signoff ? signoffHtml(signoff) : "");
  const reason = eventGuest ? "you registered for a Culturin event" : "you joined the Culturin list";
  const sep = `<span class="em-muted" style="color:${MUTED};">&nbsp;&nbsp;·&nbsp;&nbsp;</span>`;
  const links = [
    `<a href="${siteOrigin()}" class="em-muted" style="${linkStyleMuted}">culturin.com</a>`,
    ...SOCIAL_LINKS.map((l) => `<a href="${l.href}" class="em-muted" style="${linkStyleMuted}">${l.label}</a>`),
  ].join(sep);
  const footer = [
    links,
    `You're receiving this because ${reason}. <a href="${escapeHtml(unsubscribeUrl)}" class="em-muted" style="${linkStyleMuted}">Unsubscribe</a>.`,
    process.env.NEXT_PUBLIC_EMAIL_POSTAL_ADDRESS?.trim() ? escapeHtml(process.env.NEXT_PUBLIC_EMAIL_POSTAL_ADDRESS.trim()) : "",
  ]
    .filter(Boolean)
    .join("<br>");
  return emailShell({ title: b.subject, preheader: b.preheader, content, footer, hero });
}

/** Plain-text version for mail apps that prefer it (and better deliverability). */
export function renderBroadcastText(b: BroadcastContent, unsubscribeUrl: string): string {
  const text = portableTextBlocksToHtml(b.body)
    .replace(/<img [^>]*alt="([^"]*)"[^>]*>/g, "[$1]\n\n")
    .replace(/<a href="([^"]*)">(.*?)<\/a>/g, "$2 ($1)")
    .replace(/<\/(h2|h3|h4|p|blockquote|li)>/g, "\n\n")
    .replace(/<li>/g, "• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  const cta = getCta(b.body);
  const signoff = getSignoff(b.body);
  return `${text}${cta ? `\n\n${cta.label}: ${cta.url}` : ""}${signoff ? `\n\n${[signoff.closing, signoff.name].filter(Boolean).join("\n")}` : ""}\n\n—\nCulturin: ${siteOrigin()}\nUnsubscribe: ${unsubscribeUrl}`;
}
