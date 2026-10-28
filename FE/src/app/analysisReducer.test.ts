import { describe, expect, it } from "vitest";
import { analysisReducer, idle, type AnalysisState } from "./analysisReducer";
import type { ATSAnalysisResponse } from "../types/ats";

const report = { current_score: 60 } as ATSAnalysisResponse;
const error = { title: "t", body: "b" };

describe("analysisReducer", () => {
  it("moves from upload to analysis once the file is sent", () => {
    let state = analysisReducer(idle, { type: "start" });
    state = analysisReducer(state, { type: "progress", progress: 0.5 });
    expect(state).toEqual({ phase: "uploading", progress: 0.5 });
    state = analysisReducer(state, { type: "uploaded", at: 1000 });
    expect(state).toEqual({ phase: "analyzing", startedAt: 1000 });
  });

  it("clamps upload progress to 0..1", () => {
    const uploading = analysisReducer(idle, { type: "start" });
    expect(analysisReducer(uploading, { type: "progress", progress: 1.7 })).toEqual({
      phase: "uploading",
      progress: 1,
    });
  });

  it("ignores results that arrive after the person cancelled", () => {
    const cancelled = analysisReducer({ phase: "analyzing", startedAt: 0 }, { type: "reset" });
    const late: AnalysisState = analysisReducer(cancelled, {
      type: "succeed",
      result: { report, fileName: "cv.pdf" },
    });
    expect(late).toEqual(idle);
    expect(analysisReducer(cancelled, { type: "fail", error })).toEqual(idle);
  });

  it("does not regress to uploading after the upload finished", () => {
    const analyzing: AnalysisState = { phase: "analyzing", startedAt: 5 };
    expect(analysisReducer(analyzing, { type: "progress", progress: 0.2 })).toBe(analyzing);
  });

  it("allows a retry from a failure", () => {
    const failed: AnalysisState = { phase: "failed", error };
    expect(analysisReducer(failed, { type: "start" })).toEqual({ phase: "uploading", progress: 0 });
  });
});
