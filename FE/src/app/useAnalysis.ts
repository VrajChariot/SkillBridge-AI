import { useCallback, useEffect, useReducer, useRef } from "react";
import { analyzeResume } from "../services/api";
import { describeError } from "../services/errors";
import { analysisReducer, idle, type AnalysisState } from "./analysisReducer";
import { reportStorage } from "./reportStorage";

export interface UseAnalysis {
  state: AnalysisState;
  start: (file: File, jobDescription: string) => void;
  /** Stops an in-flight comparison and returns to the form. */
  cancel: () => void;
  /** Leaves the report or error and returns to the form. */
  reset: () => void;
}

function initialState(): AnalysisState {
  const saved = reportStorage.load();
  return saved ? { phase: "done", ...saved } : idle;
}

export function useAnalysis(): UseAnalysis {
  const [state, dispatch] = useReducer(analysisReducer, undefined, initialState);
  const controller = useRef<AbortController | null>(null);

  const abortInFlight = () => {
    controller.current?.abort();
    controller.current = null;
  };

  useEffect(() => abortInFlight, []);

  const start = useCallback((file: File, jobDescription: string) => {
    abortInFlight();
    const current = new AbortController();
    controller.current = current;
    dispatch({ type: "start" });

    analyzeResume(file, jobDescription, {
      signal: current.signal,
      onUploadProgress: (progress) => dispatch({ type: "progress", progress }),
      onUploaded: () => dispatch({ type: "uploaded", at: Date.now() }),
    })
      .then((report) => {
        const result = { report, fileName: file.name };
        reportStorage.save(result);
        dispatch({ type: "succeed", result });
      })
      .catch((error: unknown) => {
        if (current.signal.aborted) return;
        dispatch({ type: "fail", error: describeError(error) });
      })
      .finally(() => {
        if (controller.current === current) controller.current = null;
      });
  }, []);

  const cancel = useCallback(() => {
    abortInFlight();
    dispatch({ type: "reset" });
  }, []);

  const reset = useCallback(() => {
    abortInFlight();
    reportStorage.clear();
    dispatch({ type: "reset" });
  }, []);

  return { state, start, cancel, reset };
}
