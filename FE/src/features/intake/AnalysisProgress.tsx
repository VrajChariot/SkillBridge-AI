import { useEffect, useRef } from "react";
import { Button } from "../../ui";
import { AnalyzingStatus } from "./AnalyzingStatus";
import { UploadStatus } from "./UploadStatus";

export type BusyState =
  | { phase: "uploading"; progress: number }
  | { phase: "analyzing"; startedAt: number };

export interface AnalysisProgressProps {
  state: BusyState;
  onCancel: () => void;
}

/** Replaces the action row while a comparison runs. */
export function AnalysisProgress({ state, onCancel }: AnalysisProgressProps) {
  const region = useRef<HTMLDivElement>(null);

  // The submit button just disappeared; keep keyboard focus in the same spot.
  useEffect(() => {
    region.current?.focus();
  }, []);

  return (
    <div
      ref={region}
      tabIndex={-1}
      className="flex flex-wrap items-end gap-x-8 gap-y-4 focus:outline-none"
    >
      <div className="min-w-0 max-w-xl flex-1 basis-72">
        {state.phase === "uploading" ? (
          <UploadStatus progress={state.progress} />
        ) : (
          <AnalyzingStatus startedAt={state.startedAt} />
        )}
      </div>
      <Button variant="secondary" size="lg" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
}
