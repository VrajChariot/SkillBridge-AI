import { useCallback, useState } from "react";
import { emptyDraft, type IntakeDraft } from "../features/intake";

const KEY = "skillbridge:job-posting";

/**
 * The form draft. The pasted posting survives a reload; the resume can't,
 * because a File can't be serialised.
 */
export function useDraft(): [IntakeDraft, (draft: IntakeDraft) => void] {
  const [draft, setDraftState] = useState<IntakeDraft>(() => ({
    ...emptyDraft,
    jobDescription: loadPosting(),
  }));

  const setDraft = useCallback((next: IntakeDraft) => {
    setDraftState(next);
    savePosting(next.jobDescription);
  }, []);

  return [draft, setDraft];
}

function loadPosting(): string {
  try {
    return sessionStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

function savePosting(posting: string): void {
  try {
    if (posting) sessionStorage.setItem(KEY, posting);
    else sessionStorage.removeItem(KEY);
  } catch {
    // Storage full or disabled: the posting still works, it just won't survive a reload.
  }
}
