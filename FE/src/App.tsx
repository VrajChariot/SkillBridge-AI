import { useState } from "react";
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
import { AppFooter } from "./app/AppFooter";
import { AppHeader } from "./app/AppHeader";
import { ServiceNotice } from "./app/ServiceNotice";

function App() {
  const [analysis, setAnalysis] = useState<AnalysisState>({
    loading: false,
    error: null,
    data: null,
    fileName: null,
  });

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
  };

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader
        actions={
          analysis.data && (
            <button onClick={handleReset} className="text-sm font-medium">
              Analyze another
            </button>
          )
        }
      />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-12 sm:px-8">
        <div className="mb-8">
          <ServiceNotice />
        </div>

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
      <AppFooter />
    </div>
  );
}

export default App;
