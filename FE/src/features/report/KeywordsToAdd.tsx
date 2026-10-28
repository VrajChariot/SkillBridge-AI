import { useEffect, useState } from "react";
import { Copy } from "@phosphor-icons/react";
import { Button, Mark } from "../../ui";

type CopyStatus = "idle" | "copied" | "failed";

/** Terms from the posting the resume lacks, with one-click copy. */
export function KeywordsToAdd({ keywords }: { keywords: string[] }) {
  const [status, setStatus] = useState<CopyStatus>("idle");

  useEffect(() => {
    if (status !== "copied") return;
    const timer = window.setTimeout(() => setStatus("idle"), 4000);
    return () => window.clearTimeout(timer);
  }, [status]);

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(keywords.join(", "));
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  };

  return (
    <section aria-labelledby="report-keywords-title">
      <h2 id="report-keywords-title" className="text-xl font-semibold">
        Keywords to add
      </h2>
      {keywords.length === 0 ? (
        <p className="mt-2 text-graphite">Your resume already covers the posting's key terms.</p>
      ) : (
        <>
          <p className="mt-1 text-sm text-graphite">
            Work these into your experience bullets where they are true for you.
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-2 gap-y-2 leading-relaxed">
            {keywords.map((keyword) => (
              <li key={keyword}>
                <Mark>{keyword}</Mark>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2" data-print="hide">
            <Button variant="secondary" onClick={copyAll}>
              <Copy size={16} aria-hidden />
              Copy all keywords
            </Button>
            <p aria-live="polite" className="text-sm text-graphite">
              {status === "copied" &&
                `Copied ${keywords.length} ${keywords.length === 1 ? "keyword" : "keywords"}`}
              {status === "failed" && "Copy is blocked in this browser. Select the keywords and copy them."}
            </p>
          </div>
        </>
      )}
    </section>
  );
}
