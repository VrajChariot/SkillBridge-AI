import { useEffect, useRef, useState, type FormEvent } from "react";
import type { AnalysisState } from "../../app/analysisReducer";
import { Button, Notice } from "../../ui";
import { AnalysisProgress } from "./AnalysisProgress";
import { firstInvalidField, validateDraft, type IntakeDraft } from "./draft";
import { IntakeHero } from "./IntakeHero";
import { JobPostingField } from "./JobPostingField";
import { MAX_POSTING_CHARS } from "./limits";
import { phaseAnnouncement } from "./phaseAnnouncement";
import { ResumeField } from "./ResumeField";
import { SubmitShortcutHint } from "./SubmitShortcutHint";
import { validateResume } from "./validateResume";
import { validatePosting } from "./validatePosting";

export interface IntakeScreenProps {
  draft: IntakeDraft;
  onDraftChange: (draft: IntakeDraft) => void;
  /** idle, uploading, analyzing or failed. */
  state: AnalysisState;
  /** Called only when the draft is valid. */
  onSubmit: () => void;
  /** Cancels an in-flight comparison. */
  onCancel: () => void;
}

export function IntakeScreen({ draft, onDraftChange, state, onSubmit, onCancel }: IntakeScreenProps) {
  const postingRef = useRef<HTMLTextAreaElement>(null);
  const resumeRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [attempted, setAttempted] = useState(false);
  const [resumeRejection, setResumeRejection] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const previousPhase = useRef(state.phase);

  const busy = state.phase === "uploading" || state.phase === "analyzing";
  const postingCheck = validatePosting(draft.jobDescription);
  const errors = validateDraft(draft, resumeRejection);
  const overLimit = postingCheck.characters > MAX_POSTING_CHARS;

  useEffect(() => {
    const previous = previousPhase.current;
    previousPhase.current = state.phase;
    const message = phaseAnnouncement(previous, state.phase);
    // Clear on silent transitions (e.g. failure, announced by the error notice) so nothing stale lingers.
    setAnnouncement(message ?? "");
    // Progress just unmounted; put focus back on the action that retries.
    const wasBusy = previous === "uploading" || previous === "analyzing";
    if (wasBusy && !busy) formRef.current?.querySelector<HTMLButtonElement>("[type=submit]")?.focus();
  }, [state.phase, busy]);

  const submit = () => {
    if (busy) return;
    const invalid = firstInvalidField(errors);
    if (!invalid) {
      onSubmit();
      return;
    }
    setAttempted(true);
    (invalid === "posting" ? postingRef : resumeRef).current?.focus();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit();
  };

  const pickResume = (file: File) => {
    const check = validateResume(file);
    if (check.ok) {
      setResumeRejection(null);
      onDraftChange({ ...draft, file });
    } else {
      // Keep any earlier valid file; say why this one was refused.
      setResumeRejection(check.message);
    }
  };

  const removeResume = () => {
    setResumeRejection(null);
    onDraftChange({ ...draft, file: null });
    requestAnimationFrame(() => resumeRef.current?.focus());
  };

  return (
    <div className="flex flex-1 flex-col gap-6 tall:gap-8">
      <IntakeHero />

      <form ref={formRef} noValidate onSubmit={handleSubmit} className="flex flex-1 flex-col gap-6">
        {/* On desktop the two sheets take whatever height is left, so the page fits the viewport. */}
        <div className="grid flex-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col lg:col-span-7">
            <JobPostingField
              ref={postingRef}
              value={draft.jobDescription}
              check={postingCheck}
              error={attempted || overLimit ? errors.posting : null}
              disabled={busy}
              onChange={(jobDescription) => onDraftChange({ ...draft, jobDescription })}
              onSubmitShortcut={submit}
            />
          </div>
          <div className="flex flex-col lg:col-span-5">
            <ResumeField
              ref={resumeRef}
              file={draft.file}
              error={resumeRejection || attempted ? errors.resume : null}
              disabled={busy}
              onPick={pickResume}
              onRemove={removeResume}
            />
          </div>
        </div>

        {state.phase === "failed" && (
          <Notice tone="error" title={state.error.title}>
            {state.error.body}
          </Notice>
        )}

        {state.phase === "uploading" || state.phase === "analyzing" ? (
          <AnalysisProgress state={state} onCancel={onCancel} />
        ) : (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Button type="submit" size="lg">
              Compare resume to job
            </Button>
            <SubmitShortcutHint />
          </div>
        )}

        <p aria-live="polite" className="sr-only">
          {announcement}
        </p>
      </form>
    </div>
  );
}
