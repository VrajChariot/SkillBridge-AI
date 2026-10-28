import "./ProgressBar.css";

export interface ProgressBarProps {
  label: string;
  /** 0..100; omit while the remaining time is unknown. */
  percent?: number;
}

/** Thin progress track: a filled share when known, a sweeping segment otherwise. */
export function ProgressBar({ label, percent }: ProgressBarProps) {
  const known = percent !== undefined;
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={known ? 0 : undefined}
      aria-valuemax={known ? 100 : undefined}
      aria-valuenow={percent}
      className="relative h-1 w-full overflow-hidden rounded-full bg-rule"
    >
      {known ? (
        <div
          className="h-full rounded-full bg-ink transition-[width] duration-200 ease-out"
          style={{ width: `${percent}%` }}
        />
      ) : (
        <div className="intake-progress-sweep bg-ink" />
      )}
    </div>
  );
}
