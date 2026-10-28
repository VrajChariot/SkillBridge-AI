import { ProgressBar } from "./ProgressBar";
import { uploadPercent } from "./progressCopy";

export function UploadStatus({ progress }: { progress: number }) {
  const percent = uploadPercent(progress);
  return (
    <div className="flex flex-col gap-3">
      <p className="font-medium">
        Uploading resume, <span className="tabular">{percent}%</span>
      </p>
      <ProgressBar label="Resume upload" percent={percent} />
      <p className="text-sm text-graphite">Large PDFs take a few seconds.</p>
    </div>
  );
}
