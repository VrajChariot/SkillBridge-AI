import { MISSING_RESUME } from "./validateResume";
import { validatePosting } from "./validatePosting";

export interface IntakeDraft {
  jobDescription: string;
  file: File | null;
}

export const emptyDraft: IntakeDraft = { jobDescription: "", file: null };

export interface DraftErrors {
  posting: string | null;
  resume: string | null;
}

/**
 * Errors that block a comparison. A rejected pick (wrong type, too big)
 * outranks the generic "add your resume" message.
 */
export function validateDraft(draft: IntakeDraft, resumeRejection: string | null): DraftErrors {
  return {
    posting: validatePosting(draft.jobDescription).error,
    resume: resumeRejection ?? (draft.file ? null : MISSING_RESUME),
  };
}

/** Fields in reading order, so focus lands on the first problem the person sees. */
export function firstInvalidField(errors: DraftErrors): keyof DraftErrors | null {
  if (errors.posting) return "posting";
  if (errors.resume) return "resume";
  return null;
}
