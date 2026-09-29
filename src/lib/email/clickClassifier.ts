/**
 * Corporate email security (Mimecast, Proofpoint, Microsoft Defender, etc.) opens every
 * incoming email and "clicks" every link to check it's safe, seconds after delivery. Those
 * clicks aren't people and make click rates look far higher than they are. This flags them.
 *
 * A click is treated as automated when any of these hold:
 * - it came within 15 seconds of the email being delivered (too fast to have read it);
 * - it's part of a burst: another click by the same person within 10 seconds on a different
 *   link, or 3+ clicks within 10 seconds (once someone clicks through they're on the website,
 *   not clicking the next link in the email);
 * - the "browser" is a headless/sandbox one (HeadlessChrome, desktop Linux, which in practice
 *   is almost always a scanning sandbox) or not a browser at all (CloudFront, curl, bots);
 * - it's in the same scanning session: within 5 minutes of another click by the same person
 *   that is automated. Scanners often switch browser identity mid-scan, so one scanner click
 *   taints the clicks around it.
 */

export type ClickForClassify = { email: string; link: string | null; userAgent: string | null; at: number };

const INSTANT_MS = 15_000;
const BURST_MS = 10_000;
const SESSION_MS = 5 * 60_000;
const SANDBOX_UA = /HeadlessChrome|X11; Linux|CloudFront|bot|crawler|spider|curl|python|java\//i;

/** Returns one boolean per click, in the same order: true = likely automated. */
export function classifyClicks(clicks: ClickForClassify[], deliveredAt: Map<string, number>): boolean[] {
  const result = clicks.map(() => false);
  const byPerson = new Map<string, number[]>();
  clicks.forEach((c, i) => byPerson.set(c.email, [...(byPerson.get(c.email) ?? []), i]));

  byPerson.forEach((idxs, email) => {
    const delivered = deliveredAt.get(email);
    for (const i of idxs) {
      const c = clicks[i];
      if (c.userAgent && (SANDBOX_UA.test(c.userAgent) || !/^Mozilla\//.test(c.userAgent))) result[i] = true;
      if (delivered !== undefined && c.at - delivered <= INSTANT_MS) result[i] = true;
      const near = idxs.filter((j) => j !== i && Math.abs(clicks[j].at - c.at) <= BURST_MS);
      if (near.some((j) => (clicks[j].link ?? "") !== (c.link ?? "")) || near.length >= 2) result[i] = true;
    }
    // Spread scanner verdicts across the rest of that scanning session (repeat until stable).
    let changed = true;
    while (changed) {
      changed = false;
      for (const i of idxs) {
        if (result[i]) continue;
        if (idxs.some((j) => result[j] && Math.abs(clicks[j].at - clicks[i].at) <= SESSION_MS)) {
          result[i] = true;
          changed = true;
        }
      }
    }
  });
  return result;
}

/** Unsubscribe clicks aren't engagement, even when a real person makes them. */
export function isUnsubscribeLink(link: string | null | undefined): boolean {
  return /\/unsubscribe/.test(link ?? "");
}
