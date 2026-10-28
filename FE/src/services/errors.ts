/**
 * Error contract shared with the backend.
 * Failed requests return `{ "detail": string, "code": ErrorCode }`.
 */
export type ErrorCode =
  | "network"
  | "timeout"
  | "file_too_large"
  | "unsupported_file_type"
  | "resume_unreadable"
  | "job_description_missing"
  | "job_description_too_long"
  | "analysis_failed"
  | "service_unavailable"
  | "unknown";

const BACKEND_CODES = new Set<ErrorCode>([
  "file_too_large",
  "unsupported_file_type",
  "resume_unreadable",
  "job_description_missing",
  "job_description_too_long",
  "analysis_failed",
  "service_unavailable",
]);

const STATUS_CODES: Record<number, ErrorCode> = {
  413: "file_too_large",
  415: "unsupported_file_type",
  502: "analysis_failed",
  503: "service_unavailable",
  504: "timeout",
};

export class ApiError extends Error {
  readonly code: ErrorCode;
  readonly status?: number;

  constructor(code: ErrorCode, message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

/** Builds an ApiError from a failed HTTP response. */
export function errorFromResponse(status: number, body: unknown): ApiError {
  const { code, detail } = readErrorBody(body);
  const resolved: ErrorCode =
    code && BACKEND_CODES.has(code as ErrorCode)
      ? (code as ErrorCode)
      : (STATUS_CODES[status] ?? "unknown");
  return new ApiError(resolved, detail ?? `Request failed with status ${status}`, status);
}

function readErrorBody(body: unknown): { code?: string; detail?: string } {
  if (typeof body !== "object" || body === null) return {};
  const { code, detail } = body as Record<string, unknown>;
  return {
    code: typeof code === "string" ? code : undefined,
    detail: typeof detail === "string" ? detail : undefined,
  };
}

export interface ErrorCopy {
  title: string;
  body: string;
}

/** What the person sees when an analysis fails: what happened and what to do. */
export function describeError(error: unknown): ErrorCopy {
  const code = error instanceof ApiError ? error.code : "unknown";
  return COPY[code];
}

const COPY: Record<ErrorCode, ErrorCopy> = {
  network: {
    title: "Can't reach SkillBridge",
    body: "Check your internet connection, then compare again.",
  },
  timeout: {
    title: "The comparison took too long",
    body: "Nothing was saved. Try again; long resumes and postings take longer.",
  },
  file_too_large: {
    title: "This resume is over 10 MB",
    body: "Export it as a smaller PDF (remove embedded images) and add it again.",
  },
  unsupported_file_type: {
    title: "This file type isn't supported",
    body: "Upload your resume as a PDF or Word (.docx) file.",
  },
  resume_unreadable: {
    title: "No text found in this resume",
    body: "It may be a scanned image. Export a text-based PDF from your editor and add it again.",
  },
  job_description_missing: {
    title: "The job posting is empty",
    body: "Paste the full posting, including responsibilities and requirements.",
  },
  job_description_too_long: {
    title: "The job posting is over 20,000 characters",
    body: "Paste only the role description, responsibilities and requirements.",
  },
  analysis_failed: {
    title: "The analysis didn't finish",
    body: "The AI returned an incomplete report. Compare again; it usually works on the next try.",
  },
  service_unavailable: {
    title: "SkillBridge is temporarily unavailable",
    body: "The analysis service is down. Try again in a few minutes.",
  },
  unknown: {
    title: "Something went wrong",
    body: "The comparison stopped unexpectedly. Try again.",
  },
};
