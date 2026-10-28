import { WarningCircle } from "@phosphor-icons/react";
import type { ScoreBreakdown } from "../../types/ats";
import { clampScore } from "./scoreBand";
import { scaleGrid } from "./scaleGrid";

const rows: { key: keyof ScoreBreakdown; label: string }[] = [
  { key: "keyword_match", label: "Keyword match" },
  { key: "experience_relevance", label: "Experience relevance" },
  { key: "skills_alignment", label: "Skills alignment" },
  { key: "education_fit", label: "Education fit" },
  { key: "formatting_clarity", label: "Formatting and clarity" },
];

/** Five category scores on the same 0-100 scale as the ruler above. */
export function ScoreBreakdownRows({ breakdown }: { breakdown: ScoreBreakdown }) {
  return (
    <dl className="space-y-3">
      {rows.map(({ key, label }) => {
        const value = Math.round(clampScore(breakdown[key]));
        const weak = value < 50;
        return (
          <div key={key} className={`${scaleGrid} items-center gap-y-1`}>
            <dt className="col-span-2 text-sm sm:col-span-1">{label}</dt>
            <div aria-hidden className="relative h-1.5 bg-rule">
              <div
                className={`absolute inset-y-0 left-0 ${weak ? "bg-correction" : "bg-ink"}`}
                style={{ width: `${value}%` }}
              />
            </div>
            <dd
              className={`tabular flex items-center justify-end gap-1 text-sm font-semibold ${
                weak ? "text-correction" : ""
              }`}
            >
              {weak && <WarningCircle size={16} weight="bold" aria-hidden />}
              {value}
              {weak && <span className="sr-only">, below 50, needs work</span>}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
