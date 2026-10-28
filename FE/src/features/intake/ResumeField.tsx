import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { FileArrowUp } from "@phosphor-icons/react";
import { FieldError } from "./FieldError";
import { ResumeFileChip } from "./ResumeFileChip";

export interface ResumeFieldProps {
  file: File | null;
  error: string | null;
  disabled: boolean;
  /** A file was chosen or dropped; the caller validates it. */
  onPick: (file: File) => void;
  onRemove: () => void;
}

const INPUT_ID = "resume-file";
const ERROR_ID = "resume-file-error";
const REQUIREMENTS_ID = "resume-file-requirements";
const HEADING_ID = "resume-heading";
const CHOOSE_ID = "resume-choose";
const ACCEPT =
  ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const hasFiles = (event: DragEvent) => event.dataTransfer.types.includes("Files");

/** The resume sheet: drop a file anywhere on it, or choose one. */
export const ResumeField = forwardRef<HTMLInputElement, ResumeFieldProps>(function ResumeField(
  { file, error, disabled, onPick, onRemove },
  ref,
) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dragDepth = useRef(0);
  const [dragging, setDragging] = useState(false);

  // A file dropped just outside the sheet would otherwise open in the tab
  // and throw away the pasted posting.
  useEffect(() => {
    const keepPage = (event: globalThis.DragEvent) => {
      if (event.dataTransfer?.types.includes("Files")) event.preventDefault();
    };
    window.addEventListener("dragover", keepPage);
    window.addEventListener("drop", keepPage);
    return () => {
      window.removeEventListener("dragover", keepPage);
      window.removeEventListener("drop", keepPage);
    };
  }, []);

  const setRefs = (node: HTMLInputElement | null) => {
    inputRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const chosen = event.target.files?.[0];
    // Reset so choosing the same file again still fires a change.
    event.target.value = "";
    if (chosen) onPick(chosen);
  };

  const handleDragEnter = (event: DragEvent) => {
    if (disabled || !hasFiles(event)) return;
    event.preventDefault();
    dragDepth.current += 1;
    setDragging(true);
  };

  const handleDragOver = (event: DragEvent) => {
    if (disabled || !hasFiles(event)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };

  const handleDragLeave = () => {
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setDragging(false);
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    const dropped = event.dataTransfer.files[0];
    if (!disabled && dropped) onPick(dropped);
  };

  const describedBy = error ? `${ERROR_ID} ${REQUIREMENTS_ID}` : REQUIREMENTS_ID;

  const input = (
    <input
      ref={setRefs}
      id={INPUT_ID}
      type="file"
      accept={ACCEPT}
      disabled={disabled}
      tabIndex={file ? -1 : undefined}
      onChange={handleChange}
      aria-labelledby={file ? HEADING_ID : `${HEADING_ID} ${CHOOSE_ID}`}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy}
      className="peer sr-only"
    />
  );

  return (
    <div className="flex flex-1 flex-col gap-2">
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-1 flex-col gap-4 rounded-lg border px-5 pb-5 pt-4 sm:px-6 sm:pt-5 ${
          dragging
            ? "border-dashed border-ink bg-paper"
            : `bg-sheet ${error ? "border-correction" : "border-rule"}`
        }`}
      >
        <h2 id={HEADING_ID} className="font-semibold">
          Your resume
        </h2>
        {file ? (
          <div className="flex flex-1 flex-col gap-3">
            {input}
            <ResumeFileChip
              file={file}
              disabled={disabled}
              onReplace={() => inputRef.current?.click()}
              onRemove={onRemove}
            />
            <p id={REQUIREMENTS_ID} className="text-sm text-graphite">
              {dragging ? "Release to replace it." : "Drop another file here to replace it."}
            </p>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-1 py-6 text-center">
            <FileArrowUp size={40} weight="regular" aria-hidden className="mb-2 text-graphite" />
            <p className="font-medium">
              {dragging ? "Release to add your resume" : "Drop your resume here"}
            </p>
            <p id={REQUIREMENTS_ID} className="text-sm text-graphite">
              PDF or Word (.docx), up to 10 MB
            </p>
            {input}
            <label
              id={CHOOSE_ID}
              htmlFor={INPUT_ID}
              className={`mt-4 inline-flex h-10 items-center justify-center rounded border border-rule-strong bg-sheet px-4 text-sm font-medium text-ink transition-colors hover:border-ink peer-focus:outline peer-focus:outline-2 peer-focus:outline-offset-2 peer-focus:outline-ink ${
                disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
            >
              Choose file
            </label>
          </div>
        )}
      </div>
      {error && <FieldError id={ERROR_ID} message={error} />}
    </div>
  );
});
