import { forwardRef, type KeyboardEvent } from "react";
import { FieldError } from "./FieldError";
import { MAX_POSTING_CHARS } from "./limits";
import type { PostingCheck } from "./validatePosting";

export interface JobPostingFieldProps {
  value: string;
  check: PostingCheck;
  /** Validation error to show; null until the person tries to submit. */
  error: string | null;
  disabled: boolean;
  onChange: (value: string) => void;
  onSubmitShortcut: () => void;
}

const ERROR_ID = "job-posting-error";
const HINT_ID = "job-posting-hint";
const COUNT_ID = "job-posting-count";

/** The job posting sheet: a tall textarea with a word and character count. */
export const JobPostingField = forwardRef<HTMLTextAreaElement, JobPostingFieldProps>(
  function JobPostingField({ value, check, error, disabled, onChange, onSubmitShortcut }, ref) {
    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        onSubmitShortcut();
      }
    };

    const showHint = Boolean(check.hint) && !error;
    const describedBy = [error && ERROR_ID, showHint && HINT_ID, COUNT_ID]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="flex flex-col gap-2">
        <div
          className={`flex flex-1 flex-col rounded-lg border bg-sheet focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ink ${
            error ? "border-correction" : "border-rule"
          }`}
        >
          <label htmlFor="job-posting" className="px-5 pt-4 font-semibold sm:px-6 sm:pt-5">
            Job posting
          </label>
          <textarea
            id="job-posting"
            ref={ref}
            value={value}
            disabled={disabled}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            spellCheck={false}
            placeholder="Paste the whole posting: the role summary, responsibilities, requirements and nice-to-haves."
            className="min-h-[18rem] flex-1 resize-y bg-transparent px-5 py-3 text-base text-ink placeholder:text-graphite focus-visible:outline-none disabled:text-graphite sm:min-h-[24rem] sm:px-6"
          />
          <div
            id={COUNT_ID}
            className="flex flex-wrap items-baseline justify-between gap-x-4 border-t border-rule px-5 py-2.5 text-sm text-graphite sm:px-6"
          >
            <span className="tabular">
              {check.words.toLocaleString("en-US")} {check.words === 1 ? "word" : "words"}
            </span>
            <span className={`tabular ${check.nearLimit ? "font-medium text-correction" : ""}`}>
              {check.characters.toLocaleString("en-US")} of{" "}
              {MAX_POSTING_CHARS.toLocaleString("en-US")} characters
            </span>
          </div>
        </div>
        {error && <FieldError id={ERROR_ID} message={error} />}
        {showHint && (
          <p id={HINT_ID} className="text-sm text-graphite">
            {check.hint}
          </p>
        )}
      </div>
    );
  },
);
