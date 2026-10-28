import type { ATSAnalysisResponse } from "../types/ats";
import { ApiError, errorFromResponse } from "./errors";

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "/api").replace(/\/$/, "");

/** Gemini with deep reasoning can take a while; stop waiting after this. */
const ANALYSIS_TIMEOUT_MS = 150_000;

export interface AnalyzeOptions {
  signal?: AbortSignal;
  /** Upload progress as a fraction from 0 to 1. */
  onUploadProgress?: (fraction: number) => void;
  /** Called once the file is fully sent and the server is working. */
  onUploaded?: () => void;
}

/**
 * Sends the resume and job posting for analysis.
 * Uses XMLHttpRequest because fetch cannot report upload progress.
 * Rejects with ApiError, or a DOMException named "AbortError" when cancelled.
 */
export function analyzeResume(
  file: File,
  jobDescription: string,
  { signal, onUploadProgress, onUploaded }: AnalyzeOptions = {},
): Promise<ATSAnalysisResponse> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Analysis cancelled", "AbortError"));
      return;
    }

    const body = new FormData();
    body.append("file", file);
    body.append("job_description", jobDescription);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE_URL}/upload`);
    xhr.responseType = "json";
    xhr.timeout = ANALYSIS_TIMEOUT_MS;

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onUploadProgress?.(event.loaded / event.total);
    };
    xhr.upload.onload = () => onUploaded?.();

    const onAbort = () => xhr.abort();
    signal?.addEventListener("abort", onAbort, { once: true });
    const settle = () => signal?.removeEventListener("abort", onAbort);

    xhr.onload = () => {
      settle();
      if (xhr.status >= 200 && xhr.status < 300 && xhr.response) {
        resolve(xhr.response as ATSAnalysisResponse);
      } else {
        reject(errorFromResponse(xhr.status, xhr.response));
      }
    };
    xhr.onerror = () => {
      settle();
      reject(new ApiError("network", "Network request failed"));
    };
    xhr.ontimeout = () => {
      settle();
      reject(new ApiError("timeout", "Analysis timed out"));
    };
    xhr.onabort = () => {
      settle();
      reject(new DOMException("Analysis cancelled", "AbortError"));
    };

    xhr.send(body);
  });
}

export async function checkHealth(signal?: AbortSignal): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, { signal });
    return response.ok;
  } catch {
    return false;
  }
}
