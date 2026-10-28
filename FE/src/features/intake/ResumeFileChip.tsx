import { FileDoc, FilePdf } from "@phosphor-icons/react";
import { formatBytes } from "./formatBytes";
import { resumeKind } from "./validateResume";

export interface ResumeFileChipProps {
  file: File;
  disabled: boolean;
  onReplace: () => void;
  onRemove: () => void;
}

const actionClass =
  "-mx-1 rounded-sm px-1 py-1 text-sm font-medium text-ink underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-50";

/** The chosen resume: type, name, size, and ways to change it. */
export function ResumeFileChip({ file, disabled, onReplace, onRemove }: ResumeFileChipProps) {
  const Icon = resumeKind(file) === "docx" ? FileDoc : FilePdf;
  return (
    <div className="flex items-start gap-3 rounded-sm border border-rule bg-paper px-3 py-3">
      <Icon size={32} weight="regular" aria-hidden className="shrink-0 text-ink" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium" title={file.name}>
          {file.name}
        </p>
        <p className="tabular text-sm text-graphite">{formatBytes(file.size)}</p>
        <div className="mt-1 flex gap-5">
          <button type="button" className={actionClass} disabled={disabled} onClick={onReplace}>
            Replace
          </button>
          <button type="button" className={actionClass} disabled={disabled} onClick={onRemove}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
