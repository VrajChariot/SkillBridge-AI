import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { paymentsReport, strongReport } from "./fixtures";
import { reportKey } from "./reportKey";
import { useCompletedEdits } from "./useCompletedEdits";

// Node's own experimental localStorage can shadow jsdom's; use a plain in-memory store.
beforeEach(() => {
  const data = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
    clear: () => data.clear(),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("reportKey", () => {
  it("is stable for equal content and differs when edits change", () => {
    const copy = structuredClone(paymentsReport);
    expect(reportKey(copy)).toBe(reportKey(paymentsReport));
    copy.improvements[0].suggestion += ".";
    expect(reportKey(copy)).not.toBe(reportKey(paymentsReport));
    expect(reportKey(strongReport)).not.toBe(reportKey(paymentsReport));
  });
});

describe("useCompletedEdits", () => {
  it("restores completed edits after a remount", () => {
    const first = renderHook(() => useCompletedEdits("abc"));
    act(() => first.result.current.toggle(2));
    act(() => first.result.current.toggle(4));
    act(() => first.result.current.toggle(2));
    first.unmount();

    const second = renderHook(() => useCompletedEdits("abc"));
    expect([...second.result.current.done]).toEqual([4]);
  });

  it("keeps progress separate per report", () => {
    const { result, rerender } = renderHook(({ k }) => useCompletedEdits(k), {
      initialProps: { k: "one" },
    });
    act(() => result.current.toggle(1));
    rerender({ k: "two" });
    expect(result.current.done.size).toBe(0);
    rerender({ k: "one" });
    expect([...result.current.done]).toEqual([1]);
  });

  it("ignores corrupt stored data", () => {
    localStorage.setItem("skillbridge:report-edits:bad", '{"not":"a list"}');
    const { result } = renderHook(() => useCompletedEdits("bad"));
    expect(result.current.done.size).toBe(0);
  });

  it("still toggles when storage throws", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("denied");
      },
      setItem: () => {
        throw new Error("quota");
      },
    });
    const { result } = renderHook(() => useCompletedEdits("x"));
    act(() => result.current.toggle(0));
    expect([...result.current.done]).toEqual([0]);
  });
});
