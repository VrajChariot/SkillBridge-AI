import { ArrowCounterClockwise, Printer } from "@phosphor-icons/react";
import { Button } from "../../ui";

interface ReportToolbarProps {
  fileName: string;
  onNewComparison: () => void;
}

export function ReportToolbar({ fileName, onNewComparison }: ReportToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
      <p className="min-w-0 break-words text-sm text-graphite">
        Compared <span className="font-medium text-ink">{fileName}</span> with the job posting
      </p>
      <div className="flex gap-2 whitespace-nowrap" data-print="hide">
        <Button variant="secondary" onClick={onNewComparison}>
          <ArrowCounterClockwise size={16} aria-hidden />
          New comparison
        </Button>
        <Button variant="secondary" onClick={() => window.print()}>
          <Printer size={16} aria-hidden />
          Print report
        </Button>
      </div>
    </div>
  );
}
