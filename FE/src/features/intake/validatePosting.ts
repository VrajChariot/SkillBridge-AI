import {
  MAX_POSTING_CHARS,
  POSTING_NEAR_LIMIT_CHARS,
  SHORT_POSTING_WORDS,
} from "./limits";

export interface PostingCheck {
  words: number;
  characters: number;
  /** At or past the near-limit threshold; the count is shown as a problem. */
  nearLimit: boolean;
  /** Blocks submit. */
  error: string | null;
  /** Non-blocking advice. */
  hint: string | null;
}

export function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed === "" ? 0 : trimmed.split(/\s+/).length;
}

export function validatePosting(text: string): PostingCheck {
  const words = countWords(text);
  const characters = text.length;
  return {
    words,
    characters,
    nearLimit: characters >= POSTING_NEAR_LIMIT_CHARS,
    error: postingError(words, characters),
    hint:
      words > 0 && words < SHORT_POSTING_WORDS
        ? "Short postings give less reliable scores. Include responsibilities and requirements."
        : null,
  };
}

function postingError(words: number, characters: number): string | null {
  if (words === 0) return "Paste the job posting you want to compare against.";
  if (characters > MAX_POSTING_CHARS) {
    const over = characters - MAX_POSTING_CHARS;
    const unit = over === 1 ? "character" : "characters";
    return `Remove ${over.toLocaleString("en-US")} ${unit}. The limit is 20,000; keep the role description, responsibilities and requirements.`;
  }
  return null;
}
