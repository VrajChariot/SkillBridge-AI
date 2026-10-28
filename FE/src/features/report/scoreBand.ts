export type ScoreBand = "strong" | "good" | "partial" | "weak";

/** Clamp any score into 0..100; NaN becomes 0. */
export function clampScore(score: number): number {
  if (Number.isNaN(score)) return 0;
  return Math.min(100, Math.max(0, score));
}

export function scoreBand(score: number): ScoreBand {
  const s = clampScore(score);
  if (s >= 80) return "strong";
  if (s >= 60) return "good";
  if (s >= 40) return "partial";
  return "weak";
}

const verdicts: Record<ScoreBand, string> = {
  strong: "Strong match for this job",
  good: "Good match, with gaps to close",
  partial: "Partial match for this job",
  weak: "Weak match for this job",
};

export function verdictFor(score: number): string {
  return verdicts[scoreBand(score)];
}
