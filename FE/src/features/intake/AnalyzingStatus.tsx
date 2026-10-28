import { formatElapsed } from "./formatElapsed";
import { ProgressBar } from "./ProgressBar";
import { analyzingHint } from "./progressCopy";
import { useElapsedSeconds } from "./useElapsedSeconds";

export function AnalyzingStatus({ startedAt }: { startedAt: number }) {
  const seconds = useElapsedSeconds(startedAt);
  return (
    <div className="flex flex-col gap-3">
      <p className="flex items-baseline justify-between gap-4 font-medium">
        Reading your resume against the posting
        <span className="shrink-0 text-graphite">
          <span className="sr-only">Elapsed time </span>
          {formatElapsed(seconds)}
        </span>
      </p>
      <ProgressBar label="Comparison in progress" />
      <p className="text-sm text-graphite">{analyzingHint(seconds)}</p>
    </div>
  );
}
