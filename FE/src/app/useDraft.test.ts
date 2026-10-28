import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDraft } from "./useDraft";

const resume = new File(["x"], "cv.pdf", { type: "application/pdf" });

describe("useDraft", () => {
  beforeEach(() => sessionStorage.clear());

  it("restores the posting after a reload, but not the resume", () => {
    const first = renderHook(() => useDraft());
    act(() => first.result.current[1]({ jobDescription: "Senior engineer", file: resume }));
    first.unmount();

    const reloaded = renderHook(() => useDraft());
    expect(reloaded.result.current[0]).toEqual({ jobDescription: "Senior engineer", file: null });
  });

  it("forgets the posting once it is cleared", () => {
    const first = renderHook(() => useDraft());
    act(() => first.result.current[1]({ jobDescription: "Senior engineer", file: null }));
    act(() => first.result.current[1]({ jobDescription: "", file: null }));
    first.unmount();

    expect(renderHook(() => useDraft()).result.current[0].jobDescription).toBe("");
  });

  it("keeps working when storage throws", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    const { result } = renderHook(() => useDraft());
    act(() => result.current[1]({ jobDescription: "Senior engineer", file: null }));
    expect(result.current[0].jobDescription).toBe("Senior engineer");
    spy.mockRestore();
  });
});
