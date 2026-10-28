/** Formatting advice for applicant tracking systems. Hidden when empty. */
export function AtsTipsList({ tips }: { tips: string[] }) {
  if (tips.length === 0) return null;
  return (
    <section aria-labelledby="report-tips-title">
      <h2 id="report-tips-title" className="text-xl font-semibold">
        Formatting tips for ATS
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 marker:text-graphite">
        {tips.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
    </section>
  );
}
