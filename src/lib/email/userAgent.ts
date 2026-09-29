/**
 * Readable device + app from an email open/click user agent, e.g. "iPhone · Safari".
 * Best effort: mail providers load images through their own servers (Gmail's image proxy,
 * Apple Mail Privacy Protection), so opens often identify the provider, not the reader's device.
 * Clicks come from the reader's real browser and are the reliable signal.
 */
export function describeUserAgent(ua: string | null | undefined): string {
  const s = (ua ?? "").trim();
  if (!s) return "Unknown";
  if (/GoogleImageProxy|ggpht\.com/i.test(s)) return "Gmail (image proxy)";
  if (/YahooMailProxy/i.test(s)) return "Yahoo Mail (image proxy)";
  if (s === "Mozilla/5.0") return "Apple Mail (privacy protection)";

  const device = /iPhone/.test(s)
    ? "iPhone"
    : /iPad/.test(s)
      ? "iPad"
      : /Android/.test(s)
        ? "Android"
        : /Macintosh|Mac OS X/.test(s)
          ? "Mac"
          : /Windows/.test(s)
            ? "Windows"
            : /Linux|CrOS/.test(s)
              ? "Linux"
              : "";

  const app = /LinkedInApp/i.test(s)
    ? "LinkedIn app"
    : /Instagram/i.test(s)
      ? "Instagram app"
      : /FBAN|FBAV/i.test(s)
        ? "Facebook app"
        : /Outlook|Microsoft Office|ms-office/i.test(s)
          ? "Outlook"
          : /GSA\//.test(s)
            ? "Google app"
            : /Edg(A|iOS)?\//.test(s)
              ? "Edge"
              : /CriOS|Chrome\//.test(s)
                ? "Chrome"
                : /FxiOS|Firefox\//.test(s)
                  ? "Firefox"
                  : /Safari\//.test(s)
                    ? "Safari"
                    : /iPhone|iPad|Macintosh/.test(s)
                      ? "Apple Mail"
                      : "";

  return [device, app].filter(Boolean).join(" · ") || "Other";
}
