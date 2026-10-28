import type { ATSAnalysisResponse } from "../../types/ats";

/** Stable FNV-1a hash of the report content, used to persist checklist progress per report. */
export function reportKey(report: ATSAnalysisResponse): string {
  const text = JSON.stringify([
    report.current_score,
    report.summary,
    report.improvements.map((e) => [e.section, e.issue, e.suggestion, e.impact]),
  ]);
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}
