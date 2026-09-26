/**
 * Culturin-branded transactional email via Resend's HTTP API (no SDK needed).
 *
 * Env:
 * - RESEND_API_KEY   required; without it every send is a quiet no-op.
 * - EMAIL_FROM       optional, default "Culturin <hello@culturin.com>".
 * - NOTIFY_EMAILS    optional comma list, default "unik@culturin.com,eloka@culturin.com".
 */

const DEFAULT_FROM = "Culturin <hello@culturin.com>";
const DEFAULT_TEAM = ["unik@culturin.com", "eloka@culturin.com"];
const SEND_TIMEOUT_MS = 5000;

const BG = "#f6f1ea";
const INK = "#1c1a17";
const MUTED = "#6f675d";
const RULE = "#e4dccf";
const ACCENT = "#cd6b3f";
const DISPLAY = "Recoleta, Georgia, 'Times New Roman', serif";
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";

export function teamRecipients(): string[] {
  const raw = process.env.NOTIFY_EMAILS?.trim();
  const list = raw ? raw.split(",").map((s) => s.trim()).filter(Boolean) : [];
  return list.length > 0 ? list : DEFAULT_TEAM;
}

export function siteOrigin(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.culturin.com").replace(/\/$/, "");
}

export function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

const linkStyle = `color:${INK} !important;text-decoration:underline;text-decoration-color:${ACCENT};`;

/**
 * Escape text and turn any email address or URL in it into a link styled in Culturin ink,
 * so mail apps don't auto-link it in their default blue.
 */
