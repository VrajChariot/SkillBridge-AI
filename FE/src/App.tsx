import React, { useState, useEffect } from "react";
import {
  UploadForm,
  ScoreOverview,
  ScoreBreakdownComponent,
  StrengthList,
  ImprovementsList,
  MissingKeywords,
  AtsTips,
  SummaryCard,
  EmptyState,
} from "./components";
import { ATSAnalysisResponse, AnalysisState } from "./types/ats";
import { checkHealth } from "./services/api";

function App() {
  const [analysis, setAnalysis] = useState<AnalysisState>({
    loading: false,
    error: null,
    data: null,
    fileName: null,
  });

  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    // Check if backend is available
    checkHealth().then((healthy) => {
      if (!healthy) {
        setConnectionError(true);
      }
    });
  }, []);

  const handleAnalysisComplete = (
    data: ATSAnalysisResponse,
    fileName: string,
  ) => {
    setAnalysis({
      loading: false,
      error: null,
      data,
      fileName,
    });
  };

  const handleLoading = (loading: boolean) => {
    setAnalysis((prev) => ({
      ...prev,
      loading,
    }));
  };

  const handleError = (error: string | null) => {
    setAnalysis((prev) => ({
      ...prev,
      error,
    }));
  };

  const handleReset = () => {
    setAnalysis({
      loading: false,
      error: null,
      data: null,
      fileName: null,
    });
    setConnectionError(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary-600 flex items-center gap-2">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 1 1 0 000 2H9V3a3 3 0 013 3v4a3 3 0 01-3 3H6a3 3 0 01-3-3V5zm12.6 9.6a1 1 0 00-1.4-1.4A4 4 0 0014 16v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2a4 4 0 00-4-4h2a1 1 0 100-2H2a3 3 0 00-3 3v4a3 3 0 003 3h4a3 3 0 003-3v-4a4 4 0 013.6-3.9z"
                  clipRule="evenodd"
                />
              </svg>
              SkillBridge AI
            </h1>
            {analysis.data && (
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                ← Analyze Another
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Connection Error Alert */}
        {connectionError && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            <p className="font-semibold">⚠️ Backend Connection Error</p>
            <p className="text-sm mt-1">
              Unable to connect to the backend API. Make sure it's running on{" "}
              <code className="bg-red-100 px-1 rounded">
                http://localhost:8000
              </code>
            </p>
          </div>
        )}

        {/* Error Alert */}
        {analysis.error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            <p className="font-semibold">❌ Analysis Failed</p>
            <p className="text-sm mt-1">{analysis.error}</p>
          </div>
        )}

        {/* Empty State or Upload Form */}
        {!analysis.data ? (
          <div className="flex flex-col items-center justify-center">
            <EmptyState />
            <div className="mt-12 w-full max-w-2xl">
              <UploadForm
                onAnalysisComplete={handleAnalysisComplete}
                onLoading={handleLoading}
                onError={handleError}
                loading={analysis.loading}
              />
            </div>
          </div>
        ) : (
          // Results View
          <div className="space-y-8">
            {/* Header */}
            <div>
              <p className="text-gray-600 text-sm">
                <span className="font-semibold">Resume analyzed:</span>{" "}
                {analysis.fileName}
              </p>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">
                Resume Analysis Results
              </h1>
            </div>

            {/* Score Overview */}
            <ScoreOverview
              currentScore={analysis.data.current_score}
              projectedScore={analysis.data.projected_score_after_improvements}
            />

            {/* Summary */}
            <SummaryCard summary={analysis.data.summary} />

            {/* Score Breakdown */}
            <ScoreBreakdownComponent
              breakdown={analysis.data.score_breakdown}
            />

            {/* Strengths */}
            {analysis.data.strengths.length > 0 && (
              <StrengthList strengths={analysis.data.strengths} />
            )}

            {/* Improvements */}
            {analysis.data.improvements.length > 0 && (
              <ImprovementsList improvements={analysis.data.improvements} />
            )}

            {/* Missing Keywords */}
            {analysis.data.missing_keywords.length > 0 && (
              <MissingKeywords keywords={analysis.data.missing_keywords} />
            )}

            {/* ATS Tips */}
            {analysis.data.ats_compatibility_tips.length > 0 && (
              <AtsTips tips={analysis.data.ats_compatibility_tips} />
            )}

            {/* Upload Another */}
            <div className="border-t pt-8 mt-8">
              <button
                onClick={handleReset}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Analyze Another Resume
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-gray-600 text-sm">
            Made with ❤️ and ☕ by <span className="font-semibold">Vraj</span>
          </p>
          <p className="text-gray-500 text-xs mt-2">
            SkillBridge AI • Powered by Google Gemini
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
