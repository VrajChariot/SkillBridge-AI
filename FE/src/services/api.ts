import { ATSAnalysisResponse } from "../types/ats";

const API_BASE_URL = "http://localhost:8000";

export const uploadAndAnalyzeResume = async (
  file: File,
  jobDescription: string,
): Promise<ATSAnalysisResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("job_description", jobDescription);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || `Upload failed with status ${response.status}`,
    );
  }

  return response.json();
};

export const checkHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
    });
    return response.ok;
  } catch {
    return false;
  }
};
