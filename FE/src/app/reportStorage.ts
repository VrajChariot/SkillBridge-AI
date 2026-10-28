import type { CompletedAnalysis } from "./analysisReducer";

const KEY = "skillbridge:last-report";

/** Keeps the latest report for this tab so a refresh doesn't lose it. */
export const reportStorage = {
  load(): CompletedAnalysis | null {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<CompletedAnalysis>;
      const valid =
        typeof parsed.fileName === "string" &&
        typeof parsed.report?.current_score === "number";
      return valid ? (parsed as CompletedAnalysis) : null;
    } catch {
      return null;
    }
  },

  save(result: CompletedAnalysis): void {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(result));
    } catch {
      // Storage full or disabled: the report still shows, it just won't survive a refresh.
    }
  },

  clear(): void {
    try {
      sessionStorage.removeItem(KEY);
    } catch {
      // Storage disabled: nothing to clear.
    }
  },
};
