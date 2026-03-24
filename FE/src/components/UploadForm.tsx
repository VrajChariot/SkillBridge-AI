import React, { useState } from "react";
import { uploadAndAnalyzeResume } from "../services/api";
import { ATSAnalysisResponse } from "../types/ats";

interface UploadFormProps {
  onAnalysisComplete: (data: ATSAnalysisResponse, fileName: string) => void;
  onLoading: (loading: boolean) => void;
  onError: (error: string | null) => void;
  loading?: boolean;
}

export const UploadForm: React.FC<UploadFormProps> = ({
  onAnalysisComplete,
  onLoading,
  onError,
  loading = false,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [fileError, setFileError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(selectedFile.type)) {
      setFileError("Please upload a PDF or DOCX file");
      setFile(null);
      return;
    }

    setFileError("");
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setFileError("Please select a file");
      return;
    }

    if (!jobDescription.trim()) {
      onError("Please enter a job description");
      return;
    }

    try {
      onLoading(true);
      onError(null);
      const result = await uploadAndAnalyzeResume(file, jobDescription);
      onAnalysisComplete(result, file.name);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to analyze resume";
      onError(errorMessage);
    } finally {
      onLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Resume Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Your Resume
          </label>
          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-primary-500 transition-colors cursor-pointer bg-gray-50 hover:bg-primary-50">
            <input
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={loading}
            />
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-8-12v8m0 0l-3-3m3 3l3-3"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-2 text-sm font-medium text-gray-700">
                {file ? file.name : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PDF or DOCX up to 10MB
              </p>
            </div>
          </div>
          {fileError && (
            <p className="mt-2 text-sm text-red-600">{fileError}</p>
          )}
        </div>

        {/* Job Description */}
        <div>
          <label
            htmlFor="jobDescription"
            className="block text-sm font-semibold text-gray-700 mb-3"
          >
            Job Description
          </label>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            disabled={loading}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !file}
          className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Analyzing Resume...
            </>
          ) : (
            "Analyze Resume"
          )}
        </button>
      </form>
    </div>
  );
};
