import React from "react";

export const EmptyState: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          ATS Resume Analyzer
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Optimize your resume for Applicant Tracking Systems
        </p>
        <p className="text-gray-500">
          Upload your resume and job description to get an instant analysis
          powered by AI
        </p>
      </div>

      {/* Features Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl mb-3">📊</div>
          <h3 className="font-semibold text-gray-900 mb-2">ATS Scoring</h3>
          <p className="text-sm text-gray-600">
            Get scored 0-100 on your ATS compatibility
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl mb-3">🔍</div>
          <h3 className="font-semibold text-gray-900 mb-2">
            Detailed Breakdown
          </h3>
          <p className="text-sm text-gray-600">
            See scores across 5 key categories
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl mb-3">💡</div>
          <h3 className="font-semibold text-gray-900 mb-2">Actionable Tips</h3>
          <p className="text-sm text-gray-600">
            Get specific suggestions to improve
          </p>
        </div>
      </div>

      {/* Mock Results Preview */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-8">
        <p className="text-sm text-gray-600 text-center mb-6 font-semibold">
          👇 Here's what you'll see after uploading
        </p>

        {/* Score Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-primary-600">
            <p className="text-gray-600 text-sm font-medium uppercase">
              Current ATS Score
            </p>
            <p className="text-4xl font-bold text-primary-600 mt-2">78</p>
            <p className="text-gray-500 text-sm mt-2">out of 100</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
            <p className="text-gray-600 text-sm font-medium uppercase">
              Projected Score
            </p>
            <p className="text-4xl font-bold text-green-600 mt-2">92</p>
            <p className="text-gray-500 text-sm mt-2">after improvements</p>
          </div>
        </div>

        {/* Breakdown Preview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Score Breakdown
          </h3>
          <div className="space-y-4">
            {[
              { label: "Keyword Match", score: 85 },
              { label: "Experience Relevance", score: 80 },
              { label: "Skills Alignment", score: 75 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold text-gray-700">
                    {item.label}
                  </span>
                  <span className="text-sm font-bold text-primary-600">
                    {item.score}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
