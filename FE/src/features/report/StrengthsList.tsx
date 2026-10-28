import { CheckCircle } from "@phosphor-icons/react";

/** What the resume already does well. Hidden when there is nothing to show. */
export function StrengthsList({ strengths }: { strengths: string[] }) {
  if (strengths.length === 0) return null;
  return (
    <section aria-labelledby="report-strengths-title">
      <h2 id="report-strengths-title" className="text-xl font-semibold">
        What's working
      </h2>
      <ul className="mt-3 space-y-2.5">
        {strengths.map((strength) => (
          <li key={strength} className="flex gap-2.5">
            <CheckCircle
              size={20}
              weight="fill"
              aria-hidden
              className="mt-0.5 shrink-0 text-matched"
            />
            <span>{strength}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
