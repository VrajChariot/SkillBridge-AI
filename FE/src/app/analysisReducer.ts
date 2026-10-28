import type { ATSAnalysisResponse } from "../types/ats";
import type { ErrorCopy } from "../services/errors";

export interface CompletedAnalysis {
  report: ATSAnalysisResponse;
  fileName: string;
}

export type AnalysisState =
  | { phase: "idle" }
  | { phase: "uploading"; progress: number }
  | { phase: "analyzing"; startedAt: number }
  | ({ phase: "done" } & CompletedAnalysis)
  | { phase: "failed"; error: ErrorCopy };

export type AnalysisAction =
  | { type: "start" }
  | { type: "progress"; progress: number }
  | { type: "uploaded"; at: number }
  | { type: "succeed"; result: CompletedAnalysis }
  | { type: "fail"; error: ErrorCopy }
  | { type: "reset" };

export const idle: AnalysisState = { phase: "idle" };

export function analysisReducer(
  state: AnalysisState,
  action: AnalysisAction,
): AnalysisState {
  switch (action.type) {
    case "start":
      return { phase: "uploading", progress: 0 };
    case "progress":
      return state.phase === "uploading"
        ? { phase: "uploading", progress: clamp(action.progress) }
        : state;
    case "uploaded":
      return state.phase === "uploading"
        ? { phase: "analyzing", startedAt: action.at }
        : state;
    case "succeed":
      return isBusy(state) ? { phase: "done", ...action.result } : state;
    case "fail":
      return isBusy(state) ? { phase: "failed", error: action.error } : state;
    case "reset":
      return idle;
  }
}

export function isBusy(state: AnalysisState): boolean {
  return state.phase === "uploading" || state.phase === "analyzing";
}

function clamp(fraction: number): number {
  return Math.min(1, Math.max(0, fraction));
}
