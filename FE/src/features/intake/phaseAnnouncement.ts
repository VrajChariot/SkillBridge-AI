import type { AnalysisState } from "../../app/analysisReducer";

type Phase = AnalysisState["phase"];

/**
 * What a screen reader hears when the comparison moves on. Failures are
 * left to the error notice, which announces itself.
 */
export function phaseAnnouncement(previous: Phase, current: Phase): string | null {
  if (previous === current) return null;
  if (current === "uploading") return "Uploading your resume.";
  if (current === "analyzing") return "Upload complete. Reading your resume against the posting.";
  if (current === "idle" && (previous === "uploading" || previous === "analyzing")) {
    return "Comparison cancelled. Your posting and resume are still here.";
  }
  return null;
}
