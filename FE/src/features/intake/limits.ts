export const MEGABYTE = 1024 * 1024;
export const MAX_RESUME_BYTES = 10 * MEGABYTE;
export const MAX_POSTING_CHARS = 20_000;
/** The character count turns red from here on, before the hard limit. */
export const POSTING_NEAR_LIMIT_CHARS = 18_000;
/** Below this many words the score gets less reliable. */
export const SHORT_POSTING_WORDS = 50;
