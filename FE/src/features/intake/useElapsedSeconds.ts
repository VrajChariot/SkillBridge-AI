import { useEffect, useState } from "react";

/** Whole seconds since `startedAt` (a `Date.now()` timestamp), updated every second. */
export function useElapsedSeconds(startedAt: number): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [startedAt]);

  return Math.max(0, Math.floor((now - startedAt) / 1000));
}
