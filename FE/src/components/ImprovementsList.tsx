import React from "react";
import { Improvement } from "../types/ats";

interface ImprovementsListProps {
  improvements: Improvement[];
}

const getImpactStyles = (impact: string) => {
  switch (impact) {
    case "high":
      return "bg-red-100 text-red-800 border-red-300";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "low":
      return "bg-green-100 text-green-800 border-green-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

const getImpactLabel = (impact: string) => {
  return impact.charAt(0).toUpperCase() + impact.slice(1) + " Priority";
};

export const ImprovementsList: React.FC<ImprovementsListProps> = ({
  improvements,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <svg
          className="w-6 h-6 text-blue-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 3.062v6.036a3 3 0 01-.675 1.9A4 4 0 0016 17H4a4 4 0 00-3.675-2.707A3 3 0 014 9.059v-6.036a3.066 3.066 0 012.267-3.066z"
            clipRule="evenodd"
          />
        </svg>
        Areas for Improvement
      </h2>
      <div className="grid gap-4">
        {improvements.map((improvement, idx) => (
          <div
            key={idx}
            className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  {improvement.section}
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mt-1">
                  {improvement.issue}
                </h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${getImpactStyles(improvement.impact)}`}
              >
                {getImpactLabel(improvement.impact)}
              </span>
            </div>
            <div className="bg-gray-50 rounded p-4 mt-4">
              <p className="text-sm text-gray-600 mb-1 font-semibold">
                Suggestion:
              </p>
              <p className="text-sm text-gray-700">{improvement.suggestion}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
