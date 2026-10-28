import { verdictFor } from "./scoreBand";

interface ScoreVerdictProps {
  score: number;
  summary: string;
}

/** Plain-language verdict for the score band, followed by the model's summary. */
export function ScoreVerdict({ score, summary }: ScoreVerdictProps) {
  return (
    <div>
      <h1 className="text-2xl font-semibold sm:text-3xl">{verdictFor(score)}</h1>
      <p className="mt-4 max-w-prose text-md text-graphite">{summary}</p>
    </div>
  );
}