function linkify(text: string): string {
  return escapeHtml(text).replace(
    /(https?:\/\/[^\s<]+[^\s<.,;:!?)])|([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g,
    (m, url: string | undefined) => `<a href="${url ? m : `mailto:${m}`}" style="${linkStyle}">${m}</a>`,
  );
}

export type EmailDetail = { label: string; value: string; href?: string };

export const EMAIL_STYLE = { BG, INK, MUTED, RULE, ACCENT, DISPLAY, SANS, linkStyle } as const;

/**
 * The outer Culturin email: cream page, card with the gold Culturin logo on a dark band,
 * and a small footer. `content` is trusted HTML already styled inline.
 */
export function emailShell(opts: { title: string; preheader?: string; content: string; footer: string }): string {
  const logo = `${siteOrigin()}/email/culturin-logo.png`;
  const preheader = opts.preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${escapeHtml(opts.preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>`
    : "";
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"><meta name="format-detection" content="telephone=no,date=no,address=no,email=no,url=no"><style>a{color:${INK};}a[x-apple-data-detectors]{color:inherit !important;text-decoration:none !important;font:inherit !important;}u + #body a{color:inherit !important;text-decoration:none !important;}img{max-width:100%;height:auto;}</style><title>${escapeHtml(opts.title)}</title></head>
<body id="body" style="margin:0;padding:0;background:${BG};">
${preheader}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};">
<tr><td align="center" style="padding:32px 12px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
    <tr><td style="background:${INK};border-radius:20px 20px 0 0;padding:22px 28px;">
      <a href="${siteOrigin()}" style="text-decoration:none;"><img src="${logo}" width="146" height="41" alt="Culturin" style="display:block;border:0;width:146px;height:41px;"></a>
    </td></tr>
    <tr><td style="background:#fffdf9;border:1px solid ${RULE};border-top:0;border-radius:0 0 20px 20px;padding:32px 28px;">
${opts.content}
    </td></tr>
    <tr><td style="padding:20px 4px 0;font:400 12px/1.6 ${SANS};color:${MUTED};">${opts.footer}</td></tr>
  </table>
</td></tr>
</table>
</body></html>`;
}

/** Team alert layout: eyebrow, serif headline, detail rows, terracotta button. */
export function renderCulturinEmail(opts: {
  eyebrow: string;
  headline: string;
  intro?: string;
  details?: EmailDetail[];
  note?: string;
  cta?: { label: string; href: string };
}): string {
  const rows = (opts.details ?? [])
    .filter((d) => d.value.trim())
    .map((d) => {
      const value = d.href
        ? `<a href="${escapeHtml(d.href)}" style="${linkStyle}">${escapeHtml(d.value)}</a>`
        : linkify(d.value).replace(/\n/g, "<br>");
      return `<tr>
  <td style="padding:12px 0;border-top:1px solid ${RULE};width:34%;vertical-align:top;font:600 11px/1.4 ${SANS};letter-spacing:0.14em;text-transform:uppercase;color:${MUTED};">${escapeHtml(d.label)}</td>
  <td style="padding:12px 0;border-top:1px solid ${RULE};vertical-align:top;font:400 15px/1.5 ${SANS};color:${INK};">${value}</td>
</tr>`;
    })
    .join("");

  const content = `
      <p style="margin:0 0 12px;font:600 11px/1.4 ${SANS};letter-spacing:0.24em;text-transform:uppercase;color:${ACCENT};">${escapeHtml(opts.eyebrow)}</p>
      <h1 style="margin:0;font:500 28px/1.15 ${DISPLAY};color:${INK};">${escapeHtml(opts.headline)}</h1>
      ${opts.intro ? `<p style="margin:14px 0 0;font:400 15px/1.6 ${SANS};color:${MUTED};">${linkify(opts.intro)}</p>` : ""}
      ${rows ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;border-bottom:1px solid ${RULE};">${rows}</table>` : ""}
      ${opts.note ? `<p style="margin:20px 0 0;font:400 14px/1.6 ${SANS};color:${MUTED};">${linkify(opts.note)}</p>` : ""}
      ${opts.cta ? ctaButton(opts.cta) : ""}`;

  return emailShell({
    title: opts.headline,
    content,
    footer: "Culturin · Culture, in the room.<br>You're getting this because you're on the Culturin team.",
  });
}

export function ctaButton(cta: { label: string; href: string }): string {
  return `<p style="margin:28px 0 0;"><a href="${escapeHtml(cta.href)}" style="display:inline-block;background:${ACCENT};color:${INK} !important;text-decoration:none;border-radius:999px;padding:13px 26px;font:600 12px/1 ${SANS};letter-spacing:0.16em;text-transform:uppercase;">${escapeHtml(cta.label)}</a></p>`;
}

/** Plain-text fallback so the email isn't HTML-only (better deliverability). */
function toText(opts: { headline: string; intro?: string; details?: EmailDetail[]; note?: string; cta?: { label: string; href: string } }): string {
  return [
    opts.headline,
    opts.intro ?? "",
    ...(opts.details ?? []).filter((d) => d.value.trim()).map((d) => `${d.label}: ${d.value}`),
    opts.note ?? "",
    opts.cta ? `${opts.cta.label}: ${opts.cta.href}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

export type SendResult = { ok: true; id: string } | { ok: false; error: string };

export async function sendEmail(input: {
  to: string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return { ok: false, error: "RESEND_API_KEY is not set." };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SEND_TIMEOUT_MS);
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM?.trim() || DEFAULT_FROM,
        to: input.to,
        subject: input.subject,
        html: input.html,
        text: input.text,
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      }),
      signal: controller.signal,
      cache: "no-store",
    });
    const data = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
    if (!res.ok) return { ok: false, error: data.message ?? `Resend returned ${res.status}.` };
    return { ok: true, id: data.id ?? "" };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Send failed." };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Email the Culturin team. Never throws: a failed alert must not fail the visitor's form,
 * so errors are only logged. Awaited by callers so serverless doesn't cut it off.
 */
export async function notifyTeam(opts: {
  subject: string;
  eyebrow: string;
  headline: string;
  intro?: string;
  details?: EmailDetail[];
  note?: string;
  cta?: { label: string; href: string };
  replyTo?: string;
}): Promise<SendResult> {
  const result = await sendEmail({
    to: teamRecipients(),
    subject: opts.subject,
    html: renderCulturinEmail(opts),
    text: toText(opts),
    replyTo: opts.replyTo,
  });
  if (!result.ok && process.env.RESEND_API_KEY) console.error("[notifyTeam] failed", { subject: opts.subject, error: result.error });
  return result;
}
