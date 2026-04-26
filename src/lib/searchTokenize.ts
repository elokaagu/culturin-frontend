/**
 * Splits a search string into non-empty terms (lowercase, punctuation stripped).
 * Used for multi-word queries so e.g. "lisbon food" matches content where
 * "Lisbon" appears in the title and "food"/"seafood" appears in the body — not
 * the exact phrase "lisbon food".
 */
export function tokenizeSearchQuery(raw: string): string[] {
  return raw
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .map((t) => t.replace(/[^\p{L}\p{N}]+/gu, ""))
    .filter((t) => t.length >= 2);
}

/** All tokens must match as substrings in the given blob. */
export function textMatchesAllTokens(text: string, tokens: string[]): boolean {
  if (tokens.length === 0) return true;
  const t = text.toLowerCase();
  return tokens.every((tok) => t.includes(tok));
}
