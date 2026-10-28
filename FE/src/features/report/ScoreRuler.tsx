import type { CSSProperties } from "react";
import { Mark } from "../../ui";
import { clampScore } from "./scoreBand";
import { scaleGrid } from "./scaleGrid";

interface ScoreRulerProps {
  current: number;
  projected: number;
}

const ticks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

/** The report's signature: the score as a position on a 0-100 ruler, with the reachable gain swiped in highlighter. */
export function ScoreRuler({ current, projected }: ScoreRulerProps) {
  const now = Math.round(clampScore(current));
  const after = Math.round(clampScore(projected));
  const gain = after - now;

  const label =
    gain > 0
      ? `Match score ${now} out of 100. About ${after} after the suggested edits.`
      : `Match score ${now} out of 100. No further gain expected from edits.`;
  // "Now" label (3rem) sits left of its pin; leave room for the "After edits" label (6rem) on its right.
  const nowLeft = `max(0rem, min(calc(${now}% - 3.5rem), calc(100% - ${gain > 0 ? 9.75 : 3}rem)))`;

  return (
    <div className={`${scaleGrid} items-end gap-y-4`}>
      <p className="order-2 col-span-2 text-base sm:order-none sm:col-span-1 sm:pb-10">
        {gain > 0 ? (
          <>
            <Mark>
              <span className="tabular font-semibold">+{gain} points</span>
            </Mark>{" "}
            if you make the edits below
          </>
        ) : (
          <span className="text-graphite">No further gain expected from edits.</span>
        )}
      </p>

      <div role="img" aria-label={label} className="relative h-36">
        {/* Labels sit in their own band above the pins, clamped so they never overlap or leave the track. */}
        <RulerLabel caption="Now" value={now} left={nowLeft} width="w-12" filled />
        {gain > 0 && (
          <RulerLabel
            caption="After edits"
            value={after}
            left={`max(calc(${nowLeft} + 3.75rem), min(calc(${after}% + 0.5rem), calc(100% - 6rem)))`}
            width="w-24"
          />
        )}
        <RulerPin value={now} filled />
        {gain > 0 && <RulerPin value={after} />}

        {gain > 0 && (
          <div
            aria-hidden
            className="report-swipe absolute top-[5.25rem] h-6 rounded-sm bg-highlighter"
            style={{ left: `${now}%`, width: `${gain}%` }}
          />
        )}
        <div className="absolute inset-x-0 top-[6rem] h-0.5 -translate-y-1/2 bg-ink" aria-hidden />

        {ticks.map((t) => (
          <div
            key={t}
            aria-hidden
            className={`absolute top-[6rem] flex -translate-x-1/2 flex-col items-center ${
              t % 20 === 0 ? "" : "max-sm:hidden"
            }`}
            style={{ left: `${t}%` }}
          >
            <span className="flex h-3 items-start">
              <span className={`w-px bg-ink ${t % 50 === 0 ? "h-3" : "h-2"}`} />
            </span>
            <span className="tabular mt-1 text-xs text-graphite">{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface RulerLabelProps {
  caption: string;
  value: number;
  /** CSS `left` expression. */
  left: string;
  width: string;
  filled?: boolean;
}

function RulerLabel({ caption, value, left, width, filled = false }: RulerLabelProps) {
  return (
    <div
      aria-hidden
      className={`absolute top-0 whitespace-nowrap ${width} ${filled ? "text-right" : ""}`}
      style={{ left }}
    >
      <span className="block text-sm text-graphite">{caption}</span>
      <span
        className={`tabular block text-2xl font-semibold ${filled ? "text-ink" : "text-graphite"}`}
      >
        {value}
      </span>
    </div>
  );
}

function RulerPin({ value, filled = false }: { value: number; filled?: boolean }) {
  const style = { "--to": `${value}%`, left: `${value}%` } as CSSProperties;
  return (
    <div aria-hidden className="report-pin absolute top-16 z-10 h-8 w-0" style={style}>
      <span className="absolute inset-y-0 left-0 w-px -translate-x-1/2 bg-ink" />
      <span
        className={`absolute -bottom-2 left-0 size-4 -translate-x-1/2 rounded-full border-2 border-ink ${
          filled ? "bg-ink" : "bg-sheet"
        }`}
      />
    </div>
  );
}
