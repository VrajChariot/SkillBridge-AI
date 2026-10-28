import { useCallback, useEffect, useRef, useState } from "react";
import { checkHealth } from "../services/api";

export type ServiceHealth = "checking" | "online" | "offline";

export function useServiceHealth(): { health: ServiceHealth; recheck: () => void } {
  const [health, setHealth] = useState<ServiceHealth>("checking");
  const controller = useRef<AbortController | null>(null);

  const recheck = useCallback(() => {
    controller.current?.abort();
    const current = new AbortController();
    controller.current = current;
    setHealth("checking");
    checkHealth(current.signal).then((ok) => {
      if (!current.signal.aborted) setHealth(ok ? "online" : "offline");
    });
  }, []);

  useEffect(() => {
    recheck();
    return () => controller.current?.abort();
  }, [recheck]);

  return { health, recheck };
}
