import { FileDoc, FilePdf } from "@phosphor-icons/react";
import { Button } from "../../ui";
import { formatBytes } from "./formatBytes";
import { resumeKind } from "./validateResume";

export interface ResumeFileChipProps {
  file: File;
  disabled: boolean;
  onReplace: () => void;
  onRemove: () => void;
}

/** The chosen resume: type, name, size, and ways to change it. */
export function ResumeFileChip({ file, disabled, onReplace, onRemove }: ResumeFileChipProps) {
  const Icon = resumeKind(file) === "docx" ? FileDoc : FilePdf;
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-sm border border-rule bg-paper py-3 pl-3 pr-2">
      <Icon size={32} weight="regular" aria-hidden className="shrink-0 text-ink" />
      <div className="min-w-0 flex-1 basis-40">
        <p className="truncate font-medium" title={file.name}>
          {file.name}
        </p>
        <p className="tabular text-sm text-graphite">{formatBytes(file.size)}</p>
      </div>
      <div className="flex shrink-0 items-center">
        <Button variant="quiet" className="px-3" disabled={disabled} onClick={onReplace}>
          Replace
        </Button>
        <Button variant="quiet" className="px-3" disabled={disabled} onClick={onRemove}>
          Remove
        </Button>
      </div>
    </div>
  );
}
