import { MAX_RESUME_BYTES, MEGABYTE } from "./limits";

export type ResumeKind = "pdf" | "docx";

export type ResumeCheck =
  | { ok: true; kind: ResumeKind }
  | { ok: false; message: string };

type FileLike = Pick<File, "name" | "size" | "type">;

const MIME_KINDS: Record<string, ResumeKind> = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

/**
 * PDF or DOCX by MIME type or extension: some browsers report an empty
 * MIME type for .docx files.
 */
export function resumeKind(file: Pick<File, "name" | "type">): ResumeKind | null {
  const byMime = MIME_KINDS[file.type.toLowerCase()];
  if (byMime) return byMime;
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) return "pdf";
  if (name.endsWith(".docx")) return "docx";
  return null;
}

export function validateResume(file: FileLike): ResumeCheck {
  const kind = resumeKind(file);
  if (!kind) return { ok: false, message: "Upload a PDF or Word (.docx) file." };
  if (file.size === 0) {
    return { ok: false, message: "This file is empty. Choose the saved copy of your resume." };
  }
  if (file.size > MAX_RESUME_BYTES) {
    return {
      ok: false,
      message: `This file is ${overLimitMegabytes(file.size)} MB. The limit is 10 MB.`,
    };
  }
  return { ok: true, kind };
}

/** Rounds up so a file just over the limit never reads as "10 MB". */
function overLimitMegabytes(bytes: number): string {
  return (Math.ceil((bytes / MEGABYTE) * 10) / 10).toFixed(1);
}

export const MISSING_RESUME = "Add your resume as a PDF or Word (.docx) file.";
