import { useCallback, useEffect, useState } from "react";

const storageKey = (key: string) => `skillbridge:report-edits:${key}`;

function load(key: string): Set<number> {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(storageKey(key)) ?? "[]");
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((n): n is number => Number.isInteger(n) && n >= 0));
  } catch {
    return new Set();
  }
}

/** Which edits (by report index) the user marked done. Survives refresh; storage failures only lose persistence. */
export function useCompletedEdits(reportKey: string) {
  const [state, setState] = useState(() => ({ key: reportKey, done: load(reportKey) }));
  const done = state.key === reportKey ? state.done : load(reportKey);

  useEffect(() => {
    if (state.key !== reportKey) setState({ key: reportKey, done: load(reportKey) });
  }, [reportKey, state.key]);

  const toggle = useCallback(
    (index: number) => {
      setState((prev) => {
        const next = new Set(prev.key === reportKey ? prev.done : load(reportKey));
        if (next.has(index)) next.delete(index);
        else next.add(index);
        try {
          localStorage.setItem(storageKey(reportKey), JSON.stringify([...next]));
        } catch {
          // Private mode or quota: keep the in-memory state.
        }
        return { key: reportKey, done: next };
      });
    },
    [reportKey],
  );

  return { done, toggle };
}
