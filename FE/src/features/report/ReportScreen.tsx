import { useMemo } from "react";
import type { ATSAnalysisResponse } from "../../types/ats";
import { AtsTipsList } from "./AtsTipsList";
import { EditChecklist } from "./EditChecklist";
import { KeywordsToAdd } from "./KeywordsToAdd";
import { ReportToolbar } from "./ReportToolbar";
import { reportKey } from "./reportKey";
import { ScoreBreakdownRows } from "./ScoreBreakdownRows";
import { ScoreRuler } from "./ScoreRuler";
import { ScoreVerdict } from "./ScoreVerdict";
import { StrengthsList } from "./StrengthsList";
import "./report.css";

export interface ReportScreenProps {
  report: ATSAnalysisResponse;
  fileName: string;
  /** App resets analysis and returns to the form with the posting and resume kept. */
  onNewComparison: () => void;
}

export function ReportScreen({ report, fileName, onNewComparison }: ReportScreenProps) {
  const key = useMemo(() => reportKey(report), [report]);

  return (
    <article className="report-sheet rounded-lg border border-rule bg-sheet">
      <header className="border-b border-rule px-5 py-4 sm:px-10">
        <ReportToolbar fileName={fileName} onNewComparison={onNewComparison} />
      </header>

      <div className="px-5 pt-8 sm:px-10 sm:pt-12">
        <ScoreVerdict score={report.current_score} summary={report.summary} />
      </div>

      <section aria-label="Match score" className="report-scores px-5 pb-10 pt-10 sm:px-10">
        <ScoreRuler
          current={report.current_score}
          projected={report.projected_score_after_improvements}
        />
        <h2 className="mt-8 text-sm font-semibold text-graphite">How the score breaks down</h2>
        <div className="mt-3">
          <ScoreBreakdownRows breakdown={report.score_breakdown} />
        </div>
      </section>

      <div className="report-columns grid gap-12 border-t border-rule px-5 py-10 sm:px-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-16">
        <EditChecklist improvements={report.improvements} reportKey={key} />
        <aside className="report-side space-y-10 lg:sticky lg:top-6 lg:self-start">
          <KeywordsToAdd keywords={report.missing_keywords} />
          <StrengthsList strengths={report.strengths} />
          <AtsTipsList tips={report.ats_compatibility_tips} />
        </aside>
      </div>
    </article>
  );
}
