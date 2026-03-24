import React from "react";
import { ScoreBreakdown } from "../types/ats";

interface ScoreBreakdownProps {
  breakdown: ScoreBreakdown;
}

const scoreCategories = [
  { key: "keyword_match", label: "Keyword Match" },
  { key: "experience_relevance", label: "Experience Relevance" },
  { key: "skills_alignment", label: "Skills Alignment" },
  { key: "education_fit", label: "Education Fit" },
  { key: "formatting_clarity", label: "Formatting & Clarity" },
] as const;

export const ScoreBreakdownComponent: React.FC<ScoreBreakdownProps> = ({
  breakdown,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Score Breakdown</h2>
      <div className="space-y-6">
        {scoreCategories.map(({ key, label }) => {
          const score = breakdown[key];
          const percentage = (score / 100) * 100;

          return (
            <div key={key}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  {label}
                </span>
                <span className="text-sm font-bold text-primary-600">
                  {score}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
