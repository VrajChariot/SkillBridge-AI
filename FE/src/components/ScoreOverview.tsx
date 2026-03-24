import React from "react";

interface ScoreOverviewProps {
  currentScore: number;
  projectedScore: number;
}

export const ScoreOverview: React.FC<ScoreOverviewProps> = ({
  currentScore,
  projectedScore,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Current Score */}
      <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-primary-600">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">
              Current ATS Score
            </p>
            <p className="text-5xl font-bold text-primary-600 mt-2">
              {currentScore}
            </p>
            <p className="text-gray-500 text-sm mt-2">out of 100</p>
          </div>
          <div className="relative w-24 h-24">
            <svg className="w-full h-full" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#0284c7"
                strokeWidth="8"
                strokeDasharray={`${(currentScore / 100) * 339.29} 339.29`}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-primary-600">
                {currentScore}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Projected Score */}
      <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-green-600">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">
              Projected Score
            </p>
            <p className="text-5xl font-bold text-green-600 mt-2">
              {projectedScore}
            </p>
            <p className="text-gray-500 text-sm mt-2">after improvements</p>
          </div>
          <div className="relative w-24 h-24">
            <svg className="w-full h-full" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#16a34a"
                strokeWidth="8"
                strokeDasharray={`${(projectedScore / 100) * 339.29} 339.29`}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-green-600">
                {projectedScore}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
