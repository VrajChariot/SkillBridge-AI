export const MEGABYTE = 1024 * 1024;
/** Vercel functions reject request bodies over 4.5 MB. */
export const MAX_RESUME_BYTES = 4.5 * MEGABYTE;
export const MAX_RESUME_LABEL = `${MAX_RESUME_BYTES / MEGABYTE} MB`;
export const MAX_POSTING_CHARS = 20_000;
/** The character count turns red from here on, before the hard limit. */
export const POSTING_NEAR_LIMIT_CHARS = 18_000;
/** Below this many words the score gets less reliable. */
export const SHORT_POSTING_WORDS = 50;
