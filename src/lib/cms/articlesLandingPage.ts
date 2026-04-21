import { ARTICLES_LANDING_EDITORIAL } from "../../content/articlesLandingEditorial";

const DEFAULT_PAGE_ID = "65b25faecac4c3b01971d7d2";

export type ArticlesLandingCmsStatus =
  | "ok"
  | "missing_base_url"
  | "bad_response"
  | "network_error";

export type ArticlesLandingPageModel = {
  headline: string;
  intro: string;
  cmsStatus: ArticlesLandingCmsStatus;
  bodyParagraphs: readonly string[];
  heroImage: typeof ARTICLES_LANDING_EDITORIAL.heroImage;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

/**
 * Best-effort parse for Payload-style `pages` API: first layout block with string heading/text.
 */
function parseHeroFromPayload(json: unknown): { heading: string; text: string } | null {
  if (!isRecord(json)) return null;
  const layout = json.layout;
  if (!Array.isArray(layout) || layout.length === 0) return null;
  const first = layout[0];
  if (!isRecord(first)) return null;
  const heading = readString(first.heading);
  const text = readString(first.text);
  if (heading === null && text === null) return null;
  return {
    heading: heading ?? "",
    text: text ?? "",
  };
}

function normalizeBaseUrl(raw: string | undefined): string | null {
  if (!raw?.trim()) return null;
  return raw.replace(/\/$/, "");
}

function buildPagesUrl(base: string, pageId: string): string {
  const params = new URLSearchParams();
  params.set("draft", "false");
  params.set("depth", "1");
  const locale = process.env.NEXT_PUBLIC_CMS_LOCALE?.trim();
  if (locale) params.set("locale", locale);
  return `${base}/api/pages/${pageId}?${params.toString()}`;
}

export async function getArticlesLandingPage(): Promise<ArticlesLandingPageModel> {
  const base = normalizeBaseUrl(process.env.NEXT_PUBLIC_CMS_BASE_URL);
  const pageId =
    process.env.NEXT_PUBLIC_CMS_ARTICLES_LANDING_ID?.trim() || DEFAULT_PAGE_ID;

  const editorial = ARTICLES_LANDING_EDITORIAL;

  if (!base) {
    return {
      headline: editorial.fallbackHeadline,
      intro: editorial.fallbackIntro,
      cmsStatus: "missing_base_url",
      bodyParagraphs: editorial.bodyParagraphs,
      heroImage: editorial.heroImage,
    };
  }

  const url = buildPagesUrl(base, pageId);

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return {
        headline: editorial.fallbackHeadline,
        intro: editorial.fallbackIntro,
        cmsStatus: "bad_response",
        bodyParagraphs: editorial.bodyParagraphs,
        heroImage: editorial.heroImage,
      };
    }

    const json: unknown = await response.json();
    const hero = parseHeroFromPayload(json);

    if (!hero || (!hero.heading.trim() && !hero.text.trim())) {
      return {
        headline: editorial.fallbackHeadline,
        intro: editorial.fallbackIntro,
        cmsStatus: "bad_response",
        bodyParagraphs: editorial.bodyParagraphs,
        heroImage: editorial.heroImage,
      };
    }

    return {
      headline: hero.heading.trim() || editorial.fallbackHeadline,
      intro: hero.text.trim() || editorial.fallbackIntro,
      cmsStatus: "ok",
      bodyParagraphs: editorial.bodyParagraphs,
      heroImage: editorial.heroImage,
    };
  } catch {
    return {
      headline: editorial.fallbackHeadline,
      intro: editorial.fallbackIntro,
      cmsStatus: "network_error",
      bodyParagraphs: editorial.bodyParagraphs,
      heroImage: editorial.heroImage,
    };
  }
}
