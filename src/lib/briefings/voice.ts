/** Culturin's brand voice for briefing copy (from docs/brand/culturin-brand-guide.md), plus a copy check. */

export const VOICE_RULES = `Voice: warm, discerning, understated, confident but never loud. Like a great host who knows the city and never brags about it. Culturin helps people discover and understand local cultures: the food, history, music, art and people that belong to each place.

Copy rules:
- British English (colour, centre, programme, neighbourhood).
- Never use em dashes. Use commas, colons or full stops.
- Short sentences. Concrete nouns, names and numbers. Specific beats superlative.
- Never define something by what it isn't. Banned: "not X but Y", "X, not Y", "less X, more Y", "more than just", "isn't just", "rather than".
- Never say: activation, touchpoint, synergy, leverage, world-class, exclusive, VIP, unlock, elevate, game-changer, hidden gem, vibrant, bustling, tapestry, melting pot, must-see, nestled, delve.
- Say "moments", "rooms", "nights", "guests", "partners" where a brand term is needed.
- No invented facts. No ages, private details or personal addresses. Never guess a social handle: use only handles that appear in the evidence.
- Every claim must come from the evidence and cite its source keys.`;

const BANNED_WORDS = [
  "activation", "activations", "touchpoint", "synergy", "leverage", "world-class", "exclusive", "vip", "unlock", "elevate",
  "game-changer", "hidden gem", "vibrant", "bustling", "tapestry", "melting pot", "must-see", "nestled", "delve",
];

const BANNED_PATTERNS: [RegExp, string][] = [
  [/\u2014/, "Uses an em dash"],
  [/\bnot\s+(?:just\s+)?(?:a|an|the)?\s*[\w'-]+(?:\s[\w'-]+){0,3},?\s+but\b/i, "Defines by contrast (\"not X but Y\")"],
  [/,\s*not\s+(?:a|an|the)?\s*[\w'-]+[.!]?$/im, "Defines by contrast (\"X, not Y\")"],
  [/\bless\s+[\w'-]+,?\s+more\s+[\w'-]+/i, "Defines by contrast (\"less X, more Y\")"],
  [/\bmore than just\b|\bisn'?t just\b|\bisn’t just\b/i, "Defines by contrast (\"more than just\")"],
  [/\brather than\b/i, "Defines by contrast (\"rather than\")"],
];

/** Copy problems in a piece of text, as reviewer-facing notes. */
export function voiceIssues(text: string): string[] {
  const issues: string[] = [];
  const lower = text.toLowerCase();
  for (const word of BANNED_WORDS) {
    if (new RegExp(`\\b${word.replace(/[-\s]/g, "[-\\s]")}\\b`, "i").test(lower)) issues.push(`Uses "${word}"`);
  }
  for (const [re, note] of BANNED_PATTERNS) if (re.test(text)) issues.push(note);
  return issues;
}
