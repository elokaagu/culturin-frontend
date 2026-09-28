/**
 * Renders a broadcast (Portable Text body from the admin editor) as a Culturin email.
 * Pure and dependency-free so the admin can preview exactly what will be sent.
 */
import { portableTextBlocksToHtml } from "@/lib/portableText/tiptapHtmlBridge";

import { EMAIL_STYLE, ctaButton, emailShell, escapeHtml, siteOrigin } from "./culturinEmail";

const { INK, ACCENT, DISPLAY, SANS, linkStyle, linkStyleMuted } = EMAIL_STYLE;

const TAG_STYLES: Record<string, string> = {
  h2: `margin:28px 0 12px;font:500 28px/1.18 ${DISPLAY};color:${INK};`,
  h3: `margin:24px 0 10px;font:500 21px/1.25 ${DISPLAY};color:${INK};`,
  h4: `margin:0 0 12px;font:600 11px/1.4 ${SANS};letter-spacing:0.24em;text-transform:uppercase;color:${ACCENT};`,
  p: `margin:0 0 16px;font:400 16px/1.7 ${SANS};color:${INK};`,
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

function styleHtml(html: string): string {
  return html
    .replace(/<p><\/p>/g, "")
    .replace(
      /<(h2|h3|h4|p|blockquote|ul|ol|li|a|strong)(\s[^>]*)?>/g,
      (_m, tag: string, attrs = "") => `<${tag}${attrs}${TAG_CLASS[tag] ? ` class="${TAG_CLASS[tag]}"` : ""} style="${TAG_STYLES[tag]}">`,
    )
    .replace(/<img src="([^"]*)" alt="([^"]*)">/g, (_m, src: string, alt: string) => {
      const abs = src.startsWith("/") ? `${siteOrigin()}${src}` : src;
      return `<img src="${abs}" alt="${alt}" width="544" style="display:block;width:100%;max-width:544px;height:auto;border:0;border-radius:12px;margin:22px 0;">`;
    });
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

export function renderBroadcastHtml(b: BroadcastContent, unsubscribeUrl: string): string {
  const cta = getCta(b.body);
  const content = styleHtml(portableTextBlocksToHtml(b.body)) + (cta ? ctaButton({ label: cta.label, href: cta.url }) : "");
  const footer = [
    `<a href="${siteOrigin()}" class="em-muted" style="${linkStyleMuted}">Culturin</a>`,
    `You're receiving this because you joined the Culturin list. <a href="${escapeHtml(unsubscribeUrl)}" class="em-muted" style="${linkStyleMuted}">Unsubscribe</a>.`,
    process.env.NEXT_PUBLIC_EMAIL_POSTAL_ADDRESS?.trim() ? escapeHtml(process.env.NEXT_PUBLIC_EMAIL_POSTAL_ADDRESS.trim()) : "",
  ]
    .filter(Boolean)
    .join("<br>");
  return emailShell({ title: b.subject, preheader: b.preheader, content, footer });
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
  return `${text}${cta ? `\n\n${cta.label}: ${cta.url}` : ""}\n\n—\nCulturin: ${siteOrigin()}\nUnsubscribe: ${unsubscribeUrl}`;
}
